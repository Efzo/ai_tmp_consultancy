"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { archiveBlogPost, deleteBlogPost, publishBlogPost, saveBlogPostDraft } from "@/app/actions/cms";
import BlogComposer from "@/components/admin/BlogComposer";
import { emptyBlogOptions, type BlogOptions } from "@/lib/blog-options";

type Post = { options: BlogOptions; featuredImage: string; id: string; slug: string; title: string; excerpt: string; content: string; category: string; status: string; versions: Array<{ id: string; version: number; createdAt: string }> };
type Filter = "ALL" | "PUBLISHED" | "DRAFT" | "ARCHIVED";
type DraftPost = Omit<Post, "id" | "status" | "versions">;

const emptyPost: DraftPost = { options: emptyBlogOptions, featuredImage: "", slug: "", title: "", excerpt: "", content: "", category: "AI Product Strategy" };

const statusLabels: Record<Filter, string> = { ALL: "All articles", PUBLISHED: "Published", DRAFT: "Drafts", ARCHIVED: "Archived" };

export default function BlogEditor({ posts }: { posts: Post[] }) {
  const [rows, setRows] = useState(posts);
  const [newPost, setNewPost] = useState(emptyPost);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [message, setMessage] = useState("");
  const [uploadBusy, setUploadBusy] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const counts = useMemo(() => ({
    ALL: rows.length,
    PUBLISHED: rows.filter((post) => post.status === "PUBLISHED").length,
    DRAFT: rows.filter((post) => post.status === "DRAFT").length,
    ARCHIVED: rows.filter((post) => post.status === "ARCHIVED").length,
  }), [rows]);

  const visibleRows = rows.filter((post) => filter === "ALL" || post.status === filter);

  function updatePost(id: string, field: keyof Post, value: string) {
    setRows((current) => current.map((post) => post.id === id ? { ...post, [field]: value } : post));
  }

  function updateNewPost(field: keyof DraftPost, value: string) {
    setNewPost((current) => ({ ...current, [field]: value }));
  }

  function patchOptions(id: string | null, patch: Partial<BlogOptions>) {
    if (id) setRows((current) => current.map((post) => post.id === id ? { ...post, options: { ...post.options, ...patch } } : post));
    else setNewPost((current) => ({ ...current, options: { ...current.options, ...patch } }));
  }

  async function save(post: Post) {
    setBusy(post.id);
    try {
      const result = await saveBlogPostDraft(post);
      setMessage(result.message);
      if (result.success) setRows((current) => current.map((item) => item.id === post.id ? { ...item, status: "DRAFT" } : item));
    } catch { setMessage("The draft could not be saved. Your edits are still here; please try again."); }
    finally { setBusy(null); }
  }

  async function publish(post: Post) {
    setBusy(`publish-${post.id}`);
    try {
      const saved = await saveBlogPostDraft(post);
      if (!saved.success) { setMessage(saved.message); return; }
      setRows((current) => current.map((item) => item.id === post.id ? { ...item, status: "DRAFT" } : item));
      const result = await publishBlogPost(post.id);
      setMessage(result.message);
      if (result.success) setRows((current) => current.map((item) => item.id === post.id ? { ...item, status: "PUBLISHED" } : item));
    } catch { setMessage("Publishing could not be completed. Your edits are still here; please try again."); }
    finally { setBusy(null); }
  }

  async function create(publishAfterSave = false) {
    setBusy(publishAfterSave ? "new-publish" : "new-save");
    try {
      const result = await saveBlogPostDraft(newPost);
      if (!result.success || !result.id) { setMessage(result.message); return; }
      const draft: Post = { ...newPost, id: result.id, status: "DRAFT", versions: [] };
      setRows((current) => [draft, ...current]);
      setNewPost(emptyPost);
      if (publishAfterSave) {
        const published = await publishBlogPost(draft.id);
        setMessage(published.message);
        if (published.success) setRows((current) => current.map((item) => item.id === draft.id ? { ...item, status: "PUBLISHED" } : item));
      } else setMessage("Draft saved. Publish it when you are ready for it to appear on the public blog.");
    } catch { setMessage("The operation could not be completed. Your article remains in the composer or article library; please try again."); }
    finally { setBusy(null); }
  }

  return <div className="space-y-6">
    <article className="glass-panel space-y-5 border-electric/30 p-6">
      <div><p className="text-xs uppercase tracking-widest text-electric">Create article</p><h2 className="mt-2 text-xl font-bold">Start a new draft</h2><p className="mt-2 text-sm text-slate-muted">Save keeps the article private. Use Save &amp; publish when it is ready to appear on the public blog.</p></div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm text-slate-muted">Title<input value={newPost.title} onChange={(event) => updateNewPost("title", event.target.value)} placeholder="Article title" className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label>
        <label className="block text-sm text-slate-muted">Slug<input value={newPost.slug} onChange={(event) => updateNewPost("slug", event.target.value)} placeholder="article-slug" className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label>
      </div>
      <label className="block text-sm text-slate-muted">Category<input value={newPost.category} onChange={(event) => updateNewPost("category", event.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label>
      <label className="block text-sm text-slate-muted">Excerpt<textarea value={newPost.excerpt} onChange={(event) => updateNewPost("excerpt", event.target.value)} rows={2} placeholder="A short summary for the article index and search engines." className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label>
      <BlogComposer title={newPost.title} slug={newPost.slug} excerpt={newPost.excerpt} content={newPost.content} options={newPost.options} cover={newPost.featuredImage} onContentChange={(value) => updateNewPost("content", value)} onOptionsChange={(patch) => patchOptions(null, patch)} onCoverChange={(value) => updateNewPost("featuredImage", value)} onUploadBusy={setUploadBusy} disabled={busy !== null || uploadBusy} />
      <div className="flex flex-wrap justify-end gap-3"><button type="button" onClick={() => create(false)} disabled={busy !== null || uploadBusy} className="btn-secondary disabled:opacity-60">{busy === "new-save" ? "Saving…" : "Save new draft"}</button><button type="button" onClick={() => create(true)} disabled={busy !== null || uploadBusy} className="btn-primary disabled:opacity-60">{busy === "new-publish" ? "Publishing…" : "Save & publish"}</button></div>
    </article>

    <section className="glass-panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-glass px-6 py-5"><div><h2 className="text-xl font-bold">Article library</h2><p className="mt-1 text-sm text-slate-muted">Published articles appear on the public blog. Drafts remain private until published. Saving a published article as a draft removes it from the public blog; use Save & publish to apply a public update.</p></div><div className="flex flex-wrap gap-2">{(Object.keys(statusLabels) as Filter[]).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-full border px-3 py-1.5 text-xs transition ${filter === item ? "border-electric bg-electric/20 text-white" : "border-glass text-slate-muted hover:text-white"}`}>{statusLabels[item]} ({counts[item]})</button>)}</div></div>
      <div className="space-y-6 p-6">
        {visibleRows.length === 0 && <p className="rounded-xl border border-glass bg-white/5 p-8 text-center text-sm text-slate-muted">No articles in this view.</p>}
        {visibleRows.map((post) => <article key={post.id} className="glass-panel space-y-5 p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-widest text-electric">{post.category}</p><h2 className="mt-2 text-xl font-bold">{post.title || "Untitled draft"}</h2><p className="mt-1 text-xs text-slate-muted">{post.versions.length} saved version{post.versions.length === 1 ? "" : "s"}</p></div><span className={`rounded-full border px-3 py-1 text-xs ${post.status === "PUBLISHED" ? "border-cyan-ai/40 bg-cyan-ai/10 text-cyan-ai" : "border-amber-300/30 bg-amber-300/10 text-amber-200"}`}>{post.status}</span></div>
          <div className="grid gap-5 md:grid-cols-2"><label className="block text-sm text-slate-muted">Title<input value={post.title} onChange={(event) => updatePost(post.id, "title", event.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><label className="block text-sm text-slate-muted">Slug<input value={post.slug} onChange={(event) => updatePost(post.id, "slug", event.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label></div>
          <label className="block text-sm text-slate-muted">Excerpt<textarea value={post.excerpt} onChange={(event) => updatePost(post.id, "excerpt", event.target.value)} rows={2} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label>
          <BlogComposer title={post.title} slug={post.slug} excerpt={post.excerpt} content={post.content} options={post.options} cover={post.featuredImage} onContentChange={(value) => updatePost(post.id, "content", value)} onOptionsChange={(patch) => patchOptions(post.id, patch)} onCoverChange={(value) => updatePost(post.id, "featuredImage", value)} onUploadBusy={setUploadBusy} disabled={busy !== null || uploadBusy} />
          <div className="flex flex-wrap justify-end gap-3"><button type="button" disabled={busy !== null || uploadBusy} className="btn-secondary" onClick={async () => { setBusy(post.id); try { const result = await archiveBlogPost(post.id); setMessage(result.message); if (result.success) setRows((rows) => rows.map((row) => row.id === post.id ? { ...row, status: "ARCHIVED" } : row)); } finally { setBusy(null); } }}>Unpublish / archive</button><button type="button" disabled={busy !== null || uploadBusy} className="btn-secondary" onClick={async () => { if (!confirm("Delete this article and its saved versions?")) return; setBusy(post.id); try { const result = await deleteBlogPost(post.id); setMessage(result.message); if (result.success) setRows((rows) => rows.filter((row) => row.id !== post.id)); } finally { setBusy(null); } }}>Delete</button>{post.status === "PUBLISHED" && <Link href={`/blog/${post.slug}`} target="_blank" className="btn-secondary">View public article</Link>}<button type="button" onClick={() => save(post)} disabled={busy !== null || uploadBusy} className="btn-secondary disabled:opacity-60">{busy === post.id ? "Saving…" : "Save draft"}</button>{<button type="button" onClick={() => publish(post)} disabled={busy !== null || uploadBusy} className="btn-primary disabled:opacity-60">{busy === `publish-${post.id}` ? "Publishing…" : "Save & publish"}</button>}</div>
        </article>)}
      </div>
    </section>
    {message && <p role="status" aria-live="polite" className="text-sm text-cyan-ai">{message}</p>}
  </div>;
}
