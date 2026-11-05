"use client";

import Image from "next/image";
import { useState } from "react";
import type { BlogOptions } from "@/lib/blog-options";

type ArticleImage = BlogOptions["images"][number];
const inputClass = "mt-2 w-full rounded-lg border border-glass bg-midnight p-3";
export default function BlogMediaPanel({ images, cover, onChange, onCoverChange, onInsert, onRemove, onBusy, disabled }: {
  images: ArticleImage[]; cover: string; onChange: (images: ArticleImage[]) => void;
  onCoverChange: (url: string) => void; onInsert: (image: ArticleImage) => void; onRemove: (url: string) => void;
  onBusy: (busy: boolean) => void; disabled: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []); event.target.value = "";
    if (!files.length) return;
    if (files.length > 10 || files.length + images.length > 30) { setMessage("Choose up to 10 images at once, with up to 30 images per article."); return; }
    if (files.some((file) => !["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"].includes(file.type) || file.size > 10 * 1024 * 1024)) { setMessage("Use PNG, JPEG, WebP, AVIF or GIF, up to 10 MB each."); return; }
    setUploading(true); onBusy(true); setMessage("Uploading images…");
    try {
      const form = new FormData(); files.forEach((file) => form.append("files", file)); form.set("altText", "Article image — add a description in the composer");
      const response = await fetch("/api/admin/media", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok || !result.assets?.length) throw new Error(result.message || "The images could not be uploaded.");
      const added: ArticleImage[] = result.assets.map((asset: { id: string; filename: string }) => ({ url: `/api/media/${asset.id}`, alt: (asset.filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ").trim().slice(0, 300).length >= 2 ? asset.filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ").trim().slice(0, 300) : "Article image"), caption: "" }));
      onChange([...images, ...added]);
      setMessage(`${result.message} Edit each description before inserting images or choosing a cover. Save the article to keep these attachments.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed. Please try again."); }
    finally { setUploading(false); onBusy(false); }
  }
  return <fieldset disabled={disabled || uploading} className="space-y-4 rounded-xl border border-glass p-5"><legend className="px-2 font-semibold">Article images</legend>
    <p className="text-sm text-slate-muted">Upload multiple images, describe them, then insert each at your cursor in the article or use it as the cover. Only images used in a published article become public.</p>
    <label className="block text-sm">Upload images<input type="file" multiple accept="image/png,image/jpeg,image/webp,image/avif,image/gif" disabled={images.length >= 30 || uploading || disabled} onChange={upload} className="mt-2 block w-full text-sm" /></label>
    <p role="status" aria-live="polite" className="text-sm text-cyan-ai">{message}</p>
    {images.length > 0 && <div className="grid max-h-[640px] gap-4 overflow-y-auto pr-2 md:grid-cols-2">{images.map((image, index) => <div key={image.url} className="space-y-3 rounded-xl border border-glass p-4"><Image src={image.url.replace("/api/media/", "/api/admin/media/")} alt={image.alt} width={600} height={400} unoptimized className="aspect-video w-full rounded-lg object-contain" /><label className="block text-sm">Image {index + 1} description (alt text)<input value={image.alt} maxLength={300} onChange={(event) => onChange(images.map((item) => item.url === image.url ? { ...item, alt: event.target.value } : item))} className={inputClass} /></label><label className="block text-sm">Caption<input value={image.caption} maxLength={500} onChange={(event) => onChange(images.map((item) => item.url === image.url ? { ...item, caption: event.target.value } : item))} className={inputClass} /></label><div className="flex flex-wrap gap-2"><button type="button" className="btn-secondary text-sm" disabled={image.alt.trim().length < 2} onClick={() => onInsert(image)}>Insert in article</button><button type="button" className="btn-secondary text-sm" disabled={image.alt.trim().length < 2} onClick={() => onCoverChange(cover === image.url ? "" : image.url)}>{cover === image.url ? "Remove cover" : "Use as cover"}</button><button type="button" className="btn-secondary text-sm" onClick={() => onRemove(image.url)}>Remove image</button></div>{cover === image.url && <p className="text-xs text-cyan-ai">Cover and social sharing image</p>}</div>)}</div>}
  </fieldset>;
}
