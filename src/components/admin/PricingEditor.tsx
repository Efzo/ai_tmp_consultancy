"use client";

import Link from "next/link";
import { useState } from "react";
import { updatePricingPlans } from "@/app/actions/cms";
import { services } from "@/data/services";
import { pricingPlans, type PricingPlan } from "@/data/pricing";

const inputClass = "mt-2 w-full rounded-lg border border-glass bg-midnight px-3 py-2 text-white outline-none focus:border-electric";
export default function PricingEditor({ plans }: { plans: PricingPlan[] }) {
  const [rows, setRows] = useState<PricingPlan[]>(plans);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const update = (index: number, patch: Partial<PricingPlan>) => setRows((current) => current.map((plan, i) => i === index ? { ...plan, ...patch } : plan));
  const add = () => setRows((current) => [...current, {
    id: `offer-${crypto.randomUUID()}`, name: "New offer", price: "", showPrice: false, isPublished: false,
    description: "Describe this consulting engagement.", audience: "", problem: "", engagementModel: "",
    features: [], addOns: [], type: "fixed", cta: "Request details", ctaDestination: "contact",
  }]);
  const save = async () => {
    setSaving(true);
    try {
      const clean = (items: string[]) => items.map((item) => item.trim()).filter(Boolean);
      const result = await updatePricingPlans(rows.map((row) => ({ ...row, features: clean(row.features), addOns: clean(row.addOns ?? []) })));
      setMessage(result.message);
    } catch { setMessage("The offers could not be saved. Please try again."); }
    finally { setSaving(false); }
  };
  return <div className="space-y-6">
    <div className="glass-panel p-6 space-y-3"><h2 className="text-lg font-semibold">Engagements & Pricing</h2>
      <p className="text-sm text-slate-muted">These offers appear on /engagements, in the homepage preview, and in the contact form dropdown. Saving applies changes immediately. Unpublish an offer to hide it from both places; hide its price to keep the offer visible without the fee.</p>
      <div className="flex flex-wrap gap-4"><Link href="/engagements" target="_blank" className="text-electric">View public page ↗</Link><Link href="/admin/pages/engagements" className="text-electric">Edit page introduction & SEO →</Link></div>
    </div>
    <fieldset disabled={saving} className="space-y-6">
      <div className="flex flex-wrap gap-3"><button type="button" onClick={() => { if (confirm("Load the six recommended offers into this editor? This replaces unsaved edits. Your current published offers stay unchanged until you save.")) { setRows(structuredClone(pricingPlans)); setMessage("Six recommended offers loaded for review, with visible starting prices. Save offers to publish this list."); } }} className="btn-secondary">Review recommended offers</button><button type="button" onClick={add} disabled={rows.length >= 12} className="btn-secondary">Add offer</button></div>
      {rows.map((plan, index) => <article key={index} className="glass-panel space-y-4 p-6">
        <h3 className="text-xl font-semibold">{index + 1}. {plan.name}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-muted">Name<input value={plan.name} onChange={(e) => update(index, { name: e.target.value })} className={inputClass} maxLength={120} /></label>
          <label className="text-sm text-slate-muted">Offer ID (unique slug, used in links)<input value={plan.id} onChange={(e) => update(index, { id: e.target.value })} className={inputClass} maxLength={80} /></label>
          <label className="text-sm text-slate-muted">Public price label (USD)<input value={plan.price} placeholder="Starting at $2,500 per engagement" onChange={(e) => update(index, { price: e.target.value })} className={inputClass} maxLength={160} /></label>
          <label className="text-sm text-slate-muted">Engagement type<select value={plan.type} onChange={(e) => update(index, { type: e.target.value as PricingPlan['type'] })} className={inputClass}><option value="fixed">Fixed-scope engagement</option><option value="milestone">Custom delivery project</option><option value="retainer">Monthly advisory</option></select></label>
        </div>
        <label className="block text-sm text-slate-muted">Related service capability<select value={plan.serviceSlug ?? ""} onChange={(e) => update(index, { serviceSlug: e.target.value })} className={inputClass}><option value="">General / all capabilities</option>{services.map((service) => <option key={service.slug} value={service.slug}>{service.title}</option>)}</select></label>
        <label className="block text-sm text-slate-muted">Description<textarea value={plan.description} onChange={(e) => update(index, { description: e.target.value })} rows={2} className={inputClass} maxLength={1000} /></label>
        <label className="block text-sm text-slate-muted">Who it’s for<textarea value={plan.audience ?? ""} onChange={(e) => update(index, { audience: e.target.value })} rows={2} className={inputClass} maxLength={500} /></label>
        <label className="block text-sm text-slate-muted">Business problem<textarea value={plan.problem ?? ""} onChange={(e) => update(index, { problem: e.target.value })} rows={2} className={inputClass} maxLength={500} /></label>
        <label className="block text-sm text-slate-muted">Engagement model, capacity & responsibilities<textarea value={plan.engagementModel ?? ""} onChange={(e) => update(index, { engagementModel: e.target.value })} rows={2} className={inputClass} maxLength={500} /></label>
        <label className="block text-sm text-slate-muted">Example deliverables, one per line<textarea value={plan.features.join("\n")} onChange={(e) => update(index, { features: e.target.value.split("\n") })} rows={4} className={inputClass} /></label>
        <label className="block text-sm text-slate-muted">Optional add-ons, one per line<textarea value={(plan.addOns ?? []).join("\n")} onChange={(e) => update(index, { addOns: e.target.value.split("\n") })} rows={2} className={inputClass} /></label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-muted">CTA label<input value={plan.cta} onChange={(e) => update(index, { cta: e.target.value })} className={inputClass} maxLength={80} /></label>
          <label className="text-sm text-slate-muted">CTA destination<select value={plan.ctaDestination ?? "contact"} onChange={(e) => update(index, { ctaDestination: e.target.value as PricingPlan['ctaDestination'] })} className={inputClass}><option value="book">Existing discovery booking workflow</option><option value="contact">Existing contact workflow (includes offer)</option></select></label>
        </div>
        <div className="flex flex-wrap gap-5"><label className="flex items-center gap-2"><input type="checkbox" checked={plan.showPrice === true} onChange={(e) => update(index, { showPrice: e.target.checked })} className="accent-electric" />Display price publicly</label><label className="flex items-center gap-2"><input type="checkbox" checked={plan.isPublished !== false} onChange={(e) => update(index, { isPublished: e.target.checked })} className="accent-electric" />Published</label></div>
        <button type="button" onClick={() => setRows((current) => current.filter((_, i) => i !== index))} disabled={rows.length === 1} className="rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300 disabled:opacity-40">Remove offer</button>
      </article>)}
    </fieldset>
    <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-glass bg-midnight/95 p-4 backdrop-blur-xl"><p role="status" aria-live="polite" className="text-sm text-cyan-ai">{message}</p><button type="button" onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? "Saving…" : "Save offers"}</button></div>
  </div>;
}
