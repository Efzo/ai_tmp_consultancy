import { AdminModule } from "@/components/admin/AdminModule";
import PricingEditor from "@/components/admin/PricingEditor";
import { getPricingPlans } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function PackagesAdminPage() {
  const plans = await getPricingPlans();
  return <AdminModule title="Offers & Pricing" description="Manage packaged offers, included work, optional add-ons, and whether prices are shown publicly." status={`${plans.length} offers`}><PricingEditor plans={plans} /></AdminModule>;
}
