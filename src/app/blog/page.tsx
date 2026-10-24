import type { Metadata } from "next";
import BlogIndex from "@/components/BlogIndex";
import { getPublicBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Technology & Product Strategy Insights | Efosa Ojomo",
  description: "Practical writing on technical product management, AI strategy, software architecture, digital transformation, and delivery.",
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
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">Practical thinking for product and technology teams.</h1>
          <p className="text-xl leading-relaxed text-slate-muted">Ideas on technical product management, AI strategy, software architecture, digital transformation, and delivering products that create measurable value.</p>
        </header>
        <BlogIndex posts={blogPosts} />
      </div>
    </main>
  );
}
