import { caseDetailsSchema } from "@/lib/case-details";
import { prisma } from "@/lib/prisma";
import content from "@/data/consulting.json";
import type { CaseStudy } from "@/types";
import { isSiteSettingsDatabaseReady } from "@/lib/site-settings";

const defaults: CaseStudy[] = [{ ...content.caseStudy, status: "PUBLISHED", id: "clinchdesk", createdAt: new Date(0), updatedAt: new Date(0) }];
export async function getCaseStudies(): Promise<CaseStudy[]> {
  if (!isSiteSettingsDatabaseReady()) return defaults;
  try {
    const records = await prisma.caseStudy.findMany({ orderBy: { createdAt: "desc" } });
    if (!records.length && await prisma.siteSetting.findUnique({ where: { key: "consulting.initialized" } })) return [];
    return records.length ? records.filter((study) => study.isPublished && study.status === "PUBLISHED").map((study) => ({ ...study, title: study.title.replace(/clincddesk/ig, "ClinchDesk") })) : defaults;
  } catch { return defaults; }
}
export async function getCaseStudy(slug: string) {
  const study = (await getCaseStudies()).find((study) => study.slug === slug);
  if (!study) return null;
  const record = isSiteSettingsDatabaseReady() ? await prisma.siteSetting.findUnique({ where: { key: `caseStudy.${study.id}.details` } }).catch(() => null) : null;
  const details = caseDetailsSchema.safeParse(record?.value);
  return { ...study, details: details.success ? details.data : undefined };
}
