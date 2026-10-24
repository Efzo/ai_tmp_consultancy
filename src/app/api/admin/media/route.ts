import { del, put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const allowedTypes = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/bmp", "image/tiff", "image/svg+xml", "image/x-icon", "image/heic", "image/heif",
  "application/pdf", "text/plain", "text/csv", "text/markdown", "application/rtf", "application/json", "application/xml", "text/xml",
  "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.oasis.opendocument.text", "application/vnd.oasis.opendocument.spreadsheet", "application/vnd.oasis.opendocument.presentation",
  "audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "video/mp4", "video/webm", "video/ogg",
]);
const allowedExtensions = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".bmp", ".tif", ".tiff", ".svg", ".ico", ".heic", ".heif",
  ".pdf", ".txt", ".md", ".markdown", ".csv", ".tsv", ".rtf", ".json", ".xml", ".yaml", ".yml", ".log",
  ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".odt", ".ods", ".odp", ".pages", ".numbers", ".key",
  ".mp3", ".wav", ".ogg", ".m4a", ".mp4", ".webm", ".ogv",
]);
const maxBytes = 10 * 1024 * 1024;
const maxFiles = 10;

function extensionFor(filename: string) {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot).toLowerCase() : "";
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!role || !["OWNER", "EDITOR"].includes(role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN.includes("demo_")) return NextResponse.json({ message: "Vercel Blob is not configured." }, { status: 503 });
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return NextResponse.json({ message: "Connect PostgreSQL before uploading media." }, { status: 503 });

  const formData = await request.formData();
  const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File);
  const altText = String(formData.get("altText") ?? "").trim();
  if (!files.length || files.length > maxFiles || altText.length < 2) return NextResponse.json({ message: `Choose between 1 and ${maxFiles} files and provide a meaningful description.` }, { status: 400 });
  const invalidFile = files.find((file) => (!allowedTypes.has(file.type) && !allowedExtensions.has(extensionFor(file.name))) || file.size > maxBytes);
  if (invalidFile) return NextResponse.json({ message: `“${invalidFile.name}” is not supported or exceeds the 10MB per-file limit. Executable and script files are not allowed.` }, { status: 400 });

  const assets = [];
  const failures: string[] = [];
  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    let blob: Awaited<ReturnType<typeof put>> | undefined;
    try {
      // The configured Vercel Blob store is private. Keep uploaded documents
      // behind the authenticated admin download route instead of publishing
      // invoices, templates, and other internal files to the public web.
      blob = await put(`media/${Date.now()}-${safeName}`, file, { access: "private", addRandomSuffix: true });
      const asset = await prisma.mediaAsset.create({ data: { url: blob.url, storageKey: blob.pathname, filename: file.name, altText, mimeType: file.type || "application/octet-stream", size: file.size } });
      assets.push(asset);
    } catch (error) {
      if (blob) await del(blob.url).catch(() => undefined);
      failures.push(file.name);
      console.error(`Media upload failed for ${file.name}.`, error instanceof Error ? error.message : "Unknown upload error");
    }
  }

  if (!assets.length) return NextResponse.json({ message: "None of the files could be uploaded. Verify Vercel Blob and PostgreSQL configuration." }, { status: 500 });
  const message = failures.length ? `${assets.length} file${assets.length === 1 ? "" : "s"} uploaded. Could not upload: ${failures.join(", " )}.` : `${assets.length} file${assets.length === 1 ? "" : "s"} uploaded successfully.`;
  return NextResponse.json({ assets, failures, message }, { status: failures.length ? 207 : 201 });
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
