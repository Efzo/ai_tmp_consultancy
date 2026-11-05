"use client";

import { useRef, useState } from "react";

const imageTypes = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"];
export default function CaseImageUpload({ onUpload, context = "case study", initialAlt = "", disabled = false, onBusyChange }: {
  onUpload: (url: string, alt?: string) => void;
  context?: "case study" | "page";
  initialAlt?: string;
  disabled?: boolean;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [alt, setAlt] = useState(initialAlt);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLInputElement>(null);

  async function upload() {
    if (!file) { setMessage("Choose an image first."); fileInput.current?.focus(); return; }
    if (alt.trim().length < 2) { setMessage("Add a meaningful image description before uploading."); descriptionInput.current?.focus(); return; }
    setBusy(true); onBusyChange?.(true); setMessage("");
    const data = new FormData(); data.append("files", file); data.set("altText", alt.trim());
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: data });
      const result = await response.json();
      if (response.ok && result.assets?.[0]) {
        onUpload(`/api/media/${result.assets[0].id}`, alt.trim());
        setFile(null); if (fileInput.current) fileInput.current.value = "";
        setMessage(context === "page" ? "Uploaded and added to the editor. Use Save & Publish to update the public page." : "Uploaded and added to the editor. Save the case study to apply the image.");
      } else setMessage(result.message || "Upload failed. Please try again.");
    } catch { setMessage("Upload failed. Please try again."); }
    finally { setBusy(false); onBusyChange?.(false); }
  }

  return <div className="space-y-4 rounded-xl border border-glass p-4">
    <p className="text-sm text-slate-muted">Choose an image, check its description, then upload. Images used on a published {context} become public.</p>
    <label className="block text-sm">Choose image<input ref={fileInput} type="file" accept={imageTypes.join(",")} disabled={busy || disabled} className="mt-2 block w-full text-sm file:mr-4 file:rounded-lg file:border file:border-glass file:bg-white/10 file:px-4 file:py-2 file:text-white" onChange={(event) => {
      const selected = event.target.files?.[0] ?? null;
      if (selected && (!imageTypes.includes(selected.type) || selected.size > 10 * 1024 * 1024)) {
        setFile(null); event.target.value = ""; setMessage("Use PNG, JPEG, WebP, AVIF, or GIF, up to 10 MB."); return;
      }
      setFile(selected); setMessage(selected ? `Selected: ${selected.name}. Check the description, then click Upload image.` : "");
    }} /></label>
    <p className="text-xs text-slate-muted">PNG, JPEG, WebP, AVIF, or GIF · Maximum 10 MB</p>
    <label className="block text-sm">Image description (alt text)<input ref={descriptionInput} value={alt} maxLength={300} disabled={busy || disabled} onChange={(event) => setAlt(event.target.value)} placeholder="Describe the person or content shown" className="mt-2 block w-full rounded border border-glass bg-midnight p-3" /></label>
    <button type="button" disabled={busy || disabled || !file} className="btn-secondary disabled:opacity-60" onClick={upload}>{busy ? "Uploading…" : "Upload image"}</button>
    <p role="status" aria-live="polite" className="text-sm text-cyan-ai">{message}</p>
  </div>;
}
