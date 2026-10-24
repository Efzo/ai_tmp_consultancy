import { AdminModule } from "@/components/admin/AdminModule";
import FooterLinksEditor from "@/components/admin/FooterLinksEditor";
import ContactBudgetEditor from "@/components/admin/ContactBudgetEditor";
import SettingsEditor from "@/components/admin/SettingsEditor";
import { prisma } from "@/lib/prisma";
import { getContactBudgetOptions, getFooterSettings, isSiteSettingsDatabaseReady } from "@/lib/site-settings";

export default async function SettingsAdminPage() {
  const settings = [
    { name: "Brand identity", state: "Configured in code" },
    { name: "Booking URL", state: process.env.NEXT_PUBLIC_BOOKING_URL ? "Configured" : "Missing" },
    { name: "Business email", state: process.env.BUSINESS_EMAIL ? "Configured" : "Missing" },
    { name: "Analytics ID", state: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.includes("DEMO") ? "Demo value" : "Configured" },
    { name: "Public pricing", state: "Visible as provisional" },
  ];
  const footerSettings = await getFooterSettings();
  const budgetOptions = await getContactBudgetOptions();
  const records = isSiteSettingsDatabaseReady() ? await prisma.siteSetting.findMany({ orderBy: { key: "asc" } }).catch(() => []) : [];
  const otherRecords = records.filter((record) => !record.key.startsWith("footer.") && record.key !== "contact.budgetOptions");

  return (
    <AdminModule title="Site settings" description="Review and edit public configuration values." status={isSiteSettingsDatabaseReady() ? "Database connected" : "Local demo mode"}>
      <div className="space-y-6">
        <FooterLinksEditor settings={footerSettings} />
        <ContactBudgetEditor options={budgetOptions} />
        {otherRecords.length > 0 && <SettingsEditor settings={otherRecords.map((record) => ({ key: record.key, value: typeof record.value === "string" ? record.value : JSON.stringify(record.value) }))} />}
        {!isSiteSettingsDatabaseReady() && <p className="text-sm text-amber-200">Footer link changes are available for this local server session. Connect PostgreSQL for persistent production editing.</p>}
        <div className="glass-panel overflow-hidden">
          <div className="divide-y divide-glass">
            {settings.map((setting) => <div key={setting.name} className="flex flex-wrap items-center justify-between gap-3 px-6 py-5"><span>{setting.name}</span><span className="text-sm text-slate-muted">{setting.state}</span></div>)}
          </div>
        </div>
      </div>
    </AdminModule>
  );
}
