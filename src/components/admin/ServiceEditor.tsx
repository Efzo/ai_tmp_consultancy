"use client";

import { useState } from "react";
import { updateService } from "@/app/actions/cms";

type Service = { id: string; title: string; shortDescription: string; fullDescription: string; targetAudience: string; ctaText: string; price: string | null; isPublished: boolean };

export default function ServiceEditor({ services }: { services: Service[] }) {
  const [rows, setRows] = useState(services);
  const [message, setMessage] = useState("");
  const save = async (service: Service) => { const result = await updateService(service); setMessage(result.message); };
  const update = (id: string, field: keyof Service, value: string | boolean) => setRows((current) => current.map((service) => service.id === id ? { ...service, [field]: value } : service));
  return <div className="space-y-6">{rows.map((service) => <article key={service.id} className="glass-panel space-y-5 p-6"><div className="grid gap-5 md:grid-cols-2"><label className="text-sm text-slate-muted">Title<input value={service.title} onChange={(event) => update(service.id, "title", event.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><label className="text-sm text-slate-muted">CTA label<input value={service.ctaText} onChange={(event) => update(service.id, "ctaText", event.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label></div><label className="block text-sm text-slate-muted">Short description<textarea value={service.shortDescription} onChange={(event) => update(service.id, "shortDescription", event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><label className="block text-sm text-slate-muted">Full description<textarea value={service.fullDescription} onChange={(event) => update(service.id, "fullDescription", event.target.value)} rows={5} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><div className="flex flex-wrap items-center justify-between gap-4"><label className="flex items-center gap-2 text-sm text-slate-muted"><input type="checkbox" checked={service.isPublished} onChange={(event) => update(service.id, "isPublished", event.target.checked)} className="accent-electric" /> Published</label><button type="button" onClick={() => save(service)} className="btn-primary">Save service</button></div></article>)}{message && <p className="text-sm text-cyan-ai">{message}</p>}</div>;
}
