import { AdminModule } from "@/components/admin/AdminModule";
import ServiceEditor from "@/components/admin/ServiceEditor";
import { services as staticServices } from "@/data/services";
import { prisma } from "@/lib/prisma";

async function getServices() {
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return [];
  try { return await prisma.service.findMany({ orderBy: { createdAt: "asc" } }); } catch { return []; }
}

export default async function ServicesAdminPage() {
  const services = await getServices();
  return <AdminModule title="Service Pages" description="Edit what each service does, who it is for, and what clients receive. Manage prices and contact form choices under Engagements & Pricing. Historical service aliases are omitted from public listings; their URLs resolve to the current capabilities." status={services.length ? "Database connected" : "Read-only seed catalog"}>{services.length ? <ServiceEditor services={services} /> : <div className="space-y-4"><div className="glass-panel border-amber-300/20 bg-amber-300/5 p-5 text-sm text-amber-200">Run the database migration and seed script to enable persistent service editing.</div>{staticServices.map((service) => <article key={service.slug} className="glass-card p-6"><p className="text-xs uppercase tracking-widest text-electric">{service.slug}</p><h2 className="mt-3 text-2xl font-bold">{service.title}</h2><p className="mt-3 max-w-3xl leading-relaxed text-slate-muted">{service.shortDescription}</p></article>)}</div>}</AdminModule>;
}
