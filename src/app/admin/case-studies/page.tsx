import { caseDetailsSchema } from "@/lib/case-details";
import { AdminModule } from "@/components/admin/AdminModule";
import CaseStudyEditor from "@/components/admin/CaseStudyEditor";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CaseStudiesAdminPage() {
  const studies = await prisma.caseStudy.findMany({
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  const withDetails = await Promise.all(studies.map(async (study) => {
    const record = await prisma.siteSetting.findUnique({ where: { key: `caseStudy.${study.id}.details` } }).catch(() => null);
    const parsed = caseDetailsSchema.safeParse(record?.value);
    return { ...study, details: parsed.success ? parsed.data : undefined };
  }));
  return (
    <AdminModule
      title="Project Case Studies"
      description="Create and maintain the proof points, outcomes, and technical decisions shown publicly."
      status={`${studies.length} records`}
    >
      <CaseStudyEditor studies={withDetails} />
    </AdminModule>
  );
}
