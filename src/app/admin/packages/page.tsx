import { AdminModule } from "@/components/admin/AdminModule";
import PricingEditor from "@/components/admin/PricingEditor";
import { getPricingPlans } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function PackagesAdminPage() {
  const plans = await getPricingPlans();
  return <AdminModule title="Consulting packages" description="Manage public engagement packages, prices, inclusions, and calls to action." status={`${plans.length} packages`}><PricingEditor plans={plans} /></AdminModule>;
}
