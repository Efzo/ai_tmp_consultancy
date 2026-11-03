"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, History } from "lucide-react";
import { homeDefaults, homeSchema, type HomeContent } from "@/lib/home-content";
import { savePageDraft, publishPage, restorePageVersion } from "@/app/actions/cms";

type Section = HomeContent["sections"][number];
const inputClass = "block w-full mt-2 p-3 rounded bg-midnight border border-glass";

export default function HomeEditor({ page, versions }: {
  page?: { id: string; content: unknown; metaTitle: string | null; metaDescription: string | null };
  versions: { id: string; version: number; createdAt: string }[];
}) {
  const parsed = homeSchema.safeParse(page?.content);
  const [content, setContent] = useState(parsed.success ? parsed.data : homeDefaults);
  const [id, setId] = useState(page?.id);
  const [metaTitle, setMetaTitle] = useState(page?.metaTitle ?? "Your Technology Partner");
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
    <section className="glass-panel p-6 space-y-4"><h2 className="text-xl font-bold">Managed technology business model</h2><p className="text-slate-muted">Load the new positioning, four service pillars, business-owner and founder paths, and ongoing-care FAQs into this form. Review and preview before publishing.</p><button className="btn-secondary" disabled={busy} onClick={() => { if (confirm("Replace this form with the managed technology homepage template? Published content stays unchanged until you publish.")) { setContent(structuredClone(homeDefaults)); setMetaTitle("Your Technology Partner"); setMetaDescription(homeDefaults.hero.subheadline); setMessage("Business model template loaded. Review, save a draft, or preview before publishing."); } }}>Review business model homepage</button></section>
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
    <section className="glass-panel p-6 space-y-4"><h2 className="text-xl font-bold">Featured service pillars</h2><p className="text-slate-muted">Enter service slugs in display order, one per line. Only published services appear. Clear the list to show none. Manage the service text and publication under Service Pages.</p><label className="block">Service slugs<textarea rows={5} className={inputClass} value={(content.pillars.serviceSlugs ?? ["technical-product-management", "software-engineering", "ai-solutions", "software-architecture"]).join("\n")} onChange={(event) => setContent({ ...content, pillars: { ...content.pillars, serviceSlugs: event.target.value.split("\n").map((slug) => slug.trim()).filter(Boolean) } })} /></label></section>
    <section className="glass-panel p-6 space-y-5"><h2 className="text-xl font-bold">Customer paths</h2><p className="text-slate-muted">Add, remove, or reorder the paths visitors can take. Edit the destination pages in Website Pages.</p>{content.audiences.items.map((item, index) => <fieldset key={index} className="rounded border border-glass p-4 space-y-3"><legend>Path {index + 1}</legend>{(["title", "description", "cta", "href"] as const).map((field) => <label key={field} className="block">{field === "href" ? "Destination URL" : field === "cta" ? "Button text" : field}<textarea className={inputClass} value={item[field]} onChange={(event) => setContent({ ...content, audiences: { ...content.audiences, items: content.audiences.items.map((row, i) => i === index ? { ...row, [field]: event.target.value } : row) } })} /></label>)}<div className="flex flex-wrap gap-3"><button className="btn-secondary" disabled={index === 0} onClick={() => { const items = [...content.audiences.items]; [items[index - 1], items[index]] = [items[index], items[index - 1]]; setContent({ ...content, audiences: { ...content.audiences, items } }); }}>Move path up</button><button className="btn-secondary" onClick={() => setContent({ ...content, audiences: { ...content.audiences, items: content.audiences.items.filter((_, i) => i !== index) } })}>Remove path</button></div></fieldset>)}<button className="btn-secondary" disabled={content.audiences.items.length >= 6} onClick={() => setContent({ ...content, audiences: { ...content.audiences, items: [...content.audiences.items, { title: "New customer path", description: "Describe who this path helps.", cta: "Explore services", href: "/services" }] } })}>Add customer path</button></section>
    <section className="glass-panel p-6"><h2 className="text-xl font-bold">Business problems</h2><label className="block mt-4">One problem per line<textarea rows={6} className={inputClass} value={content.problems.items.join("\n")} onChange={(event) => setContent({ ...content, problems: { ...content.problems, items: event.target.value.split("\n") } })} /></label></section>
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
    <details className="group glass-panel overflow-hidden">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
        <History aria-hidden="true" className="h-5 w-5 shrink-0 text-electric" />
        <h2 className="flex-1 text-lg font-semibold">Revision history</h2>
        <span className="rounded-full border border-glass px-2.5 py-1 text-xs text-slate-muted">{versions.length} recent</span>
        <ChevronDown aria-hidden="true" className="h-4 w-4 text-slate-muted transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-glass">
        <p className="px-5 py-4 text-sm text-slate-muted sm:px-6">Showing up to 10 recent revisions. Restoring replaces your editor content with a saved revision as a new draft. Publish it when ready to update the website.</p>
        {versions.length ? <div role="region" aria-label="Recent homepage revisions" tabIndex={0} className="max-h-80 overflow-y-auto overscroll-contain px-5 pb-2 sm:px-6">
          <ul className="divide-y divide-glass">{versions.map((version, index) => <li key={version.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div><p className="text-sm font-medium">Version {version.version}{index === 0 && <span className="ml-2 text-xs font-normal text-electric">Latest saved</span>}</p><time dateTime={version.createdAt} className="mt-1 block text-xs text-slate-muted">{new Date(version.createdAt).toLocaleString("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })} UTC</time></div>
            <button type="button" className="btn-secondary text-sm" disabled={busy || !id} aria-label={`Restore version ${version.version} as a draft`} onClick={async () => {
              if (!id || !confirm(`Restore version ${version.version} as a new draft? This replaces any unsaved edits. Your published homepage stays unchanged until you publish.`)) return;
              setBusy(true);
              try { const result = await restorePageVersion(id, version.id); setMessage(result.message); if (result.success) window.location.reload(); }
              catch { setMessage("The version could not be restored."); }
              finally { setBusy(false); }
            }}>Restore as draft</button>
          </li>)}</ul>
        </div> : <p className="px-5 pb-5 text-sm text-slate-muted sm:px-6">Revisions will appear after you save your first draft.</p>}
      </div>
    </details>
  </div>;
}
