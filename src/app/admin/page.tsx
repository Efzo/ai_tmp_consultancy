import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getMetrics() {
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return null;
  try {
    const [totalLeads, newLeads, qualifiedLeads, wonLeads] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count({ where: { status: "QUALIFIED" } }),
      prisma.lead.count({ where: { status: "WON" } }),
    ]);
    return { totalLeads, newLeads, qualifiedLeads, wonLeads };
  } catch {
    return null;
  }
}

export default async function AdminDashboard() {
  const metrics = await getMetrics();
  const stats = metrics
    ? [
        ["Total inquiries", metrics.totalLeads],
        ["New leads", metrics.newLeads],
        ["Qualified leads", metrics.qualifiedLeads],
        ["Won engagements", metrics.wonLeads],
      ]
    : [];

  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold tracking-tight">Business overview</h1><p className="text-slate-muted">Operational information from persisted website data.</p></div>
      {metrics ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{stats.map(([label, value]) => <div key={label} className="glass-card p-6"><p className="text-sm text-slate-muted">{label}</p><p className="mt-3 text-3xl font-bold">{value}</p></div>)}</div> : <div className="glass-panel p-8"><h2 className="text-xl font-bold">Connect the database to activate metrics</h2><p className="mt-3 max-w-2xl leading-relaxed text-slate-muted">The local project is running in demo mode, so no fabricated lead counts are shown. Set a real PostgreSQL <code className="text-electric">DATABASE_URL</code>, run the Prisma migration, and disable <code className="text-electric">DEMO_MODE</code>.</p></div>}
      <div className="grid gap-6 md:grid-cols-2"><Link href="/admin/leads" className="glass-card p-7"><h2 className="text-xl font-bold">Leads & inquiries</h2><p className="mt-2 text-slate-muted">Review persisted inquiries and their status.</p><span className="mt-6 inline-block text-cyan-ai">Open lead management →</span></Link><Link href="/admin/services" className="glass-card p-7"><h2 className="text-xl font-bold">Services</h2><p className="mt-2 text-slate-muted">Review the current consulting service catalog.</p><span className="mt-6 inline-block text-cyan-ai">Open services →</span></Link></div>
    </div>
  );
}
