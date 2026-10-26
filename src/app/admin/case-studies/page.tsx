import { AdminModule } from "@/components/admin/AdminModule";
import CaseStudyEditor from "@/components/admin/CaseStudyEditor";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CaseStudiesAdminPage() {
  const studies = await prisma.caseStudy.findMany({
    orderBy: { createdAt: "desc" },
  });
  
  return (
    <AdminModule 
      title="Case studies" 
      description="Create and maintain the proof points, outcomes, and technical decisions shown publicly." 
      status={`${studies.length} records`}
    >
      <CaseStudyEditor studies={studies} />
    </AdminModule>
  );
}
