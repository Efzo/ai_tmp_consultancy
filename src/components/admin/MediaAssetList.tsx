"use client";

import { useState } from "react";

type Asset = { id: string; filename: string; altText: string; url: string; size: number; mimeType: string };

export default function MediaAssetList({ assets }: { assets: Asset[] }) {
  const [rows, setRows] = useState(assets);
  const [message, setMessage] = useState("");
  const remove = async (id: string) => {
    if (!window.confirm("Delete this media asset? This cannot be undone.")) return;
    const response = await fetch(`/api/admin/media?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const result = await response.json().catch(() => ({}));
    setMessage(result.message ?? (response.ok ? "Media asset deleted." : "Delete failed."));
    if (response.ok) setRows((current) => current.filter((asset) => asset.id !== id));
  };
  return <>{message && <p className="mt-4 text-sm text-cyan-ai">{message}</p>}{rows.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2">{rows.map((asset) => <div key={asset.id} className="rounded-xl border border-glass bg-white/5 p-4"><p className="truncate text-sm font-medium">{asset.filename}</p><p className="mt-2 text-xs text-slate-muted">{asset.altText}</p><p className="mt-1 text-xs text-slate-muted">{asset.mimeType} · {(asset.size / 1024).toFixed(1)} KB</p><div className="mt-4 flex items-center justify-between gap-3"><a href={asset.url} target="_blank" rel="noreferrer" className="text-xs text-cyan-ai">Open asset →</a><button type="button" onClick={() => remove(asset.id)} className="text-xs text-red-300">Delete</button></div></div>)}</div> : <p className="mt-4 text-sm leading-relaxed text-slate-muted">No assets are stored yet. Configure Vercel Blob, PostgreSQL, and upload an approved asset.</p>}</>;
}
