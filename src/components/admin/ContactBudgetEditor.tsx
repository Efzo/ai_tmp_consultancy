"use client";

import { useState } from "react";
import { updateContactBudgetOptions } from "@/app/actions/cms";
import type { ContactBudgetOption } from "@/lib/site-settings";

export default function ContactBudgetEditor({ options }: { options: ContactBudgetOption[] }) {
  const [rows, setRows] = useState(options);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function updateRow(index: number, key: keyof ContactBudgetOption, value: string) {
    setRows((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row));
  }

  function addRow() {
    setRows((current) => [...current, { value: `budget-${current.length + 1}`, label: "New budget range" }]);
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const result = await updateContactBudgetOptions(rows);
    setMessage(result.message);
    setSaving(false);
  }

  return (
    <div className="glass-panel overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-glass px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Contact form budget options</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-muted">These choices appear in the public contact form. Visitors can always choose the custom amount field.</p>
        </div>
        <button type="button" onClick={addRow} className="btn-secondary">Add option</button>
      </div>
      <div className="divide-y divide-glass">
        {rows.map((row, index) => (
          <div key={`${row.value}-${index}`} className="grid gap-4 px-6 py-5 md:grid-cols-[1fr_1.5fr_auto] md:items-end">
            <label className="text-sm font-medium text-white">Internal value
              <input value={row.value} onChange={(event) => updateRow(index, "value", event.target.value)} placeholder="e.g. 50k-plus" className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
            <label className="text-sm font-medium text-white">Public label
              <input value={row.label} onChange={(event) => updateRow(index, "label", event.target.value)} placeholder="e.g. $50k+" className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
            <button type="button" onClick={() => removeRow(index)} disabled={rows.length === 1} className="rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300 disabled:cursor-not-allowed disabled:opacity-40">Remove</button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-glass px-6 py-4">
        <p className="text-xs text-slate-muted">Use lowercase letters, numbers, and hyphens for internal values.</p>
        <button type="button" onClick={save} disabled={saving} className="btn-primary disabled:cursor-wait disabled:opacity-60">{saving ? "Saving…" : "Save budget options"}</button>
      </div>
      {message && <p className="border-t border-glass px-6 py-4 text-sm text-cyan-ai">{message}</p>}
    </div>
  );
}
