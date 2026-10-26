"use client";
import { useState } from "react";
import { initializeConsultingContent } from "@/app/actions/cms";
export default function ConsultingImport() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  return <div className="glass-panel p-6 space-y-4"><h2 className="text-xl font-bold">Consulting catalog</h2><p className="text-slate-muted">Add the four consulting capabilities, three engagement models, and ClinchDesk overview when missing. Existing records are preserved; the ClinchDesk title typo is corrected. Owner access required.</p><button disabled={busy} className="btn-secondary" onClick={async () => { setBusy(true); try { const result = await initializeConsultingContent(); setMessage(result.message); } catch { setMessage("Import failed. Confirm owner access and database configuration."); } finally { setBusy(false); } }}>Add missing consulting content</button><p role="status">{message}</p></div>;
}
