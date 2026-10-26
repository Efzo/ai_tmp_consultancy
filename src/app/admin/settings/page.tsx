import ContactDetailsEditor from "@/components/admin/ContactDetailsEditor";
import { AdminModule } from "@/components/admin/AdminModule";
import FooterLinksEditor from "@/components/admin/FooterLinksEditor";
import ContactBudgetEditor from "@/components/admin/ContactBudgetEditor";
import SettingsEditor from "@/components/admin/SettingsEditor";
import TrustLogosEditor from "@/components/admin/TrustLogosEditor";
import { prisma } from "@/lib/prisma";
import { getContactDetails, getContactBudgetOptions, getFooterSettings, getTrustLogos, isSiteSettingsDatabaseReady } from "@/lib/site-settings";
import Link from "next/link";

export default async function SettingsAdminPage() {
  const [contactDetails, footerSettings, budgetOptions, trustLogos] = await Promise.all([getContactDetails(), getFooterSettings(), getContactBudgetOptions(), getTrustLogos()]);
  const settings = [
    { name: "Booking calendar", state: process.env.NEXT_PUBLIC_BOOKING_URL ? "URL configured" : "URL missing", href: "/admin/bookings" },
    { name: "Inquiry notification email", state: process.env.BUSINESS_EMAIL ? "Configured" : "Missing", href: "/admin/security" },
    { name: "Google Analytics", state: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID.includes("DEMO") ? "ID configured" : "ID missing or demo", href: "/admin/analytics" },
    { name: "Public prices", state: "Hidden unless enabled for each offer", href: "/admin/packages" },
  ];
  const records = isSiteSettingsDatabaseReady() ? await prisma.siteSetting.findMany({ orderBy: { key: "asc" } }).catch(() => []) : [];
  const otherRecords = records.filter((record) => typeof record.value === "string" && !["footer.", "contact.", "trust.", "homepage.", "caseStudy.", "pricing.", "navigation.", "seo.", "testimonials.", "consulting."].some((prefix) => record.key.startsWith(prefix)));

  return <AdminModule title="Contact & Site Settings" description="Edit shared contact details, form choices, footer links, and trust logos. Use the shortcuts below to jump to a section." status={isSiteSettingsDatabaseReady() ? "Database configured" : "Preview mode"}>
    <nav aria-label="Settings sections" className="flex flex-wrap gap-3">{[["Contact details", "contact"], ["Inquiry budget choices", "budgets"], ["Footer links", "footer"], ["Trust logos", "logos"], ["Connections", "connections"]].map(([name, id]) => <a key={id} href={`#${id}`} className="btn-secondary">{name}</a>)}</nav>
    <section id="contact" className="scroll-mt-28"><ContactDetailsEditor details={contactDetails} /></section>
    <section id="budgets" className="scroll-mt-28 space-y-3"><h2 className="text-xl font-bold">Inquiry Budget Choices</h2><p className="text-sm text-slate-muted">These are the budget options visitors can select in the contact form. They do not set your consulting prices.</p><ContactBudgetEditor options={budgetOptions} /></section>
    <section id="footer" className="scroll-mt-28 space-y-3"><h2 className="text-xl font-bold">Footer Links</h2><p className="text-sm text-slate-muted">Change links at the bottom of the public website. The top menu is managed separately in Menu Links.</p><FooterLinksEditor settings={footerSettings} /><Link href="/admin/navigation" className="inline-block text-cyan-ai">Edit top menu links →</Link></section>
    <section id="logos" className="scroll-mt-28 space-y-3"><h2 className="text-xl font-bold">Trust Logos</h2><p className="text-sm text-slate-muted">Manage approved organization logos. Logos appear only where a public page uses the trust-logo section.</p><TrustLogosEditor logos={trustLogos} /></section>
    <section id="connections" className="glass-panel scroll-mt-28 overflow-hidden"><div className="p-6"><h2 className="text-xl font-bold">Connections & Configuration</h2><p className="mt-2 text-sm text-slate-muted">These indicators show whether configuration values exist. They do not verify that an external provider is working.</p></div><div className="divide-y divide-glass">{settings.map((setting) => <Link key={setting.name} href={setting.href} className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 hover:bg-white/5"><span>{setting.name} →</span><span className="text-sm text-slate-muted">{setting.state}</span></Link>)}</div></section>
    {!isSiteSettingsDatabaseReady() && <p className="glass-panel p-6 text-sm text-amber-200">Persistent editing requires a connected database with demo mode disabled. Some existing preview controls only last for the running server session.</p>}
    {otherRecords.length > 0 && <details className="glass-panel p-6"><summary className="cursor-pointer font-semibold">Advanced: other text settings</summary><p className="my-4 text-sm text-slate-muted">Additional saved text values. Use the named editors above for everyday changes.</p><SettingsEditor settings={otherRecords.map((record) => ({ key: record.key, value: String(record.value) }))} /></details>}
  </AdminModule>;
}
