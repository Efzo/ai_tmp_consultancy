import { get } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!role || !["OWNER", "EDITOR"].includes(role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN.includes("demo_")) {
    return NextResponse.json({ message: "Vercel Blob is not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return NextResponse.json({ message: "Media asset not found." }, { status: 404 });

  try {
    const result = await get(asset.storageKey, { access: "private" });
    if (!result) return NextResponse.json({ message: "The media asset could not be found in storage." }, { status: 404 });
    if (result.statusCode === 304 || !result.stream) return new Response(null, { status: 304 });

    const filename = asset.filename.replace(/[\r\n"\\]/g, "_");
    return new Response(result.stream, {
      status: 200,
      headers: {
        "Content-Type": result.blob.contentType || asset.mimeType || "application/octet-stream",
        "Content-Length": String(result.blob.size),
        "Content-Disposition": `inline; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(asset.filename)}`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error(`Media asset read failed for ${asset.filename}.`, error instanceof Error ? error.message : "Unknown storage error");
    return NextResponse.json({ message: "The media asset could not be opened." }, { status: 502 });
  }
}
