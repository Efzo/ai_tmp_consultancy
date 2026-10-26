"use client";

import { useState } from "react";
import { saveEngagement, deleteEngagement } from "@/app/actions/cms";
import type { EngagementModel } from "@/types";

export default function EngagementEditor({ models }: { models: EngagementModel[] }) {
  const [rows, setRows] = useState<Partial<EngagementModel>[]>(models);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (index: number, key: keyof EngagementModel, value: EngagementModel[keyof EngagementModel]) =>
    setRows((current) => current.map((m, idx) => idx === index ? { ...m, [key]: value } : m));

  const add = () => setRows((current) => [...current, {
    slug: `engagement-${current.length + 1}`,
    name: "New Engagement",
    description: "Detailed description of the offering.",
    price: "Custom",
    features: [],
    type: "FIXED",
    ctaText: "Request Proposal",
    isPublished: false
  }]);

  const remove = async (index: number) => {
    const model = rows[index];
    if (!model.id) {
      setRows((current) => current.filter((_, idx) => idx !== index));
      return;
    }
    if (!confirm("Delete this engagement model?")) return;
    const result = await deleteEngagement(model.id);
    if (result.success) {
      setRows((current) => current.filter((_, idx) => idx !== index));
      setMessage(result.message);
    } else {
      setMessage(result.message);
    }
  };

  const save = async (index: number) => {
    setSaving(true);
    const result = await saveEngagement(rows[index]);
    setMessage(result.message);
    if (result.success && result.id) {
      update(index, "id", result.id);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Ways to Work Together</h2>
          <p className="mt-1 text-sm text-slate-muted">Define audience, problems, structure, and deliverables. Prices are private reference notes; public pricing visibility is managed under Consulting Packages.</p>
        </div>
        <button type="button" onClick={add} className="btn-secondary">Add engagement</button>
      </div>

      {rows.map((model, index) => (
        <article key={model.id || `new-${index}`} className="glass-panel space-y-4 p-6 border border-glass">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm text-slate-muted">Name
              <input value={model.name || ""} onChange={(e) => update(index, "name", e.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
            <label className="text-sm text-slate-muted">Slug
              <input value={model.slug || ""} onChange={(e) => update(index, "slug", e.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
            <label className="text-sm text-slate-muted">Price
              <input value={model.price || ""} onChange={(e) => update(index, "price", e.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
          </div>

          <label className="block text-sm text-slate-muted">Description
            <textarea value={model.description || ""} onChange={(e) => update(index, "description", e.target.value)} rows={2} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-muted">Features (comma separated)
              <input value={(model.features || []).join(", ") || ""} onChange={(e) => update(index, "features", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
            <label className="text-sm text-slate-muted">CTA Text
              <input value={model.ctaText || ""} onChange={(e) => update(index, "ctaText", e.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-glass pt-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-muted cursor-pointer">
                <input type="checkbox" checked={model.isPublished || false} onChange={(e) => update(index, "isPublished", e.target.checked)} className="accent-electric" />
                Published
              </label>
              <select value={model.type || "FIXED"} onChange={(e) => update(index, "type", e.target.value)} className="rounded-lg border border-glass bg-white/5 px-3 py-1 text-xs text-white outline-none focus:border-electric">
                <option value="FIXED">Fixed</option>
                <option value="RETAINER">Retainer</option>
                <option value="HOURLY">Hourly</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => remove(index)} className="rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300 hover:bg-red-400/10 transition-colors">Remove</button>
              <button type="button" onClick={() => save(index)} disabled={saving} className="btn-primary px-4 py-2 text-sm disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </article>
      ))}
      <div className="flex items-center justify-between gap-4 mt-8">
        <p className="text-sm text-cyan-ai">{message}</p>
      </div>
    </div>
  );
}
