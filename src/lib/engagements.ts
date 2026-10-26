import { prisma } from "@/lib/prisma";
import content from "@/data/consulting.json";
import type { EngagementModel } from "@/types";
import { isSiteSettingsDatabaseReady } from "@/lib/site-settings";

export const defaultEngagements = content.engagements.map((model) => ({ ...model, id: model.slug, type: model.type as EngagementModel["type"], createdAt: new Date(0), updatedAt: new Date(0) }));
export async function getEngagementModels(): Promise<EngagementModel[]> {
  if (!isSiteSettingsDatabaseReady()) return defaultEngagements;
  try {
    const records = await prisma.engagementModel.findMany({ orderBy: { createdAt: "asc" } });
    if (!records.length && await prisma.siteSetting.findUnique({ where: { key: "consulting.initialized" } })) return [];
    // An intentional unpublish must not resurrect defaults.
    return records.length ? records.filter((model) => model.isPublished) : defaultEngagements;
  } catch { return defaultEngagements; }
}
export async function getEngagementModel(slug: string) {
  return (await getEngagementModels()).find((model) => model.slug === slug) ?? null;
}
