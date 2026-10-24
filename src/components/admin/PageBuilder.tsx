"use client";

import { useState } from "react";
import { publishPage, restorePageVersion, savePageDraft } from "@/app/actions/cms";

type Block = { id: string; type: "hero" | "rich-text" | "services" | "cta"; title: string; visible: boolean };
type Version = { id: string; version: number; title: string; createdAt: string };

const defaults: Block[] = [
  { id: "hero-1", type: "hero", title: "Homepage hero", visible: true },
  { id: "services-1", type: "services", title: "Services grid", visible: true },
  { id: "cta-1", type: "cta", title: "Discovery call CTA", visible: true },
];

export default function PageBuilder({ initialPage, initialVersions }: { initialPage?: { id: string; slug: string; title: string; content: unknown; metaTitle: string | null; metaDescription: string | null }; initialVersions?: Version[] }) {
  const initialContent = Array.isArray(initialPage?.content) ? initialPage.content as Block[] : defaults;
  const [page, setPage] = useState(initialPage);
  const [blocks, setBlocks] = useState<Block[]>(initialContent);
  const [title, setTitle] = useState(initialPage?.title ?? "Homepage");
  const [slug, setSlug] = useState(initialPage?.slug ?? "home");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [versions] = useState(initialVersions ?? []);

  const save = async () => {
    setBusy(true);
    const result = await savePageDraft({ id: page?.id, slug, title, content: blocks });
    setMessage(result.message);
    if (result.success && result.id && !page) setPage({ id: result.id, slug, title, content: blocks, metaTitle: null, metaDescription: null });
    setBusy(false);
  };
  const publish = async () => { if (!page) return setMessage("Save the page as a draft before publishing."); setBusy(true); const result = await publishPage(page.id); setMessage(result.message); setBusy(false); };
  const restore = async (versionId: string) => { if (!page) return; setBusy(true); const result = await restorePageVersion(page.id, versionId); setMessage(result.message); setBusy(false); };
  const localDraftKey = `admin-page-builder-${slug}`;
  const loadDraft = () => { const stored = window.localStorage.getItem(localDraftKey); if (stored) setBlocks(JSON.parse(stored)); };
  const saveLocal = () => { window.localStorage.setItem(localDraftKey, JSON.stringify(blocks)); setMessage("Saved local draft."); };
  const addBlock = (type: Block["type"]) => setBlocks((current) => [...current, { id: `${type}-${Date.now()}`, type, title: `${type.replace("-", " ")} section`, visible: true }]);
  const move = (index: number, direction: -1 | 1) => setBlocks((current) => { const target = index + direction; if (target < 0 || target >= current.length) return current; const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next; });

  return <div className="space-y-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-widest text-electric">{page ? "Database page" : "New page draft"}</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Page builder</h1><p className="mt-2 max-w-2xl text-slate-muted">Build pages from validated blocks. With PostgreSQL configured, drafts create versions and publish without a redeploy.</p></div><div className="flex flex-wrap gap-3"><button type="button" onClick={loadDraft} className="btn-secondary">Load local draft</button><button type="button" onClick={saveLocal} className="btn-secondary">Save local</button><button type="button" disabled={busy} onClick={save} className="btn-primary">{busy ? "Saving…" : "Save database draft"}</button><button type="button" disabled={busy} onClick={publish} className="rounded-full border border-cyan-ai/40 bg-cyan-ai/10 px-5 py-2 font-medium text-cyan-ai">Publish</button></div></div>{message && <div className="rounded-lg border border-electric/30 bg-electric/10 p-4 text-sm text-cyan-ai">{message}</div>}<div className="grid gap-8 lg:grid-cols-[1fr_320px]"><section className="space-y-4"><div className="glass-panel grid gap-4 p-6 md:grid-cols-2"><label className="text-sm text-slate-muted">Page title<input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><label className="text-sm text-slate-muted">Slug<input value={slug} onChange={(event) => setSlug(event.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label></div>{blocks.map((block, index) => <div key={block.id} className={`glass-card flex items-center gap-4 p-5 ${!block.visible ? "opacity-50" : ""}`}><div className="flex-1"><p className="text-xs uppercase tracking-widest text-electric">{block.type}</p><h2 className="mt-2 font-semibold">{block.title}</h2></div><button type="button" onClick={() => move(index, -1)} className="rounded border border-glass px-2 py-1 text-xs text-slate-muted">↑</button><button type="button" onClick={() => move(index, 1)} className="rounded border border-glass px-2 py-1 text-xs text-slate-muted">↓</button><button type="button" onClick={() => setBlocks((current) => current.map((item) => item.id === block.id ? { ...item, visible: !item.visible } : item))} className="rounded border border-glass px-2 py-1 text-xs text-slate-muted">{block.visible ? "Hide" : "Show"}</button><button type="button" onClick={() => setBlocks((current) => current.filter((item) => item.id !== block.id))} className="rounded border border-red-400/30 px-2 py-1 text-xs text-red-300">Remove</button></div>)}</section><aside className="space-y-6"><div className="glass-panel p-6"><h2 className="font-bold">Add section</h2><p className="mt-2 text-sm text-slate-muted">Only validated block types can be added.</p><div className="mt-5 grid gap-2">{(["hero", "rich-text", "services", "cta"] as const).map((type) => <button key={type} type="button" onClick={() => addBlock(type)} className="rounded-lg border border-glass px-4 py-3 text-left text-sm capitalize text-slate-muted hover:bg-white/10 hover:text-white">+ {type.replace("-", " ")}</button>)}</div></div><div className="glass-panel p-6"><h2 className="font-bold">Revision history</h2>{versions.length ? <div className="mt-4 space-y-3">{versions.map((version) => <div key={version.id} className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-muted">v{version.version} · {new Date(version.createdAt).toLocaleDateString()}</span><button type="button" onClick={() => restore(version.id)} className="text-cyan-ai">Restore</button></div>)}</div> : <p className="mt-3 text-sm text-slate-muted">Versions appear after the first database draft is saved.</p>}</div></aside></div></div>;
}
