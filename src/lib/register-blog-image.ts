import { head } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { blogImageMaxBytes, blogImagePathAllowed, blogImageTypes } from "@/lib/blog-image-upload";

export async function registerBlogImage(input: { pathname: string; userId: string; filename: string; alt: string }) {
  if (!blogImagePathAllowed(input.pathname, input.userId)) throw new Error("Invalid image path.");
  const blob = await head(input.pathname);
  if (new URL(blob.url).protocol !== "https:" || blob.pathname !== input.pathname || !blogImageTypes.includes(blob.contentType) || blob.size > blogImageMaxBytes || !blob.size || !new URL(blob.url).hostname.endsWith(".private.blob.vercel-storage.com")) throw new Error("Invalid image upload.");
  return prisma.mediaAsset.upsert({
    where: { storageKey: blob.pathname }, update: {},
    create: { storageKey: blob.pathname, url: blob.url, filename: input.filename, altText: input.alt, mimeType: blob.contentType, size: blob.size, uploadedById: input.userId },
    select: { id: true, filename: true, altText: true },
  });
}
