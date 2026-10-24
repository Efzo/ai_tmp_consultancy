import { prisma } from "@/lib/prisma";

async function getLeads() {
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return { configured: false, leads: [] };
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    return { configured: true, leads };
  } catch {
    return { configured: false, leads: [] };
  }
}

export default async function LeadsPage() {
  const { configured, leads } = await getLeads();
  return <div className="space-y-8"><div><h1 className="text-3xl font-bold tracking-tight">Lead management</h1><p className="text-slate-muted">Persisted inquiries and follow-up status.</p></div>{!configured ? <div className="glass-panel p-8"><h2 className="text-xl font-bold">Lead management is not connected</h2><p className="mt-3 text-slate-muted">Configure PostgreSQL and run the Prisma migration to display real inquiries. Demo records are intentionally not shown.</p></div> : leads.length === 0 ? <div className="glass-panel p-10 text-center text-slate-muted">No inquiries have been submitted yet.</div> : <div className="glass-panel overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="border-b border-glass bg-white/5 text-xs uppercase tracking-widest text-slate-muted"><tr><th className="px-6 py-4">Client</th><th className="px-6 py-4">Service</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Submitted</th></tr></thead><tbody className="divide-y divide-glass">{leads.map((lead) => <tr key={lead.id}><td className="px-6 py-4"><p className="font-medium">{lead.name}</p><p className="text-xs text-slate-muted">{lead.company} · {lead.email}</p></td><td className="px-6 py-4 text-sm text-slate-muted">{lead.serviceRequested}</td><td className="px-6 py-4 text-xs font-bold text-electric">{lead.status.replaceAll("_", " ")}</td><td className="px-6 py-4 text-sm text-slate-muted">{lead.createdAt.toLocaleDateString()}</td></tr>)}</tbody></table></div>}</div>;
}
