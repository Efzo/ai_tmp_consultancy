"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function getMediaAssets() {
  const session = await getServerSession(authOptions);
  if (!session || !["OWNER", "EDITOR"].includes((session.user as { role?: string })?.role ?? "")) throw new Error("Unauthorized");

  try {
    return await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Error fetching media assets:", e);
    return [];
  }
}

export async function uploadMediaAsset(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !["OWNER", "EDITOR"].includes((session.user as { role?: string })?.role ?? "")) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!(file instanceof File)) throw new Error("No file provided");
  if (file.size > 10 * 1024 * 1024 || !/^(image\/(png|jpeg|webp|gif|avif)|video\/(mp4|webm))$/.test(file.type)) return { success: false, message: "Choose a supported image or video under 10MB." };

  try {
    // Upload to Vercel Blob
    // Set access to "private" because the store is configured as private
    const blob = await put(file.name, file, {
      access: "private",
    });

    // Save to DB
    const asset = await prisma.mediaAsset.create({
      data: {
        url: blob.url,
        storageKey: blob.url,
        filename: file.name,
        altText: file.name,
        mimeType: file.type,
        size: file.size,
        uploadedById: (session.user as { id?: string })?.id || null,
      },
    });

    return { success: true, asset };
  } catch (e) {
    console.error("Upload error:", e);
    return { success: false, message: e instanceof Error ? e.message : "Upload failed" };
  }
}
