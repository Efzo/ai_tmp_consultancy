"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { homeDefaults, homeSchema, type HomeContent } from "@/lib/home-content";
import { savePageDraft, publishPage, restorePageVersion } from "@/app/actions/cms";

type Section = HomeContent["sections"][number];
const inputClass = "block w-full mt-2 p-3 rounded bg-midnight border border-glass";

export default function HomeEditor({ page, versions }: {
  page?: { id: string; content: unknown; metaTitle: string | null; metaDescription: string | null };
  versions: { id: string; version: number }[];
}) {
  const parsed = homeSchema.safeParse(page?.content);
  const [content, setContent] = useState(parsed.success ? parsed.data : homeDefaults);
  const [id, setId] = useState(page?.id);
  const [metaTitle, setMetaTitle] = useState(page?.metaTitle ?? "Technology & Product Consulting");
  const [metaDescription, setMetaDescription] = useState(page?.metaDescription ?? homeDefaults.hero.subheadline);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function save(publish: boolean, preview = false) {
    const validation = homeSchema.safeParse(content);
    if (!validation.success) {
      setMessage(validation.error.issues.map((issue) => `${issue.path.join(" / ")}: ${issue.message}`).join("; "));
      return;
    }
    setBusy(true);
    try {
      const result = await savePageDraft({ id, slug: "home", title: "Homepage", content: validation.data, metaTitle, metaDescription });
      setMessage(result.message);
      if (result.success && result.id) {
        setId(result.id);
        if (publish) setMessage((await publishPage(result.id)).message);
        if (preview) { window.location.assign(new URL("/api/admin/preview?slug=home", window.location.origin).href); return; }
        router.refresh();
      }
    } catch { setMessage("The homepage could not be saved. Please try again."); }
    finally { setBusy(false); }
  }

  function toggle(key: Section) {
    if (key === "hero") return;
    setContent((current) => ({ ...current, sections: current.sections.includes(key) ? current.sections.filter((item) => item !== key) : [...current.sections, key] }));
  }
  function move(index: number, direction: number) {
    const sections = [...content.sections];
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    [sections[index], sections[target]] = [sections[target], sections[index]];
    setContent({ ...content, sections });
  }

  return <div className="space-y-6">
    <h1 className="text-3xl font-bold">Edit Homepage</h1>
    <p className="text-slate-muted">Edit sections, FAQs, links, and metadata. Drafts stay private until published.</p>
    <label className="block">SEO title<input className={inputClass} value={metaTitle} onChange={(event) => setMetaTitle(event.target.value)} /></label>
    <label className="block">SEO description<textarea className={inputClass} value={metaDescription} onChange={(event) => setMetaDescription(event.target.value)} /></label>
    <section className="glass-panel p-6 space-y-4">
      <h2 className="text-xl font-bold">Section order and visibility</h2>
      {content.sections.map((key, index) => <div className="flex flex-wrap items-center gap-3" key={key}>
        <span className="flex-1 capitalize">{key}</span>
        <button disabled={index === 0} className="btn-secondary" aria-label={`Move ${key} up`} onClick={() => move(index, -1)}>↑</button>
        <button disabled={index === content.sections.length - 1} className="btn-secondary" aria-label={`Move ${key} down`} onClick={() => move(index, 1)}>↓</button>
        <button disabled={key === "hero"} className="btn-secondary" onClick={() => toggle(key)}>Hide {key}</button>
      </div>)}
      {homeDefaults.sections.filter((key) => !content.sections.includes(key)).map((key) => <button key={key} className="btn-secondary mr-3" onClick={() => toggle(key)}>Show {key}</button>)}
    </section>
    {Object.entries(content).filter(([key]) => key !== "sections").map(([key, value]) => <fieldset key={key} className="glass-panel p-6 space-y-4">
      <legend className="capitalize text-xl font-bold">{key}</legend>
      {Object.entries(value).filter(([, text]) => typeof text === "string").map(([field, text]) => <label className="block text-sm" key={field}>{field === "contactCta" ? "Contact button text" : field === "contactHref" ? "Contact button URL" : field.replace(/([A-Z])/g, " $1")}<textarea rows={2} value={text as string} onChange={(event) => setContent({ ...content, [key]: { ...value, [field]: event.target.value } })} className={inputClass} /></label>)}
    </fieldset>)}
    <section className="glass-panel p-6"><h2 className="text-xl font-bold">Problems I solve</h2><label className="block mt-4">One problem per line<textarea rows={6} className={inputClass} value={content.problems.items.join("\n")} onChange={(event) => setContent({ ...content, problems: { ...content.problems, items: event.target.value.split("\n") } })} /></label></section>
    <section className="glass-panel p-6 space-y-5">
      <h2 className="text-xl font-bold">Frequently asked questions</h2>
      {content.faq.items.map((item, index) => <div key={index} className="border border-glass rounded p-4 space-y-3">
        <label className="block">Question<input className={inputClass} value={item.q} onChange={(event) => setContent({ ...content, faq: { ...content.faq, items: content.faq.items.map((row, i) => i === index ? { ...row, q: event.target.value } : row) } })} /></label>
        <label className="block">Answer<textarea className={inputClass} value={item.a} onChange={(event) => setContent({ ...content, faq: { ...content.faq, items: content.faq.items.map((row, i) => i === index ? { ...row, a: event.target.value } : row) } })} /></label>
        <button className="btn-secondary" onClick={() => setContent({ ...content, faq: { ...content.faq, items: content.faq.items.filter((_, i) => i !== index) } })}>Remove question</button>
      </div>)}
      <button className="btn-secondary" onClick={() => setContent({ ...content, faq: { ...content.faq, items: [...content.faq.items, { q: "", a: "" }] } })}>Add question</button>
    </section>
    <p role="status">{message}</p>
    <div className="flex gap-4"><button disabled={busy} onClick={() => save(false)} className="btn-secondary">Save draft</button><button disabled={busy} onClick={() => save(false, true)} className="btn-secondary">Save & Preview</button><button disabled={busy} onClick={() => save(true)} className="btn-primary">Save and publish</button></div>
    <h2 className="text-xl font-bold">Revision history</h2>
    {versions.map((version) => <button key={version.id} className="btn-secondary mr-3" disabled={busy || !id} onClick={async () => {
      if (!id) return;
      setBusy(true);
      try { const result = await restorePageVersion(id, version.id); setMessage(result.message); if (result.success) window.location.reload(); }
      catch { setMessage("The version could not be restored."); }
      finally { setBusy(false); }
    }}>Restore v{version.version} as draft</button>)}
  </div>;
}
