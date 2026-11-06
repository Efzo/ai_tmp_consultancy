"use client";

import { useRef, useState } from "react";
import { getSession } from "next-auth/react";
import { upload } from "@vercel/blob/client";
import { blogImageMaxBytes, blogImageTypes, readUploadResponse } from "@/lib/blog-image-upload";
import type { BlogOptions } from "@/lib/blog-options";

type ArticleImage = BlogOptions["images"][number];
export default function BlogImageUpload({ label, disabled, onBusy, onUploaded }: { label: string; disabled: boolean; onBusy: (busy: boolean) => void; onUploaded: (image: ArticleImage) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const picker = useRef<HTMLInputElement>(null);
  const staged = useRef<{ file: File; pathname: string } | null>(null);
  async function send() {
    if (!file || alt.trim().length < 2) { setMessage("Choose an image and add a meaningful description first."); return; }
    setBusy(true); onBusy(true); setMessage("Uploading image…");
    try {
      const session = await getSession();
      const userId = (session?.user as { id?: string } | undefined)?.id;
      if (!userId) throw new Error("Your session has expired. Sign in again before uploading.");
      if (staged.current?.file !== file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-140) || "image";
        const blob = await upload(`media/blog/${userId}/${crypto.randomUUID()}/${safeName}`, file, { access: "private", handleUploadUrl: "/api/admin/media/image-upload", contentType: file.type, clientPayload: JSON.stringify({ filename: file.name.slice(0, 200), alt: alt.trim() }), onUploadProgress: ({ percentage }) => setMessage(`Uploading image… ${Math.round(percentage)}%`) });
        staged.current = { file, pathname: blob.pathname };
      }
      const result = await readUploadResponse(await fetch("/api/admin/media/image-upload/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pathname: staged.current.pathname, filename: file.name.slice(0, 200), alt: alt.trim() }) }));
      if (!result.asset?.id) throw new Error("The image could not be attached. Please try again.");
      onUploaded({ url: `/api/media/${result.asset.id}`, alt: alt.trim(), caption: caption.trim() });
      setFile(null); setAlt(""); setCaption(""); staged.current = null;
      if (picker.current) picker.current.value = "";
      setMessage("Image added. Save the article to keep your changes.");
    } catch (error) {
      const text = error instanceof Error ? error.message : "Upload failed. Please try again.";
      setMessage(/Unexpected token|Request Entity|413|too large/i.test(text) ? "The image upload was rejected as too large. Use an image up to 10 MB and try again." : text);
    } finally { setBusy(false); onBusy(false); }
  }
  return <fieldset disabled={disabled || busy} className="space-y-3">
    <label className="block text-sm">Choose image<input ref={picker} type="file" accept={blogImageTypes.join(",")} onChange={(event) => {
      const selected = event.target.files?.[0] ?? null; staged.current = null;
      if (selected && (!blogImageTypes.includes(selected.type) || selected.size > blogImageMaxBytes || !selected.size)) { setFile(null); event.target.value = ""; setMessage("Use PNG, JPEG, WebP, AVIF, or GIF, up to 10 MB."); return; }
      setFile(selected); setMessage("");
    }} className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-glass file:bg-white/10 file:px-3 file:py-2 file:text-white" /></label>
    <p className="text-xs text-slate-muted">PNG, JPEG, WebP, AVIF, or GIF · Up to 10 MB</p>
    <label className="block text-sm">Image description (alt text)<input value={alt} maxLength={300} onChange={(event) => setAlt(event.target.value)} placeholder="Describe what the image shows" className="mt-2 block w-full rounded-lg border border-glass bg-midnight p-3" /></label>
    <label className="block text-sm">Caption (optional)<input value={caption} maxLength={500} onChange={(event) => setCaption(event.target.value)} className="mt-2 block w-full rounded-lg border border-glass bg-midnight p-3" /></label>
    <button type="button" disabled={disabled || busy || !file || alt.trim().length < 2} onClick={send} className="btn-secondary disabled:opacity-60">{busy ? "Uploading…" : label}</button>
    {message && <p role="status" aria-live="polite" className="text-sm text-cyan-ai">{message}</p>}
  </fieldset>;
}
