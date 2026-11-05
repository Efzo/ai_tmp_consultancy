"use client";

import { useState } from "react";

export default function ProductPreview({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  return <div className="overflow-hidden rounded-2xl border border-glass">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-glass bg-white/5 p-5"><h3 className="font-semibold">Interactive product preview</h3><a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-electric">Open preview in a new tab ↗</a></div>
    {loaded ? <iframe src={url} title={`${title} interactive product preview`} className="h-[520px] w-full bg-white md:h-[640px]" loading="lazy" referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" /> : <div className="space-y-4 p-8 text-center"><p className="text-sm text-slate-muted">Load the external product here, or open it in a new tab.</p><button type="button" className="btn-secondary" onClick={() => setLoaded(true)}>Load interactive preview</button></div>}
    <p className="border-t border-glass p-4 text-xs text-slate-muted">If the product does not display here, open the preview in a new tab.</p>
  </div>;
}
