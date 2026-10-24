import Link from "next/link";
import { AdminModule, SetupCard } from "@/components/admin/AdminModule";
import { prisma } from "@/lib/prisma";

async function getPages() {
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return [];
  try { return await prisma.page.findMany({ orderBy: { updatedAt: "desc" }, select: { id: true, slug: true, title: true, status: true, updatedAt: true } }); } catch { return []; }
}

export default async function ContentPage() {
  const pages = [["Home", "/"], ["Services", "/services"], ["About", "/about"], ["Case Studies", "/case-studies"], ["Process", "/process"], ["Pricing", "/pricing"], ["Blog", "/blog"], ["Contact", "/contact"], ["Privacy", "/privacy"], ["Terms", "/terms"]];
  const databasePages = await getPages();
  return <AdminModule title="Pages & content" description="Manage public pages, publication states, and SEO content." status={databasePages.length ? "Database connected" : "Needs database seed"}><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"><SetupCard title="Public pages" body="The page builder supports validated blocks, draft versions, publishing, and restoring revisions when PostgreSQL is configured." action="Open page builder" /><SetupCard title="Draft workflow" body="Pages move through draft and published states with version history. Scheduled and review states are represented in the data model." action="Review workflow" /><SetupCard title="SEO fields" body="Core metadata is implemented in route files. Database page records can store editable SEO title and description fields." action="Open SEO manager" /></div>{databasePages.length > 0 && <div className="glass-panel overflow-x-auto p-6"><h2 className="text-xl font-bold">Database pages</h2><table className="mt-5 w-full min-w-[620px] text-left"><thead className="border-b border-glass text-xs uppercase tracking-widest text-slate-muted"><tr><th className="py-3">Title</th><th className="py-3">Slug</th><th className="py-3">Status</th><th className="py-3">Updated</th></tr></thead><tbody className="divide-y divide-glass">{databasePages.map((page) => <tr key={page.id}><td className="py-4">{page.title}</td><td className="py-4 text-slate-muted">/{page.slug}</td><td className="py-4 text-electric">{page.status}</td><td className="py-4 text-slate-muted">{page.updatedAt.toLocaleDateString()}</td></tr>)}</tbody></table></div>}<div className="glass-panel p-6"><h2 className="text-xl font-bold">Available public content</h2><div className="mt-5 flex flex-wrap gap-3">{pages.map(([page, href]) => <Link key={page} href={href} className="rounded-lg border border-glass px-4 py-2 text-sm text-slate-muted hover:bg-white/10 hover:text-white">{page}</Link>)}</div></div></AdminModule>;
}
