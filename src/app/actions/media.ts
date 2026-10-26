"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function getMediaAssets() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

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
  if (!session) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

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
  } catch (e: any) {
    console.error("Upload error:", e);
    return { success: false, message: e.message || "Upload failed" };
  }
}
