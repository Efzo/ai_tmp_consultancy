import { get } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    let referenced = await prisma.caseStudy.findFirst({ where: { isPublished: true, status: "PUBLISHED", images: { has: `/api/media/${id}` } }, select: { id: true } });
    if (!referenced) {
      const snapshot = await prisma.siteSetting.findUnique({ where: { key: "page.about.published" } });
      const value = snapshot?.value as { content?: { imageUrl?: string }; unpublished?: boolean } | null;
      if (value && !value.unpublished && value.content?.imageUrl === `/api/media/${id}`) referenced = { id: "about" };
      if (!snapshot) referenced = await prisma.page.findFirst({ where: { slug: "about", isPublished: true, status: "PUBLISHED", content: { path: ["imageUrl"], equals: `/api/media/${id}` } }, select: { id: true } });
    }
    if (!referenced) return new Response(null, { status: 404 });
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset || !["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"].includes(asset.mimeType)) return new Response(null, { status: 404 });
    const result = await get(asset.storageKey, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) return new Response(null, { status: 404 });
    return new Response(result.stream, { headers: { "Content-Type": asset.mimeType, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "default-src 'none'; sandbox" } });
  } catch { return new Response(null, { status: 503 }); }
}
