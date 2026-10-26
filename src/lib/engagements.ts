import { prisma } from "@/lib/prisma";
import { EngagementModel } from "@/types";

export async function getEngagementModels(): Promise<EngagementModel[]> {
  try {
    return await prisma.engagementModel.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "asc" },
    });
  } catch (e) {
    console.error("Error fetching engagement models:", e);
    return [];
  }
}

export async function getEngagementModel(slug: string): Promise<EngagementModel | null> {
  try {
    return await prisma.engagementModel.findUnique({
      where: { slug },
    });
  } catch (e) {
    console.error("Error fetching engagement model:", e);
    return null;
  }
}
