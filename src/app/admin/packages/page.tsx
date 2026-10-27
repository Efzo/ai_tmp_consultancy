import { AdminModule } from "@/components/admin/AdminModule";
import PricingEditor from "@/components/admin/PricingEditor";
import { getPricingPlans } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function PackagesAdminPage() {
  const plans = await getPricingPlans();
  return <AdminModule title="Engagements & Pricing" description="Edit the offers on /engagements and the homepage: prices, audience, problems, deliverables, engagement terms, visibility, and booking or proposal buttons." status={`${plans.length} offers`}><PricingEditor plans={plans} /></AdminModule>;
}
