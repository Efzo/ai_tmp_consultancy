"use client";

import { useState } from "react";
import { updateNavigationItems } from "@/app/actions/cms";
import type { NavigationItem } from "@/lib/site-settings";

export default function NavigationEditor({ items }: { items: NavigationItem[] }) {
  const [rows, setRows] = useState(items);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const update = (index: number, key: keyof NavigationItem, value: string) => setRows((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const add = () => setRows((current) => [...current, { label: "New page", href: "/new-page" }]);
  const remove = (index: number) => setRows((current) => current.filter((_, itemIndex) => itemIndex !== index));
  const save = async () => { setSaving(true); const result = await updateNavigationItems(rows); setMessage(result.message); setSaving(false); };
  return <div className="glass-panel overflow-hidden"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-glass px-6 py-5"><div><h2 className="text-lg font-semibold">Public navigation</h2><p className="mt-1 text-sm text-slate-muted">Control the links shown in the desktop and mobile navbar.</p></div><button type="button" onClick={add} className="btn-secondary">Add link</button></div><div className="divide-y divide-glass">{rows.map((item, index) => <div key={index} className="grid gap-4 px-6 py-5 md:grid-cols-[1fr_1.5fr_auto] md:items-end"><label className="text-sm text-white">Label<input value={item.label} onChange={(event) => update(index, "label", event.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><label className="text-sm text-white">URL<input value={item.href} onChange={(event) => update(index, "href", event.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><button type="button" onClick={() => remove(index)} disabled={rows.length === 1} className="rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300 disabled:opacity-40">Remove</button></div>)}</div><div className="flex items-center justify-between gap-4 border-t border-glass px-6 py-4"><p className="text-xs text-slate-muted">Changes revalidate the public layout after saving.</p><button type="button" onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? "Saving…" : "Save navigation"}</button></div>{message && <p className="border-t border-glass px-6 py-4 text-sm text-cyan-ai">{message}</p>}</div>;
}
