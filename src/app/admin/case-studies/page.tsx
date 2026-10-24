import { AdminModule } from "@/components/admin/AdminModule";
import CaseStudyEditor from "@/components/admin/CaseStudyEditor";
import { getCaseStudies } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function CaseStudiesAdminPage() {
  const studies = await getCaseStudies();
  return <AdminModule title="Case studies" description="Create and maintain the proof points, outcomes, and technical decisions shown publicly." status={`${studies.length} records`}><CaseStudyEditor studies={studies} /></AdminModule>;
}
