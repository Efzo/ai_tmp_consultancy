"use client";

import { useState } from "react";
import { updateSiteSetting } from "@/app/actions/cms";

export default function SettingsEditor({ settings }: { settings: Array<{ key: string; value: string }> }) {
  const [rows, setRows] = useState(settings);
  const [message, setMessage] = useState("");
  const save = async (setting: { key: string; value: string }) => { const result = await updateSiteSetting(setting.key, setting.value); setMessage(result.message); };
  return <div className="glass-panel divide-y divide-glass">{rows.map((setting) => <div key={setting.key} className="flex flex-wrap items-end gap-4 p-5"><label className="flex-1 text-sm text-slate-muted">{setting.key}<input value={setting.value} onChange={(event) => setRows((current) => current.map((item) => item.key === setting.key ? { ...item, value: event.target.value } : item))} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><button type="button" onClick={() => save(setting)} className="btn-secondary">Save</button></div>)}{message && <p className="p-5 text-sm text-cyan-ai">{message}</p>}</div>;
}
