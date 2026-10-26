import EngagementEditor from "@/components/admin/EngagementEditor";
import { AdminModule } from "@/components/admin/AdminModule";
import { prisma } from "@/lib/prisma";
import { defaultEngagements } from "@/lib/engagements";
import { isSiteSettingsDatabaseReady } from "@/lib/site-settings";
export default async function EngagementsAdminPage() {
  const records = isSiteSettingsDatabaseReady() ? await prisma.engagementModel.findMany({ orderBy: { createdAt: "asc" } }) : [];
  const models = records.length ? records : defaultEngagements.map((model) => ({ ...model, id: "" }));
  return <AdminModule title="Ways to Work Together" description="Explain how clients can hire you: discovery, engineering, or fractional leadership. Manage priced offers separately under Offers & Pricing."><EngagementEditor models={models} /></AdminModule>;
}
