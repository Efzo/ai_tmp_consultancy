"use client";

import { useState } from "react";
import { updateSeoSettings } from "@/app/actions/cms";
import type { SeoSettings } from "@/lib/site-settings";

export default function SeoEditor({ settings }: { settings: SeoSettings }) {
  const [values, setValues] = useState(settings);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const save = async () => { setSaving(true); const result = await updateSeoSettings(values); setMessage(result.message); setSaving(false); };
  return <div className="glass-panel space-y-5 p-6"><div><h2 className="text-lg font-semibold">Global search metadata</h2><p className="mt-1 text-sm text-slate-muted">Update the default title, description, and social preview image used by the public site.</p></div><label className="block text-sm text-slate-muted">Site title<input value={values.title} onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><label className="block text-sm text-slate-muted">Meta description<textarea value={values.description} onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))} rows={3} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><label className="block text-sm text-slate-muted">Open Graph image URL or path<input value={values.ogImage} onChange={(event) => setValues((current) => ({ ...current, ogImage: event.target.value }))} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><div className="flex items-center justify-between gap-4"><span className="text-xs text-slate-muted">Changes apply to the global metadata after saving.</span><button type="button" onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? "Saving…" : "Save SEO settings"}</button></div>{message && <p className="text-sm text-cyan-ai">{message}</p>}</div>;
}
