import { prisma } from "@/lib/prisma";
import { CaseStudy } from "@/types";

export async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    return await prisma.caseStudy.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Error fetching case studies:", e);
    return [];
  }
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  try {
    return await prisma.caseStudy.findUnique({
      where: { slug },
    });
  } catch (e) {
    console.error("Error fetching case study:", e);
    return null;
  }
}
