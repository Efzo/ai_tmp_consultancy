"use client";

import Image from "next/image";
import { useState } from "react";
import CaseImageUpload from "./CaseImageUpload";
import { screenshotUrlSchema, type CaseDetails } from "@/lib/case-details";

const inputClass = "mt-2 block w-full rounded-lg border border-glass bg-midnight p-3";
export default function CaseStudyMediaEditor({ images, details, onChange, disabled }: {
  images: string[]; details: CaseDetails; onChange: (images: string[], details: CaseDetails) => void; disabled: boolean;
}) {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const patch = (value: Partial<CaseDetails>) => onChange(images, { ...details, ...value });
  function attach(value: string, alt = "") {
    const parsed = screenshotUrlSchema.safeParse(value);
    if (!parsed.success) { setMessage("Use an HTTPS screenshot URL or upload an image."); return; }
    if (images.includes(parsed.data)) { setMessage("This screenshot is already attached."); return; }
    if (images.length >= 20) { setMessage("You can attach up to 20 screenshots."); return; }
    onChange([...images, parsed.data], { ...details, screenshots: [...details.screenshots.filter((item) => item.url !== parsed.data), { url: parsed.data, alt, caption: "" }] });
    setUrl(""); setMessage("Screenshot added to the editor. Save the case study to apply it.");
  }
  function imageMetadata(image: string, value: { alt?: string; caption?: string }) {
    const current = details.screenshots.find((item) => item.url === image) ?? { url: image, alt: "", caption: "" };
    patch({ screenshots: [...details.screenshots.filter((item) => item.url !== image), { ...current, ...value }] });
  }
  return <fieldset disabled={disabled} className="space-y-6 rounded-xl border border-glass p-5 sm:p-6"><legend className="px-2 text-xl font-semibold">Screenshots & product preview</legend>
    <p className="text-sm text-slate-muted">Upload product screenshots or add image URLs. The first screenshot is the cover image. Save the case study to apply changes; screenshots on published case studies are public.</p>
    {images.length > 0 && <ol className="grid gap-5 lg:grid-cols-2">{images.map((image, index) => {
      const metadata = details.screenshots.find((item) => item.url === image);
      const preview = image.startsWith("/api/media/") ? image.replace("/api/media/", "/api/admin/media/") : image;
      return <li key={image} className="space-y-4 rounded-xl border border-glass p-4"><p className="text-sm font-semibold">Screenshot {index + 1}{index === 0 ? " · Cover image" : ""}</p><Image src={preview} alt={metadata?.alt || `Screenshot ${index + 1} preview`} width={600} height={400} unoptimized className="aspect-video w-full rounded-lg bg-white/5 object-contain" /><label className="block text-sm">Image description (alt text)<input className={inputClass} maxLength={300} value={metadata?.alt ?? ""} onChange={(event) => imageMetadata(image, { alt: event.target.value })} /></label><label className="block text-sm">Caption (optional)<textarea className={inputClass} maxLength={500} rows={2} value={metadata?.caption ?? ""} onChange={(event) => imageMetadata(image, { caption: event.target.value })} /></label><div className="flex flex-wrap gap-3"><button type="button" disabled={index === 0} className="btn-secondary text-sm" aria-label={`Move screenshot ${index + 1} up`} onClick={() => { const next = [...images]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next, details); }}>Move up</button><button type="button" disabled={index === images.length - 1} className="btn-secondary text-sm" aria-label={`Move screenshot ${index + 1} down`} onClick={() => { const next = [...images]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; onChange(next, details); }}>Move down</button><button type="button" className="btn-secondary text-sm" aria-label={`Remove screenshot ${index + 1}`} onClick={() => onChange(images.filter((item) => item !== image), { ...details, screenshots: details.screenshots.filter((item) => item.url !== image) })}>Remove</button></div></li>;
    })}</ol>}
    {images.length < 20 && <><CaseImageUpload onUpload={attach} /><div className="space-y-3"><label className="block text-sm">Or add an existing screenshot URL<input type="url" className={inputClass} placeholder="https://example.com/screenshot.png" value={url} onChange={(event) => setUrl(event.target.value)} /></label><button type="button" className="btn-secondary" onClick={() => attach(url)}>Add screenshot URL</button></div></>}
    <p role="status" aria-live="polite" className="text-sm text-cyan-ai">{message}</p>
    <div className="space-y-4 border-t border-glass pt-5"><label className="block text-sm">Public product URL (optional)<input type="url" className={inputClass} placeholder="https://your-product.com" value={details.productUrl} onChange={(event) => patch({ productUrl: event.target.value })} /><span className="mt-2 block text-xs text-slate-muted">Displays a Visit product button. Use a public product page or demo.</span></label><label className="block text-sm">Embedded preview URL (optional)<input type="url" className={inputClass} placeholder="https://your-product.com/demo" value={details.embedUrl} onChange={(event) => patch({ embedUrl: event.target.value })} /></label><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={details.showEmbed} onChange={(event) => patch({ showEmbed: event.target.checked })} className="accent-electric" />Show interactive preview on the case study</label><p className="text-xs text-slate-muted">Visitors choose when to load the external preview. Some products block embedding; an external preview link remains available. Screenshots work independently.</p></div>
  </fieldset>;
}
