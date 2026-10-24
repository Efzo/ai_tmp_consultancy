"use client";

import { useMemo, useState } from "react";
import { Building2, CalendarDays, Clock3, DollarSign, Mail, Search, Send, UserRound } from "lucide-react";
import { updateLead } from "@/app/actions/cms";

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  website?: string | null;
  serviceRequested: string;
  challenge: string;
  timeline: string;
  budget: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
};

const statuses = ["NEW", "QUALIFIED", "DISCOVERY_SCHEDULED", "PROPOSAL_SENT", "WON", "LOST"] as const;

const statusStyles: Record<string, string> = {
  NEW: "border-cyan-ai/30 bg-cyan-ai/10 text-cyan-ai",
  QUALIFIED: "border-electric/30 bg-electric/10 text-electric",
  DISCOVERY_SCHEDULED: "border-violet-300/30 bg-violet-300/10 text-violet-200",
  PROPOSAL_SENT: "border-amber-300/30 bg-amber-300/10 text-amber-200",
  WON: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  LOST: "border-red-300/30 bg-red-300/10 text-red-200",
};

function formatLabel(value: string | null | undefined) {
  if (!value) return "Not provided";
  return value.replaceAll("_", " ").replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default function LeadsManager({ leads }: { leads: Lead[] }) {
  const [rows, setRows] = useState(leads);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = useMemo(() => rows.filter((lead) => {
    const haystack = `${lead.name} ${lead.email} ${lead.company} ${lead.serviceRequested} ${lead.challenge}`.toLowerCase();
    return (!query.trim() || haystack.includes(query.trim().toLowerCase())) && (statusFilter === "ALL" || lead.status === statusFilter);
  }), [query, rows, statusFilter]);

  const counts = useMemo(() => statuses.reduce<Record<string, number>>((result, status) => {
    result[status] = rows.filter((lead) => lead.status === status).length;
    return result;
  }, {}), [rows]);

  const save = async (lead: Lead) => {
    setBusy(lead.id);
    const result = await updateLead({ id: lead.id, status: lead.status, notes: lead.notes ?? "" });
    setMessage(result.message);
    setBusy(null);
  };

  const update = (id: string, field: "status" | "notes", value: string) => {
    setRows((current) => current.map((lead) => lead.id === id ? { ...lead, [field]: value } : lead));
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <section className="glass-panel p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="relative block">
            <span className="sr-only">Search leads</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, company, email, or service" className="w-full rounded-xl border border-glass bg-white/5 py-3 pl-11 pr-4 text-white outline-none transition focus:border-electric" />
          </label>
          <label className="relative block">
            <span className="sr-only">Filter by status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-glass bg-midnight px-4 py-3 text-white outline-none transition focus:border-electric">
              <option value="ALL">All statuses · {rows.length}</option>
              {statuses.map((status) => <option key={status} value={status}>{formatLabel(status)} · {counts[status] ?? 0}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="mr-1 text-slate-muted">Pipeline</span>
          {statuses.map((status) => <span key={status} className={`rounded-full border px-2.5 py-1 ${statusStyles[status]}`}><span className="font-semibold">{counts[status] ?? 0}</span> {formatLabel(status)}</span>)}
        </div>
      </section>

      <div className="space-y-5">
        {filtered.length === 0 && <div className="glass-panel p-12 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-slate-muted"><Search className="h-5 w-5" /></div><p className="mt-4 font-medium">No inquiries match this view.</p><p className="mt-1 text-sm text-slate-muted">Try another search term or status filter.</p></div>}
        {filtered.map((lead) => (
          <article key={lead.id} className="glass-panel overflow-hidden">
            <div className="border-b border-glass px-5 py-5 md:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-electric/15 text-sm font-bold text-electric">{initials(lead.name)}</div>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-white">{lead.name}</h2>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-muted">
                      <span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{lead.company}</span>
                      <a href={`mailto:${lead.email}`} className="inline-flex min-w-0 items-center gap-1.5 truncate hover:text-cyan-ai"><Mail className="h-3.5 w-3.5 shrink-0" />{lead.email}</a>
                    </div>
                    <p className="mt-2 text-xs text-slate-muted">Received {new Date(lead.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</p>
                  </div>
                </div>
                <label className="sm:min-w-[190px]">
                  <span className="sr-only">Lead status</span>
                  <select value={lead.status} onChange={(event) => update(lead.id, "status", event.target.value)} className={`w-full rounded-full border px-3 py-2 text-xs font-semibold outline-none transition focus:border-electric ${statusStyles[lead.status] ?? "border-glass bg-white/5 text-white"}`}>
                    {statuses.map((status) => <option key={status} value={status} className="bg-midnight text-white">{formatLabel(status)}</option>)}
                  </select>
                </label>
              </div>
            </div>

            <div className="grid gap-5 p-5 md:grid-cols-[1.15fr_0.85fr] md:p-6">
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-white">Inquiry</h3>{lead.website && <a href={lead.website} target="_blank" rel="noreferrer" className="text-xs text-cyan-ai hover:underline">Visit website ↗</a>}</div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-muted">{lead.challenge}</p>
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-glass bg-white/[0.03] p-3"><Clock3 className="h-4 w-4 text-electric" /><p className="mt-2 text-[11px] uppercase tracking-wider text-slate-muted">Timeline</p><p className="mt-1 text-sm text-white">{formatLabel(lead.timeline)}</p></div>
                  <div className="rounded-xl border border-glass bg-white/[0.03] p-3"><DollarSign className="h-4 w-4 text-cyan-ai" /><p className="mt-2 text-[11px] uppercase tracking-wider text-slate-muted">Budget</p><p className="mt-1 text-sm text-white">{lead.budget ?? "Not provided"}</p></div>
                  <div className="rounded-xl border border-glass bg-white/[0.03] p-3"><CalendarDays className="h-4 w-4 text-violet-200" /><p className="mt-2 text-[11px] uppercase tracking-wider text-slate-muted">Service</p><p className="mt-1 text-sm text-white">{formatLabel(lead.serviceRequested)}</p></div>
                </div>
              </div>

              <label className="block text-sm text-slate-muted"><span className="flex items-center gap-2 font-medium text-white"><UserRound className="h-4 w-4 text-electric" />Internal notes</span><span className="mt-1 block text-xs text-slate-muted">Private follow-up context, proposal details, or next steps.</span><textarea value={lead.notes ?? ""} onChange={(event) => update(lead.id, "notes", event.target.value)} rows={5} placeholder="Add a follow-up note…" className="mt-3 w-full resize-y rounded-xl border border-glass bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-electric" /></label>
            </div>

            <div className="flex flex-col gap-3 border-t border-glass bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
              <p className="text-xs text-slate-muted">Update the status or notes, then save this lead.</p>
              <button type="button" onClick={() => save(lead)} disabled={busy === lead.id} className="btn-primary inline-flex items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-60"><Send className="h-4 w-4" />{busy === lead.id ? "Saving…" : "Save lead"}</button>
            </div>
          </article>
        ))}
      </div>
      {message && <p className="rounded-lg border border-cyan-ai/20 bg-cyan-ai/10 px-4 py-3 text-sm text-cyan-ai">{message}</p>}
    </div>
  );
}
