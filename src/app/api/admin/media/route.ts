import { del, put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml", "application/pdf"]);
const maxBytes = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!role || !["OWNER", "EDITOR"].includes(role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN.includes("demo_")) return NextResponse.json({ message: "Vercel Blob is not configured." }, { status: 503 });
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return NextResponse.json({ message: "Connect PostgreSQL before uploading media." }, { status: 503 });

  const formData = await request.formData();
  const file = formData.get("file");
  const altText = String(formData.get("altText") ?? "").trim();
  if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size > maxBytes || altText.length < 2) return NextResponse.json({ message: "Provide an allowed file under 10MB and meaningful alt text." }, { status: 400 });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const blob = await put(`media/${Date.now()}-${safeName}`, file, { access: "public", addRandomSuffix: true });
  try {
    const asset = await prisma.mediaAsset.create({ data: { url: blob.url, storageKey: blob.pathname, filename: file.name, altText, mimeType: file.type, size: file.size } });
    return NextResponse.json({ asset }, { status: 201 });
  } catch {
    await del(blob.url);
    return NextResponse.json({ message: "The media record could not be saved." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.role || !["OWNER", "EDITOR"].includes(user.role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return NextResponse.json({ message: "Connect PostgreSQL before deleting media." }, { status: 503 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ message: "Media asset id is required." }, { status: 400 });
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return NextResponse.json({ message: "Media asset not found." }, { status: 404 });

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_READ_WRITE_TOKEN.includes("demo_")) await del(asset.url);
    await prisma.mediaAsset.delete({ where: { id } });
    await prisma.auditEvent.create({ data: { action: "media.deleted", target: id, actorId: user.id || null, metadata: { filename: asset.filename } } });
    revalidatePath("/admin/media");
    return NextResponse.json({ message: "Media asset deleted." });
  } catch {
    return NextResponse.json({ message: "The media asset could not be deleted." }, { status: 500 });
  }
}
