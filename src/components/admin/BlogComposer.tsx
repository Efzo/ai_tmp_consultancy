"use client";

import { useRef } from "react";
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
    <BlogMediaPanel images={options.images} cover={cover} onChange={updateImages} onCoverChange={onCoverChange} onInsert={(image) => editor.current?.insertImage(image)} onRemove={removeImage} onBusy={onUploadBusy} disabled={disabled} />
    <div><p className="mb-2 text-sm text-slate-muted">Content</p><RichTextEditor ref={editor} value={content} onChange={onContentChange} /></div>
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
