"use client";

import { useState } from "react";

export default function MediaUploader() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch("/api/admin/media", { method: "POST", body: new FormData(event.currentTarget) });
    const result = await response.json(); setMessage(result.message ?? (response.ok ? "Uploaded." : "Upload failed.")); setBusy(false);
    if (response.ok) {
      event.currentTarget.reset();
      window.location.reload();
    }
  };
  return <form onSubmit={submit} className="glass-panel space-y-5 p-6"><div><label className="text-sm text-slate-muted" htmlFor="media-file">File</label><input id="media-file" name="file" type="file" required accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf" className="mt-2 block w-full rounded-lg border border-glass bg-white/5 p-3 text-sm text-slate-muted" /></div><div><label className="text-sm text-slate-muted" htmlFor="media-alt">Alt text</label><input id="media-alt" name="altText" required minLength={2} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></div><button disabled={busy} className="btn-primary">{busy ? "Uploading…" : "Upload asset"}</button>{message && <p className="text-sm text-slate-muted">{message}</p>}</form>;
}
