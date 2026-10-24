import type { Metadata } from "next";
import BlogIndex from "@/components/BlogIndex";
import { getPublicBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "AI Product Management & Technical Strategy Blog | Efosa Ojomo",
  description: "Practical writing on AI product strategy, technical product management, enterprise SaaS, RAG, and platform delivery.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 60;

export default async function BlogPage() {
  const blogPosts = await getPublicBlogPosts();
  return (
    <main className="min-h-screen bg-midnight px-6 pb-24 pt-36 text-platinum">
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-electric">Insights</p>
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">Practical thinking for AI product teams.</h1>
          <p className="text-xl leading-relaxed text-slate-muted">Ideas on AI product management, technical strategy, enterprise search, RAG, and delivering products that create measurable value.</p>
        </header>
        <BlogIndex posts={blogPosts} />
      </div>
    </main>
  );
}
