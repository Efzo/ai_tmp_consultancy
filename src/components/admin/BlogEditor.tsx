"use client";

import { useState } from "react";
import { publishBlogPost, saveBlogPostDraft } from "@/app/actions/cms";

type Post = { id: string; slug: string; title: string; excerpt: string; content: string; category: string; status: string; versions: Array<{ id: string; version: number; createdAt: string }> };

export default function BlogEditor({ posts }: { posts: Post[] }) {
  const [rows, setRows] = useState(posts);
  const [message, setMessage] = useState("");
  const update = (id: string, field: keyof Post, value: string) => setRows((current) => current.map((post) => post.id === id ? { ...post, [field]: value } : post));
  const save = async (post: Post) => { const result = await saveBlogPostDraft(post); setMessage(result.message); };
  const publish = async (id: string) => { const result = await publishBlogPost(id); setMessage(result.message); if (result.success) setRows((current) => current.map((post) => post.id === id ? { ...post, status: "PUBLISHED" } : post)); };
  return <div className="space-y-6">{rows.map((post) => <article key={post.id} className="glass-panel space-y-5 p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-widest text-electric">{post.category}</p><h2 className="mt-2 text-xl font-bold">{post.title}</h2></div><span className="text-xs text-slate-muted">{post.status}</span></div><label className="block text-sm text-slate-muted">Title<input value={post.title} onChange={(event) => update(post.id, "title", event.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><label className="block text-sm text-slate-muted">Excerpt<textarea value={post.excerpt} onChange={(event) => update(post.id, "excerpt", event.target.value)} rows={2} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" /></label><label className="block text-sm text-slate-muted">Content<textarea value={post.content} onChange={(event) => update(post.id, "content", event.target.value)} rows={8} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 font-mono text-sm text-white outline-none focus:border-electric" /></label><div className="flex flex-wrap justify-end gap-3"><button type="button" onClick={() => publish(post.id)} className="rounded-full border border-cyan-ai/40 bg-cyan-ai/10 px-5 py-2 text-cyan-ai">Publish</button><button type="button" onClick={() => save(post)} className="btn-primary">Save draft</button></div></article>)}{message && <p className="text-sm text-cyan-ai">{message}</p>}</div>;
}
