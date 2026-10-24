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
  return <form onSubmit={submit} className="glass-panel space-y-5 p-6"><div><label className="text-sm text-slate-muted" htmlFor="media-file">File <span className="text-xs">(documents, images, audio, or video; max 10MB)</span></label><input id="media-file" name="file" type="file" required accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.bmp,.tif,.tiff,.svg,.ico,.heic,.heif,.pdf,.txt,.md,.markdown,.csv,.tsv,.rtf,.json,.xml,.yaml,.yml,.log,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.pages,.numbers,.key,.mp3,.wav,.ogg,.m4a,.mp4,.webm,.ogv" className="mt-2 block w-full rounded-lg border border-glass bg-white/5 p-3 text-sm text-slate-muted" /></div><div><label className="text-sm text-slate-muted" htmlFor="media-alt">Description / alt text</label><input id="media-alt" name="altText" required minLength={2} placeholder="What is this file used for?" className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></div><button disabled={busy} className="btn-primary">{busy ? "Uploading…" : "Upload asset"}</button>{message && <p className="text-sm text-slate-muted">{message}</p>}</form>;
}
