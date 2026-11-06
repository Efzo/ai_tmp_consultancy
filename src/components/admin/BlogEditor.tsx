"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, Plus, ArrowLeft } from "lucide-react";
import { archiveBlogPost, deleteBlogPost, publishBlogPost, saveBlogPostDraft } from "@/app/actions/cms";
import BlogComposer from "@/components/admin/BlogComposer";
import { emptyBlogOptions, type BlogOptions } from "@/lib/blog-options";

type Post = { options: BlogOptions; featuredImage: string; id: string; slug: string; title: string; excerpt: string; content: string; category: string; status: string; updatedAt?: string; publishedAt?: string | null; versions: Array<{ id: string; version: number; createdAt: string }> };
type Filter = "ALL" | "PUBLISHED" | "DRAFT" | "ARCHIVED";
type DraftPost = Pick<Post, "options" | "featuredImage" | "slug" | "title" | "excerpt" | "content" | "category">;
const pageSize = 20;
const statusLabels: Record<Filter, string> = { ALL: "All posts", PUBLISHED: "Published", DRAFT: "Drafts", ARCHIVED: "Archived" };
const inputClass = "mt-2 block w-full rounded-lg border border-glass bg-midnight px-3 py-2.5 text-white outline-none focus:border-electric";
function emptyPost(): DraftPost { return { options: structuredClone(emptyBlogOptions), featuredImage: "", slug: "", title: "", excerpt: "", content: "", category: "Technology Services" }; }
function draftFrom(post: Post): DraftPost { return structuredClone({ title: post.title, slug: post.slug, excerpt: post.excerpt, category: post.category, content: post.content, featuredImage: post.featuredImage, options: post.options }); }
function changedAt(post: Post) { return post.updatedAt || post.versions[0]?.createdAt || post.publishedAt || ""; }
function dateLabel(value: string) { return value && Number.isFinite(Date.parse(value)) ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value)) : "—"; }
function StatusBadge({ status }: { status: string }) {
  const color = status === "PUBLISHED" ? "border-cyan-ai/40 bg-cyan-ai/10 text-cyan-ai" : status === "DRAFT" ? "border-amber-300/30 bg-amber-300/10 text-amber-200" : "border-glass bg-white/5 text-slate-muted";
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${color}`}>{status === "PUBLISHED" ? "Published" : status === "DRAFT" ? "Draft" : "Archived"}</span>;
}

export default function BlogEditor({ posts }: { posts: Post[] }) {
  const [rows, setRows] = useState(posts);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftPost>(emptyPost);
  const [baseline, setBaseline] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("updated");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [uploadBusy, setUploadBusy] = useState(false);
  const [busy, setBusy] = useState<"save" | "publish" | "archive" | "delete" | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const editorOpen = activeId !== null;
  const dirty = editorOpen && JSON.stringify(draft) !== baseline;
  const blocked = busy !== null || uploadBusy;
  const selected = rows.find((post) => post.id === activeId);
  const counts = useMemo(() => ({ ALL: rows.length, PUBLISHED: rows.filter((post) => post.status === "PUBLISHED").length, DRAFT: rows.filter((post) => post.status === "DRAFT").length, ARCHIVED: rows.filter((post) => post.status === "ARCHIVED").length }), [rows]);
  const categories = useMemo(() => [...new Set(rows.map((post) => post.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [rows]);
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return rows.filter((post) => (filter === "ALL" || post.status === filter) && (!category || post.category === category) && (!search || `${post.title} ${post.slug} ${post.excerpt} ${post.category}`.toLowerCase().includes(search))).sort((a, b) => sort === "title" ? a.title.localeCompare(b.title) : (Date.parse(changedAt(b)) || 0) - (Date.parse(changedAt(a)) || 0));
  }, [rows, filter, category, query, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: "start" }); }, [editorOpen]);
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  function open(post?: Post) {
    const values = post ? draftFrom(post) : emptyPost();
    setDraft(values); setBaseline(JSON.stringify(values)); setActiveId(post?.id ?? "new"); setMessage("");
  }
  function back() {
    if (blocked || (dirty && !window.confirm("Return to posts and discard your unsaved changes?"))) return;
    setActiveId(null);
  }
  function patch(values: Partial<DraftPost>) { setDraft((current) => ({ ...current, ...values })); }
  function resetFilters() { setFilter("ALL"); setCategory(""); setQuery(""); setPage(1); }
  function upsert(post: Post) { setRows((current) => current.some((item) => item.id === post.id) ? current.map((item) => item.id === post.id ? post : item) : [post, ...current]); }

  async function persist(publish: boolean) {
    if (activeId === null) return;
    setBusy(publish ? "publish" : "save"); setMessage("");
    let savedDraft = false;
    try {
      const result = await saveBlogPostDraft({ ...draft, ...(activeId !== "new" ? { id: activeId } : {}) });
      if (!result.success || !result.id) { setMessage(result.message); return; }
      const post: Post = { ...selected, ...draft, id: result.id, status: "DRAFT", versions: selected?.versions || [], updatedAt: new Date().toISOString() };
      upsert(post); setActiveId(post.id); setBaseline(JSON.stringify(draft)); savedDraft = true;
      setFilter("DRAFT"); setCategory(""); setQuery(""); setPage(1);
      if (publish) {
        const publication = await publishBlogPost(post.id);
        setMessage(publication.message);
        if (publication.success) { upsert({ ...post, status: "PUBLISHED", publishedAt: post.publishedAt || new Date().toISOString() }); setFilter("PUBLISHED"); }
      } else setMessage("Draft saved. You can keep writing or return to your posts.");
    } catch { setMessage(savedDraft ? "Your draft was saved, but publishing could not be completed. You can retry from this editor." : "The post could not be saved. Your edits are still in the editor; please try again."); }
    finally { setBusy(null); }
  }
  async function archive() {
    if (!selected || (dirty && !window.confirm("Archive the saved post and discard your unsaved changes?"))) return;
    setBusy("archive");
    try {
      const result = await archiveBlogPost(selected.id); setMessage(result.message);
      if (result.success) { upsert({ ...selected, status: "ARCHIVED", updatedAt: new Date().toISOString() }); setActiveId(null); setFilter("ARCHIVED"); setQuery(""); setCategory(""); setPage(1); }
    } catch { setMessage("The post could not be archived. Please try again."); }
    finally { setBusy(null); }
  }
  async function remove() {
    if (!selected || !window.confirm(`Permanently delete “${selected.title || "Untitled post"}” and all its saved versions?`)) return;
    setBusy("delete");
    try {
      const result = await deleteBlogPost(selected.id); setMessage(result.message);
      if (result.success) { setRows((current) => current.filter((post) => post.id !== selected.id)); setActiveId(null); resetFilters(); }
    } catch { setMessage("The post could not be deleted. Please try again."); }
    finally { setBusy(null); }
  }

  return <div className="space-y-6">
    {message && <p role="status" aria-live="polite" className="rounded-xl border border-glass bg-white/5 px-5 py-4 text-sm text-cyan-ai">{message}</p>}
    {editorOpen ? <article className="glass-panel space-y-6 p-5 md:p-7" aria-labelledby="blog-editor-heading">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-glass pb-5"><div><button type="button" disabled={blocked} onClick={back} className="mb-4 inline-flex items-center gap-2 text-sm text-slate-muted hover:text-white disabled:opacity-50"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to posts</button><h2 id="blog-editor-heading" ref={heading} tabIndex={-1} className="text-2xl font-semibold outline-none">{activeId === "new" ? "Create new post" : "Edit post"}</h2><p className="mt-2 text-sm text-slate-muted">{dirty ? "You have unsaved changes." : activeId === "new" ? "Start writing, then save a draft or publish when ready." : "Your last changes are saved."}</p></div><div className="flex items-center gap-3">{selected && <StatusBadge status={selected.status} />}{selected?.status === "PUBLISHED" && <Link href={`/blog/${selected.slug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">View live post</Link>}</div></header>
      <fieldset disabled={blocked} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2"><label className="block text-sm text-slate-muted">Title<input value={draft.title} onChange={(event) => patch({ title: event.target.value })} placeholder="Article title" className={inputClass} /></label><label className="block text-sm text-slate-muted">Slug<input value={draft.slug} onChange={(event) => patch({ slug: event.target.value })} placeholder="article-slug" className={inputClass} /></label></div>
        <label className="block text-sm text-slate-muted">Category<input value={draft.category} list="blog-category-suggestions" onChange={(event) => patch({ category: event.target.value })} className={inputClass} /><datalist id="blog-category-suggestions">{categories.map((item) => <option value={item} key={item} />)}</datalist></label>
        <label className="block text-sm text-slate-muted">Excerpt<textarea value={draft.excerpt} onChange={(event) => patch({ excerpt: event.target.value })} rows={3} placeholder="A short summary for the article index and search engines." className={inputClass} /></label>
        <BlogComposer title={draft.title} slug={draft.slug} excerpt={draft.excerpt} content={draft.content} options={draft.options} cover={draft.featuredImage} onContentChange={(content) => patch({ content })} onOptionsChange={(options) => setDraft((current) => ({ ...current, options: { ...current.options, ...options } }))} onCoverChange={(featuredImage) => patch({ featuredImage })} onUploadBusy={setUploadBusy} disabled={blocked} />
      </fieldset>
      <footer className="space-y-4 border-t border-glass pt-5">
        {selected?.status === "PUBLISHED" && <p className="text-sm text-slate-muted">Use Save &amp; publish to update the live post. Saving it as a draft removes it from the public blog.</p>}
        <div className="flex flex-wrap justify-end gap-3"><button type="button" disabled={blocked} onClick={() => persist(false)} className="btn-secondary disabled:opacity-60">{busy === "save" ? "Saving…" : selected?.status === "PUBLISHED" ? "Unpublish & save draft" : "Save draft"}</button><button type="button" disabled={blocked} onClick={() => persist(true)} className="btn-primary disabled:opacity-60">{busy === "publish" ? "Publishing…" : "Save & publish"}</button></div>
        {selected && <details className="rounded-xl border border-glass p-4"><summary className="cursor-pointer text-sm text-slate-muted">Manage post</summary><div className="mt-4 flex flex-wrap gap-3">{selected.status !== "ARCHIVED" && <button type="button" disabled={blocked} onClick={archive} className="btn-secondary">{busy === "archive" ? "Archiving…" : selected.status === "PUBLISHED" ? "Unpublish & archive" : "Archive post"}</button>}<button type="button" disabled={blocked} onClick={remove} className="rounded-full border border-red-400/30 px-5 py-2 text-sm text-red-300 disabled:opacity-60">{busy === "delete" ? "Deleting…" : "Delete post"}</button></div></details>}
      </footer>
    </article> : <>
      <header className="flex flex-wrap items-center justify-between gap-4"><div><h2 ref={heading} tabIndex={-1} className="text-xl font-semibold outline-none">Your posts</h2><p className="mt-2 text-sm text-slate-muted">Find a published article, continue a draft, or start something new.</p></div><button type="button" onClick={() => open()} className="btn-primary inline-flex items-center gap-2"><Plus className="h-4 w-4" aria-hidden="true" />New Post</button></header>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Post status filters">{(Object.keys(statusLabels) as Filter[]).map((item) => <button type="button" key={item} aria-pressed={filter === item} onClick={() => { setFilter(item); setPage(1); }} className={`rounded-xl border p-4 text-left transition ${filter === item ? "border-electric bg-electric/10" : "border-glass bg-white/[.02] hover:bg-white/5"}`}><span className="block text-sm text-slate-muted">{statusLabels[item]}</span><span className="mt-2 block text-2xl font-semibold">{counts[item]}</span></button>)}</div>
      <section className="glass-panel overflow-hidden" aria-label="Post library">
        <div className="grid gap-4 border-b border-glass p-5 lg:grid-cols-[minmax(0,1fr)_auto_auto]"><label className="block text-sm text-slate-muted">Search posts<input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search title, category, or summary…" className={inputClass} /></label><label className="block text-sm text-slate-muted">Category<select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className={inputClass}><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label className="block text-sm text-slate-muted">Sort by<select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className={inputClass}><option value="updated">Recently updated</option><option value="title">Title A–Z</option></select></label></div>
        {filtered.length ? <><div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Blog posts with category, publication status, last update, and editing actions</caption><thead className="border-b border-glass bg-white/[.02] text-xs uppercase tracking-wide text-slate-muted"><tr><th scope="col" className="px-5 py-4 font-medium">Post</th><th scope="col" className="hidden px-4 py-4 font-medium md:table-cell">Category</th><th scope="col" className="px-4 py-4 font-medium">Status</th><th scope="col" className="hidden px-4 py-4 font-medium xl:table-cell">Updated</th><th scope="col" className="px-5 py-4 text-right font-medium">Actions</th></tr></thead><tbody className="divide-y divide-glass">{visible.map((post) => <tr key={post.id} className="hover:bg-white/[.02]"><td className="px-5 py-5"><div className="flex min-w-0 items-start gap-4">{post.featuredImage ? <Image src={post.featuredImage.replace("/api/media/", "/api/admin/media/")} alt="" width={80} height={56} unoptimized className="hidden h-14 w-20 shrink-0 rounded-lg object-cover lg:block" /> : <div aria-hidden="true" className="hidden h-14 w-20 shrink-0 items-center justify-center rounded-lg border border-glass bg-white/5 text-slate-muted lg:flex"><FileText className="h-5 w-5" /></div>}<div className="min-w-0"><button type="button" onClick={() => open(post)} className="text-left font-semibold text-platinum hover:text-electric">{post.title || "Untitled post"}</button><p className="mt-1 line-clamp-2 max-w-xl text-xs leading-relaxed text-slate-muted">{post.excerpt}</p><p className="mt-2 text-xs text-slate-muted md:hidden">{post.category || "Uncategorized"}</p></div></div></td><td className="hidden px-4 py-5 text-slate-muted md:table-cell">{post.category || "Uncategorized"}</td><td className="px-4 py-5"><StatusBadge status={post.status} /></td><td className="hidden whitespace-nowrap px-4 py-5 text-xs text-slate-muted xl:table-cell">{changedAt(post) ? <time dateTime={changedAt(post)}>{dateLabel(changedAt(post))}</time> : "—"}</td><td className="px-5 py-5"><div className="flex flex-wrap justify-end gap-2"><button type="button" onClick={() => open(post)} aria-label={`Edit ${post.title || "untitled post"}`} className="btn-secondary text-xs">Edit</button>{post.status === "PUBLISHED" && <Link href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${post.title}`} className="rounded-full border border-glass px-4 py-2 text-xs text-slate-muted hover:text-white">View</Link>}</div></td></tr>)}</tbody></table></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-glass px-5 py-4 text-xs text-slate-muted"><p>Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} posts</p>{pages > 1 && <nav aria-label="Post library pages" className="flex items-center gap-3"><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="btn-secondary text-xs disabled:opacity-40">Previous</button><span>Page {currentPage} of {pages}</span><button type="button" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)} className="btn-secondary text-xs disabled:opacity-40">Next</button></nav>}</div></> : <div className="space-y-4 px-6 py-14 text-center"><FileText aria-hidden="true" className="mx-auto h-8 w-8 text-slate-muted" /><h3 className="text-lg font-semibold">{rows.length ? "No posts match these filters" : "No posts yet"}</h3><p className="text-sm text-slate-muted">{rows.length ? "Try another status or category, or change your search." : "Create your first post, save it as a draft, and publish when ready."}</p>{rows.length ? <button type="button" onClick={resetFilters} className="btn-secondary">Clear filters</button> : <button type="button" onClick={() => open()} className="btn-primary">Create your first post</button>}</div>}
      </section>
    </>}
  </div>;
}
