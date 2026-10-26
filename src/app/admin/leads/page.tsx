import { AdminModule } from "@/components/admin/AdminModule";
import LeadsManager from "@/components/admin/LeadsManager";
import type { LeadStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const statuses: LeadStatus[] = ["NEW", "QUALIFIED", "DISCOVERY_SCHEDULED", "PROPOSAL_SENT", "WON", "LOST"];
const pageSize = 20;

type LeadSearchParams = { page?: string; q?: string; status?: string };

async function getLeads({ page, query, status }: { page: number; query: string; status: string }) {
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return null;
  const where: Prisma.LeadWhereInput = {};
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { company: { contains: query, mode: "insensitive" } },
      { serviceRequested: { contains: query, mode: "insensitive" } },
      { challenge: { contains: query, mode: "insensitive" } },
    ];
  }
  if (statuses.includes(status as LeadStatus)) where.status = status as LeadStatus;

  try {
    const [total, leads, statusCounts] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
      Promise.all(statuses.map(async (leadStatus) => [leadStatus, await prisma.lead.count({ where: { status: leadStatus } })] as const)),
    ]);
    return { total, leads, statusCounts: Object.fromEntries(statusCounts) as Record<string, number> };
  } catch { return null; }
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<LeadSearchParams> }) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const status = params.status && statuses.includes(params.status as LeadStatus) ? params.status : "ALL";
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const result = await getLeads({ page, query, status });
  if (!result) return <AdminModule title="Project Inquiries" description="Qualify inquiries, record follow-up, and move opportunities through your pipeline." status="Database required"><div className="glass-panel p-8"><h2 className="text-xl font-bold">Lead management is not connected</h2><p className="mt-3 text-slate-muted">Configure PostgreSQL and disable demo mode to manage real inquiries.</p></div></AdminModule>;
  const totalPages = Math.max(1, Math.ceil(result.total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const leads = currentPage === page ? result.leads : (await getLeads({ page: currentPage, query, status }))?.leads ?? [];
  return <AdminModule title="Project Inquiries" description="Qualify inquiries, record follow-up, and move opportunities through your pipeline." status={`${result.total} ${result.total === 1 ? "inquiry" : "inquiries"}`}><LeadsManager key={`${query}-${status}-${currentPage}`} leads={leads.map((lead) => ({ ...lead, createdAt: lead.createdAt.toISOString() }))} query={query} statusFilter={status} page={currentPage} pageSize={pageSize} total={result.total} statusCounts={result.statusCounts} /></AdminModule>;
}
