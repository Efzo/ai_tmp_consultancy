"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BlogImageUpload from "./BlogImageUpload";
import RichTextEditor, { type RichTextEditorHandle } from "./RichTextEditor";
import BlogMediaPanel from "./BlogMediaPanel";
import { blogDescription, type BlogOptions } from "@/lib/blog-options";

const inputClass = "mt-2 block w-full rounded-lg border border-glass bg-midnight p-3";
export default function BlogComposer({ title, slug, excerpt, content, options, cover, onContentChange, onOptionsChange, onCoverChange, onUploadBusy, disabled }: {
  title: string; slug: string; excerpt: string; content: string; options: BlogOptions; cover: string;
  onContentChange: (value: string) => void; onOptionsChange: (patch: Partial<BlogOptions>) => void;
  onCoverChange: (value: string) => void; onUploadBusy: (value: boolean) => void; disabled: boolean;
}) {
  const editor = useRef<RichTextEditorHandle>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const coverImage = options.images.find((image) => image.url === cover);
  useEffect(() => { if (showImageDialog) dialog.current?.showModal(); }, [showImageDialog]);
  function closeImageDialog() { dialog.current?.close(); setShowImageDialog(false); editor.current?.focus(); }
  function addImage(image: BlogOptions["images"][number], asCover: boolean) {
    onOptionsChange({ images: [...options.images, image] });
    if (asCover) onCoverChange(image.url);
    else { closeImageDialog(); editor.current?.insertImage(image); }
  }
  const description = blogDescription(excerpt, options);
  function updateImages(images: BlogOptions["images"]) {
    const doc = new DOMParser().parseFromString(content, "text/html");
    let changed = false;
    doc.querySelectorAll("img").forEach((img) => {
      const image = images.find((item) => item.url === img.getAttribute("src"));
      if (!image) return;
      img.alt = image.alt;
      const figure = img.closest("figure");
      if (figure) {
        figure.querySelector("figcaption")?.remove();
        if (image.caption) { const caption = doc.createElement("figcaption"); caption.textContent = image.caption; figure.append(caption); }
      }
      changed = true;
    });
    if (changed) onContentChange(doc.body.innerHTML);
    onOptionsChange({ images });
  }
  function removeImage(url: string) {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("img").forEach((img) => { if (img.getAttribute("src") === url) (img.closest("figure") || img).remove(); });
    onContentChange(doc.body.innerHTML);
    onOptionsChange({ images: options.images.filter((image) => image.url !== url) });
    if (cover === url) onCoverChange("");
  }
  return <div className="space-y-6">
    <fieldset disabled={disabled} className="space-y-4 rounded-xl border border-glass p-5"><legend className="px-2 font-semibold">Main cover image</legend>
      <p className="text-sm text-slate-muted">Shown at the top of the post, on blog cards, and in social previews. It is separate from images inside your story.</p>
      {cover && <div className="max-w-xl space-y-3"><Image src={cover.replace("/api/media/", "/api/admin/media/")} alt={coverImage?.alt || title} width={800} height={450} unoptimized className="aspect-video w-full rounded-xl object-contain bg-white/5" />{coverImage && <label className="block text-sm">Cover image description<input value={coverImage.alt} maxLength={300} onChange={(event) => updateImages(options.images.map((image) => image.url === cover ? { ...image, alt: event.target.value } : image))} className={inputClass} /></label>}<button type="button" className="btn-secondary text-sm" onClick={() => onCoverChange("")}>Remove cover</button></div>}
      <BlogImageUpload label={cover ? "Upload replacement cover" : "Upload cover image"} disabled={disabled || options.images.length >= 30} onBusy={onUploadBusy} onUploaded={(image) => addImage(image, true)} />
      {!!options.images.length && <label className="block text-sm">Or choose an uploaded image<select value={cover} onChange={(event) => onCoverChange(event.target.value)} className={inputClass}><option value="">No cover image</option>{options.images.map((image, index) => <option key={image.url} value={image.url}>{index + 1}. {image.alt}</option>)}</select></label>}
    </fieldset>
    <div><h3 className="mb-2 font-semibold">Write your story</h3><p className="mb-3 text-sm text-slate-muted">Write a paragraph, place your cursor, and use Add image whenever you need one. You can continue writing after each image.</p><RichTextEditor ref={editor} value={content} onChange={onContentChange} onAddImage={() => setShowImageDialog(true)} disabled={disabled} /></div>
    {showImageDialog && <dialog ref={dialog} onCancel={(event) => { if (disabled) event.preventDefault(); else closeImageDialog(); }} className="m-auto max-h-[85vh] w-[min(95vw,36rem)] overflow-y-auto rounded-2xl border border-glass bg-midnight p-6 text-platinum shadow-2xl backdrop:bg-black/70"><div className="mb-5 flex items-center justify-between gap-4"><h3 className="text-xl font-semibold">Add an image to your story</h3><button type="button" disabled={disabled} onClick={closeImageDialog} className="btn-secondary text-sm">Cancel</button></div><p className="mb-5 text-sm text-slate-muted">The image will be inserted at the writing position you selected.</p>{options.images.length < 30 ? <BlogImageUpload label="Upload & insert at cursor" disabled={disabled} onBusy={onUploadBusy} onUploaded={(image) => addImage(image, false)} /> : <p className="text-sm text-slate-muted">This article already has 30 images. Reuse an image below or remove an unused one.</p>}{!!options.images.length && <div className="mt-6 space-y-2 border-t border-glass pt-4"><p className="font-semibold">Reuse an uploaded image</p>{options.images.map((image) => <button type="button" key={image.url} disabled={disabled || image.alt.trim().length < 2} className="block w-full rounded-lg border border-glass p-3 text-left text-sm hover:bg-white/5" onClick={() => { closeImageDialog(); editor.current?.insertImage(image); }}>{image.alt}{image.url === cover ? " (cover)" : ""}</button>)}</div>}</dialog>}
    <BlogMediaPanel images={options.images} cover={cover} onChange={updateImages} onCoverChange={onCoverChange} onInsert={(image) => editor.current?.insertImage(image)} onRemove={removeImage} disabled={disabled} />
    <details className="rounded-xl border border-glass p-5" open><summary className="cursor-pointer font-semibold">SEO &amp; answer engine content</summary><fieldset disabled={disabled} className="mt-5 space-y-5">
      <div className="grid gap-5 md:grid-cols-2"><label className="block text-sm">Search title (optional)<input value={options.seoTitle} maxLength={160} placeholder={title || "Uses the article title"} onChange={(event) => onOptionsChange({ seoTitle: event.target.value })} className={inputClass} /><span className="mt-2 block text-xs text-slate-muted">{options.seoTitle.length}/160 · Aim for a clear title around 50–60 characters.</span></label><label className="block text-sm">Author name<input value={options.authorName} maxLength={120} onChange={(event) => onOptionsChange({ authorName: event.target.value })} className={inputClass} /></label></div>
      <label className="block text-sm">Search description (optional)<textarea rows={3} value={options.seoDescription} maxLength={160} placeholder="Explain what readers will learn. Falls back to the excerpt." onChange={(event) => onOptionsChange({ seoDescription: event.target.value })} className={inputClass} /><span className="mt-2 block text-xs text-slate-muted">{options.seoDescription.length}/160 · Aim for 120–160 characters that accurately describe this article.</span></label>
      <label className="block text-sm">Topics / tags (one per line)<textarea rows={3} value={options.tags.join("\n")} onChange={(event) => onOptionsChange({ tags: event.target.value.split("\n") })} onBlur={() => onOptionsChange({ tags: [...new Set(options.tags.map((tag) => tag.trim()).filter(Boolean))] })} className={inputClass} /></label>
      <div className="rounded-xl border border-glass bg-white/5 p-4"><p className="text-xs text-slate-muted">Search preview · search engines may choose different text</p><p className="mt-3 break-all text-xs text-slate-muted">https://www.ojomoefosa.com/blog/{slug || "article-slug"}</p><p className="mt-2 text-lg text-electric">{options.seoTitle || title || "Your article title"} | Efosa Ojomo</p><p className="mt-2 text-sm text-slate-muted">{description || "Your search description appears here."}</p></div>
      <label className="block text-sm">Short answer / key takeaway (optional)<textarea rows={4} value={options.answerSummary} maxLength={600} onChange={(event) => onOptionsChange({ answerSummary: event.target.value })} placeholder="Give a concise, direct answer to the main question this article addresses." className={inputClass} /><span className="mt-2 block text-xs text-slate-muted">Visible as At a glance above the article, and included in article structured data.</span></label>
      <div className="space-y-4"><h3 className="font-semibold">Reader questions &amp; answers</h3><p className="text-sm text-slate-muted">Answer specific questions in your own words. These appear on the public page. Support factual claims with source links in the article.</p>{options.faqs.map((faq, index) => <div key={index} className="space-y-3 rounded-lg border border-glass p-4"><label className="block text-sm">Question {index + 1}<input value={faq.question} maxLength={200} onChange={(event) => onOptionsChange({ faqs: options.faqs.map((item, i) => i === index ? { ...item, question: event.target.value } : item) })} className={inputClass} /></label><label className="block text-sm">Answer<textarea rows={3} value={faq.answer} maxLength={1500} onChange={(event) => onOptionsChange({ faqs: options.faqs.map((item, i) => i === index ? { ...item, answer: event.target.value } : item) })} className={inputClass} /></label><button type="button" className="btn-secondary text-sm" onClick={() => onOptionsChange({ faqs: options.faqs.filter((_, i) => i !== index) })}>Remove question {index + 1}</button></div>)}<button type="button" className="btn-secondary" disabled={options.faqs.length >= 8} onClick={() => onOptionsChange({ faqs: [...options.faqs, { question: "", answer: "" }] })}>Add question &amp; answer</button></div>
      <p className="text-xs text-slate-muted">Canonical URLs, social sharing metadata, BlogPosting and breadcrumb structured data are generated automatically on published articles. Clear headings, useful answers, credible sources, and descriptive images support discovery. Search rankings and AI citations are not guaranteed.</p>
    </fieldset></details>
  </div>;
}
