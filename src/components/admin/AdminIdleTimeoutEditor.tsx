"use client";

import { useState, useTransition } from "react";
import { updateAdminIdleTimeoutMinutes } from "@/app/actions/admin-session";
import { formatAdminIdleMinutes, MAX_ADMIN_IDLE_MINUTES, MIN_ADMIN_IDLE_MINUTES, validAdminIdleMinutes } from "@/lib/admin-session";

const presets = [15, 30, 60, 120, 240, 480, 1440];
export default function AdminIdleTimeoutEditor({ minutes, canEdit }: { minutes: number; canEdit: boolean }) {
  const [saved, setSaved] = useState(minutes);
  const [choice, setChoice] = useState(presets.includes(minutes) ? String(minutes) : "custom");
  const [custom, setCustom] = useState(String(minutes));
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const value = Number(choice === "custom" ? custom : choice);
  return <section className="glass-panel space-y-4 p-6" aria-labelledby="admin-idle-heading">
    <div><h2 id="admin-idle-heading" className="text-xl font-semibold">Automatic logout</h2><p className="mt-2 text-sm text-slate-muted">Sign administrators out after inactivity. Activity in another admin tab keeps the session active.</p></div>
    <p className="text-sm">Saved duration: <strong>{formatAdminIdleMinutes(saved)}</strong></p>
    <form onSubmit={(event) => {
      event.preventDefault();
      if (!canEdit || !validAdminIdleMinutes(value)) return;
      setMessage("");
      startTransition(async () => {
        try { const result = await updateAdminIdleTimeoutMinutes(value); setMessage(result.message); if (result.success && result.minutes !== undefined) setSaved(result.minutes); }
        catch { setMessage("The timeout could not be saved. Only the owner can change this setting; check your session and try again."); }
      });
    }}><fieldset disabled={!canEdit || pending} className="max-w-xl space-y-4">
      <label className="block text-sm">Inactivity timeout<select value={choice} onChange={(event) => setChoice(event.target.value)} className="mt-2 block w-full rounded-lg border border-glass bg-midnight p-3">{presets.map((preset) => <option key={preset} value={String(preset)}>{formatAdminIdleMinutes(preset)}{preset === 60 ? " (default)" : ""}</option>)}<option value="custom">Custom duration</option></select></label>
      {choice === "custom" && <label className="block text-sm">Custom duration in minutes<input type="number" min={MIN_ADMIN_IDLE_MINUTES} max={MAX_ADMIN_IDLE_MINUTES} step={1} required value={custom} onChange={(event) => setCustom(event.target.value)} className="mt-2 block w-full rounded-lg border border-glass bg-midnight p-3" /><span className="mt-2 block text-xs text-slate-muted">5–1,440 minutes (up to 24 hours).</span></label>}
      <button type="submit" disabled={pending || !validAdminIdleMinutes(value) || value === saved} className="btn-primary disabled:opacity-60">{pending ? "Saving…" : "Save inactivity timeout"}</button>
    </fieldset></form>
    <p className="text-sm text-slate-muted">Changes apply the next time an administrator signs in. Sign out and sign in again to use the new duration in your own session.</p>
    {!canEdit && <p className="text-sm text-slate-muted">Only the owner can change this setting.</p>}
    {message && <p role="status" aria-live="polite" className="text-sm text-cyan-ai">{message}</p>}
  </section>;
}
