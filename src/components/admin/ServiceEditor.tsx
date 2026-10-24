"use client";

import { useState } from "react";
import { createService, deleteService, updateService } from "@/app/actions/cms";

type Service = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  targetAudience: string;
  ctaText: string;
  price: string | null;
  isPublished: boolean;
};

const emptyService = { slug: "new-service", title: "", shortDescription: "", fullDescription: "", targetAudience: "", ctaText: "Book a consultation", price: "" };

export default function ServiceEditor({ services }: { services: Service[] }) {
  const [rows, setRows] = useState(services);
  const [newService, setNewService] = useState(emptyService);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const save = async (service: Service) => {
    setBusy(true);
    const result = await updateService(service);
    setMessage(result.message);
    setBusy(false);
  };

  const create = async () => {
    setBusy(true);
    const result = await createService(newService);
    setMessage(result.message);
    if (result.success) {
      setNewService(emptyService);
      window.location.reload();
    }
    setBusy(false);
  };

  const remove = async (service: Service) => {
    if (!window.confirm(`Delete “${service.title}”?`)) return;
    setBusy(true);
    const result = await deleteService(service.id);
    setMessage(result.message);
    if (result.success) setRows((current) => current.filter((item) => item.id !== service.id));
    setBusy(false);
  };

  const update = (id: string, field: keyof Service, value: string | boolean) => setRows((current) => current.map((service) => service.id === id ? { ...service, [field]: value } : service));

  return <div className="space-y-6">
    <article className="glass-panel space-y-5 border-electric/20 p-6">
      <div><p className="text-xs uppercase tracking-widest text-electric">Create service</p><h2 className="mt-2 text-xl font-bold">Add a new public offering</h2><p className="mt-2 text-sm text-slate-muted">Create the core service first, then add detailed deliverables and engagement steps in the database as the offering matures.</p></div>
      <div className="grid gap-5 md:grid-cols-2">
        {(["slug", "title", "shortDescription", "targetAudience", "ctaText", "price"] as const).map((field) => <label key={field} className="text-sm capitalize text-slate-muted">{field.replace(/([A-Z])/g, " $1")}<input value={newService[field]} onChange={(event) => setNewService((current) => ({ ...current, [field]: event.target.value }))} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label>)}
      </div>
      <label className="block text-sm text-slate-muted">Full description<textarea value={newService.fullDescription} onChange={(event) => setNewService((current) => ({ ...current, fullDescription: event.target.value }))} rows={4} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label>
      <button type="button" disabled={busy} onClick={create} className="btn-primary">{busy ? "Saving…" : "Create service"}</button>
    </article>

    {rows.map((service) => <article key={service.id} className="glass-panel space-y-5 p-6"><div className="grid gap-5 md:grid-cols-2"><label className="text-sm text-slate-muted">Title<input value={service.title} onChange={(event) => update(service.id, "title", event.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><label className="text-sm text-slate-muted">CTA label<input value={service.ctaText} onChange={(event) => update(service.id, "ctaText", event.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label></div><label className="block text-sm text-slate-muted">Short description<textarea value={service.shortDescription} onChange={(event) => update(service.id, "shortDescription", event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><label className="block text-sm text-slate-muted">Full description<textarea value={service.fullDescription} onChange={(event) => update(service.id, "fullDescription", event.target.value)} rows={5} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><div className="grid gap-5 md:grid-cols-2"><label className="text-sm text-slate-muted">Best fit for<input value={service.targetAudience} onChange={(event) => update(service.id, "targetAudience", event.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><label className="text-sm text-slate-muted">Planning price<input value={service.price ?? ""} onChange={(event) => update(service.id, "price", event.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label></div><div className="flex flex-wrap items-center justify-between gap-4"><label className="flex items-center gap-2 text-sm text-slate-muted"><input type="checkbox" checked={service.isPublished} onChange={(event) => update(service.id, "isPublished", event.target.checked)} className="accent-electric" /> Published on public site</label><div className="flex gap-3"><button type="button" onClick={() => remove(service)} className="rounded-full border border-red-400/30 px-5 py-2 text-sm text-red-300">Delete</button><button type="button" disabled={busy} onClick={() => save(service)} className="btn-primary">Save service</button></div></div></article>)}
    {message && <p className="text-sm text-cyan-ai">{message}</p>}
  </div>;
}
