import { AdminModule } from "@/components/admin/AdminModule";
import NavigationEditor from "@/components/admin/NavigationEditor";
import { getNavigationItems } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function NavigationAdminPage() {
  const items = await getNavigationItems();
  return <AdminModule title="Menu Links" description="Manage the public navbar links across desktop and mobile layouts." status={`${items.length} links`}><NavigationEditor items={items} /></AdminModule>;
}
