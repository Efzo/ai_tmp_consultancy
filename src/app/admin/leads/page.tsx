import { AdminModule } from "@/components/admin/AdminModule";
import LeadsManager from "@/components/admin/LeadsManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getLeads() {
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return null;
  try { return await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 }); } catch { return null; }
}

export default async function LeadsPage() {
  const leads = await getLeads();
  if (!leads) return <AdminModule title="Leads & inquiries" description="Qualify inquiries, record follow-up, and move opportunities through your pipeline." status="Database required"><div className="glass-panel p-8"><h2 className="text-xl font-bold">Lead management is not connected</h2><p className="mt-3 text-slate-muted">Configure PostgreSQL and disable demo mode to manage real inquiries.</p></div></AdminModule>;
  return <AdminModule title="Leads & inquiries" description="Qualify inquiries, record follow-up, and move opportunities through your pipeline." status={`${leads.length} recent inquiries`}><LeadsManager leads={leads.map((lead) => ({ ...lead, createdAt: lead.createdAt.toISOString() }))} /></AdminModule>;
}
