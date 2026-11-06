"use client";

import Image from "next/image";
import type { BlogOptions } from "@/lib/blog-options";
type ArticleImage = BlogOptions["images"][number];
export default function BlogMediaPanel({ images, cover, onChange, onCoverChange, onInsert, onRemove, disabled }: {
  images: ArticleImage[]; cover: string; onChange: (images: ArticleImage[]) => void;
  onCoverChange: (url: string) => void; onInsert: (image: ArticleImage) => void; onRemove: (url: string) => void; disabled: boolean;
}) {
  return <details className="rounded-xl border border-glass p-5"><summary className="cursor-pointer font-semibold">Manage uploaded images ({images.length})</summary>
    <p className="my-4 text-sm text-slate-muted">Images appear in the story only where you insert them. Edit descriptions and captions here, or reuse an uploaded image. Unused uploads stay private.</p>
    <fieldset disabled={disabled} className="grid max-h-[640px] gap-4 overflow-y-auto pr-2 md:grid-cols-2">{images.map((image, index) => <div key={image.url} className="space-y-3 rounded-xl border border-glass p-4"><Image src={image.url.replace("/api/media/", "/api/admin/media/")} alt={image.alt} width={600} height={400} unoptimized className="aspect-video w-full rounded-lg object-contain" /><label className="block text-sm">Image {index + 1} description<input value={image.alt} maxLength={300} onChange={(event) => onChange(images.map((item) => item.url === image.url ? { ...item, alt: event.target.value } : item))} className="mt-2 w-full rounded-lg border border-glass bg-midnight p-3" /></label><label className="block text-sm">Caption<input value={image.caption} maxLength={500} onChange={(event) => onChange(images.map((item) => item.url === image.url ? { ...item, caption: event.target.value } : item))} className="mt-2 w-full rounded-lg border border-glass bg-midnight p-3" /></label><div className="flex flex-wrap gap-2"><button type="button" className="btn-secondary text-sm" disabled={image.alt.trim().length < 2} onClick={() => onInsert(image)}>Insert at cursor</button><button type="button" className="btn-secondary text-sm" disabled={image.alt.trim().length < 2} onClick={() => onCoverChange(cover === image.url ? "" : image.url)}>{cover === image.url ? "Remove cover" : "Use as cover"}</button><button type="button" className="btn-secondary text-sm" onClick={() => onRemove(image.url)}>Remove from article</button></div>{cover === image.url && <p className="text-xs text-cyan-ai">Main cover image</p>}</div>)}</fieldset>
    {!images.length && <p className="text-sm text-slate-muted">No uploaded images yet. Add a cover above or use Add image in the writing toolbar.</p>}
  </details>;
}
