"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPageDefaults, managedPageNames, parsePageContent, type ManagedPageSlug } from "@/lib/page-content-schema";
import { saveManagedPageDraft, publishManagedPage, restoreManagedPageVersion } from "@/app/actions/page-content";
import CaseImageUpload from "@/components/admin/CaseImageUpload";

const labels: Record<string, string> = { headline: "Page headline", title: "Title", description: "Description", bio: "Biography paragraphs", expertise: "Areas of expertise", expertiseHeading: "Expertise section heading", pedigree: "Experience highlights", pedigreeHeading: "Experience section heading", certs: "Certifications", certsHeading: "Certifications section heading", desc: "Description", name: "Name", status: "Status", imageUrl: "Profile image URL (optional)", imageAlt: "Image description / alt text", cta: "Call to action", primaryText: "Primary button text", primaryUrl: "Primary button URL", secondaryText: "Secondary button text (optional)", secondaryUrl: "Secondary button URL (optional)", steps: "Process steps", step: "Step number", label: "Notice above title (optional)", introduction: "Introduction", sections: "Page sections", body: "Body text (blank lines separate paragraphs)", bookingUrl: "Calendar URL (HTTPS, optional; leave blank to use deployment setting)", calendarText: "Open calendar button text", unavailableTitle: "Heading when no calendar is connected", unavailableDescription: "Message when no calendar is connected", fallbackText: "Alternative contact button text", fallbackUrl: "Alternative contact button URL", cards: "Information cards", emptyText: "Empty state message", emptyTitle: "Empty state heading", itemCta: "Card button text", itemUrl: "Card button URL", consultationText: "Consultation button text", consultationUrl: "Consultation button URL", featuresTitle: "Deliverables heading", addOnsTitle: "Add-ons heading", notice: "Proposal / pricing notice", eyebrow: "Text above page headline", submitText: "Submit inquiry button text", successTitle: "Inquiry success heading", returnText: "Return button text", returnUrl: "Return button URL", callTitle: "Booking sidebar heading", callDescription: "Booking sidebar description", callText: "Booking sidebar button text", callUrl: "Booking sidebar button URL", note: "Inquiry sidebar note" };
const inputClass = "mt-2 block w-full rounded-lg border border-glass bg-midnight p-3 text-white";
function labelFor(key: string) { return labels[key] ?? key.replace(/([A-Z])/g, " $1"); }
function blankLike(value: unknown): unknown {
  if (typeof value === "string") return "";
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, blankLike(item)]));
  return "";
}
function Fields({ value, template, onChange, field = "", path = "content" }: { value: unknown; template: unknown; onChange: (value: unknown) => void; field?: string; path?: string }) {
  if (typeof value === "string") return <label className="block text-sm" htmlFor={path}>{labelFor(field)}<textarea id={path} rows={value.length > 150 || ["body", "description", "introduction", "desc"].includes(field) ? 4 : 2} className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
  if (Array.isArray(value)) {
    const sample = Array.isArray(template) ? template[0] : undefined;
    return <fieldset className="space-y-4 rounded-xl border border-glass p-4"><legend className="px-2 text-lg font-semibold">{labelFor(field)}</legend>{value.map((item, index) => <div className="space-y-4 rounded-lg border border-glass p-4" key={index}><Fields value={item} template={sample} field={typeof item === "string" ? `${labelFor(field)} ${index + 1}` : field} path={`${path}-${index}`} onChange={(next) => onChange(value.map((row, i) => i === index ? next : row))} /><div className="flex flex-wrap gap-3"><button type="button" className="btn-secondary" disabled={index === 0} aria-label={`Move ${labelFor(field)} item ${index + 1} up`} onClick={() => { const rows = [...value]; [rows[index - 1], rows[index]] = [rows[index], rows[index - 1]]; onChange(rows); }}>Move up</button><button type="button" className="btn-secondary" disabled={index === value.length - 1} aria-label={`Move ${labelFor(field)} item ${index + 1} down`} onClick={() => { const rows = [...value]; [rows[index + 1], rows[index]] = [rows[index], rows[index + 1]]; onChange(rows); }}>Move down</button><button type="button" className="btn-secondary" onClick={() => onChange(value.filter((_, i) => i !== index))}>Remove item {index + 1}</button></div></div>)}<button type="button" className="btn-secondary" onClick={() => onChange([...value, blankLike(sample)])}>Add {labelFor(field).toLowerCase()} item</button></fieldset>;
  }
  if (value && typeof value === "object") {
    const fields = value as Record<string, unknown>;
    const defaults = template && typeof template === "object" ? template as Record<string, unknown> : {};
    return <div className="space-y-5">{Object.entries(fields).map(([key, item]) => <Fields key={key} value={item} template={defaults[key]} field={key} path={`${path}-${key}`} onChange={(next) => onChange({ ...fields, [key]: next })} />)}</div>;
  }
  return null;
}

export default function ManagedPageEditor(props: { slug: ManagedPageSlug; ready: boolean; id?: string; revision: number; content: unknown; metaTitle: string; metaDescription: string; status: string; versions: { id: string; version: number; createdAt: string }[] }) {
  const [content, setContent] = useState(props.content);
  const [id, setId] = useState(props.id);
  const [revision, setRevision] = useState(props.revision);
  const [metaTitle, setMetaTitle] = useState(props.metaTitle);
  const [metaDescription, setMetaDescription] = useState(props.metaDescription);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const router = useRouter();
  function update(next: unknown) { setContent(next); setDirty(true); }
  async function save(mode: "draft" | "publish" | "preview") {
    const parsed = parsePageContent(props.slug, content);
    if (!parsed.success) { setMessage(parsed.error.issues.map((issue) => `${issue.path.map((key) => labelFor(String(key))).join(" / ")}: ${issue.message}`).join("; ")); return; }
    setBusy(true);
    try {
      const result = await saveManagedPageDraft({ id, slug: props.slug, baseRevision: revision, content: parsed.data, metaTitle, metaDescription });
      setMessage(result.message);
      if (result.success && result.id && result.revision) {
        setId(result.id); setRevision(result.revision); setDirty(false);
        if (mode === "publish") setMessage((await publishManagedPage(props.slug, result.revision)).message);
        if (mode === "preview") { window.location.assign(new URL(`/api/admin/preview?slug=${props.slug}`, window.location.origin).href); return; }
        router.refresh();
      }
    } catch { setMessage("The page could not be saved. Your edits are still here; please try again."); }
    finally { setBusy(false); }
  }
  return <div className="space-y-8">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><Link href="/admin/content" className="text-sm text-cyan-ai">← All website pages</Link><h1 className="mt-3 text-3xl font-bold">Edit {managedPageNames[props.slug]}</h1><p className="mt-2 text-slate-muted">Edit the fields below, then save a draft, preview, or publish to update the website.</p><p className="mt-2 text-sm text-slate-muted">{dirty ? "Unsaved changes" : props.status} · Revision {revision}</p></div><a href={`/api/admin/preview?slug=${props.slug}&disable=1`} target="_blank" rel="noopener noreferrer" className="btn-secondary">View published page ↗</a></header>
    {!props.ready && <p className="glass-panel p-5 text-amber-200">The editor is connected to this page. Saving requires PostgreSQL to be configured with demo mode disabled.</p>}
    <fieldset disabled={busy} className="glass-panel p-6"><Fields value={content} template={getPageDefaults(props.slug)} onChange={update} /></fieldset>
    {props.slug === "about" && <section className="glass-panel p-6"><h2 className="mb-4 text-xl font-semibold">Upload profile image</h2><CaseImageUpload context="page" onUpload={(url, alt) => update({ ...(content as Record<string, unknown>), imageUrl: url, imageAlt: alt ?? "" })} /><p className="mt-3 text-sm text-slate-muted">Add image alt text in the page fields. Attached images become public when you publish this page.</p></section>}
    <section className="glass-panel space-y-4 p-6"><h2 className="text-xl font-semibold">Search & Social Sharing</h2><p className="text-sm text-slate-muted">Leave these blank to use the page headline and introduction.</p><label className="block">Search title<input className={inputClass} maxLength={160} value={metaTitle} onChange={(event) => { setMetaTitle(event.target.value); setDirty(true); }} /></label><label className="block">Search description<textarea className={inputClass} maxLength={320} value={metaDescription} onChange={(event) => { setMetaDescription(event.target.value); setDirty(true); }} /></label></section>
    <div className="sticky bottom-0 z-30 space-y-3 rounded-xl border border-glass bg-midnight/95 p-4 backdrop-blur-xl"><p role="status" aria-live="polite">{message}</p><div className="flex flex-wrap gap-3"><button disabled={busy || !props.ready} className="btn-secondary" onClick={() => save("draft")}>{busy ? "Working…" : "Save draft"}</button><button disabled={busy || !props.ready} className="btn-secondary" onClick={() => save("preview")}>Save & Preview</button><button disabled={busy || !props.ready} className="btn-primary" onClick={() => save("publish")}>Save & Publish</button></div></div>
    <section className="glass-panel p-6"><h2 className="text-xl font-bold">Revision history</h2><p className="mt-2 text-sm text-slate-muted">Restoring creates a new draft. The published page stays unchanged until you publish.</p>{props.versions.length ? <div className="mt-4 space-y-3">{props.versions.map((version) => <div key={version.id} className="flex flex-wrap items-center justify-between gap-3"><span>Revision {version.version} · {new Date(version.createdAt).toLocaleString()}</span><button disabled={busy || !props.ready} className="btn-secondary" onClick={async () => { if (dirty && !confirm("Restore this revision and replace your unsaved form changes?")) return; setBusy(true); try { const result = await restoreManagedPageVersion(props.slug, version.id, revision); setMessage(result.message); if (result.success) router.refresh(); } catch { setMessage("The revision could not be restored."); } finally { setBusy(false); } }}>Restore as draft</button></div>)}</div> : <p className="mt-4 text-sm text-slate-muted">Your first saved draft will appear here.</p>}</section>
  </div>;
}
