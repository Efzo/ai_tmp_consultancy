"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogPost } from "@/data/blog";

export default function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(posts.map((post) => post.category)))];

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const searchable = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [category, posts, query]);

  return (
    <>
      <div className="mb-10 grid gap-4 md:grid-cols-[1fr_auto]">
        <label className="sr-only" htmlFor="article-search">Search articles</label>
        <input
          id="article-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search articles..."
          className="w-full rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none transition focus:border-electric"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full border px-4 py-2 text-sm transition ${category === item ? "border-electric bg-electric/20 text-white" : "border-glass text-slate-muted hover:text-white"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article key={post.slug} className="glass-card flex h-full flex-col p-7">
              <div className="mb-5 flex items-center justify-between gap-3 text-xs uppercase tracking-widest">
                <span className="text-electric">{post.category}</span>
                <span className="text-slate-muted">{post.readTime}</span>
              </div>
              <h2 className="mb-4 text-2xl font-bold leading-tight">{post.title}</h2>
              <p className="mb-7 flex-grow leading-relaxed text-slate-muted">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-cyan-ai hover:text-white">
                Read article →
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-10 text-center text-slate-muted">No articles match your search.</div>
      )}
    </>
  );
}
