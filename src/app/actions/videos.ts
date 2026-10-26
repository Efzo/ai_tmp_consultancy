"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const videoSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(500),
  url: z.string().trim().url(),
  category: z.string().trim().min(2).max(80),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

async function requireRole(roles: Array<"OWNER" | "EDITOR"> = ["OWNER", "EDITOR"]) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (!role || !roles.includes(role as any)) throw new Error("Unauthorized");
}

export async function saveVideoInsight(input: unknown) {
  await requireRole();
  const parsed = videoSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid video data." };

  const data = parsed.data;
  try {
    if (data.id) {
      await prisma.videoInsight.update({ where: { id: data.id }, data });
    } else {
      await prisma.videoInsight.create({ data });
    }
    revalidatePath("/");
    revalidatePath("/admin/videos");
    return { success: true, message: "Video insight saved." };
  } catch (e: any) {
    return { success: false, message: e.message || "Database error. Please ensure the VideoInsight table is created." };
  }
}

export async function deleteVideoInsight(id: string) {
  await requireRole(["OWNER"]);
  try {
    await prisma.videoInsight.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/videos");
    return { success: true, message: "Video insight deleted." };
  } catch (e: any) {
    return { success: false, message: e.message || "Deletion failed." };
  }
}

export async function getVideoInsights() {
  try {
    return await prisma.videoInsight.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    });
  } catch (e) {
    console.error("Error fetching video insights:", e);
    return [];
  }
}
