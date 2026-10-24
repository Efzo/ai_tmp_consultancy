import Link from "next/link";
import { AdminModule } from "@/components/admin/AdminModule";
import BlogEditor from "@/components/admin/BlogEditor";
import { blogPosts as staticPosts } from "@/data/blog";
import { prisma } from "@/lib/prisma";

async function getPosts() {
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return [];
  try { return await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" }, include: { versions: { orderBy: { version: "desc" }, take: 5 } } }); } catch { return []; }
}

export default async function BlogAdminPage() {
  const posts = await getPosts();
  const databaseUrl = process.env.DATABASE_URL;
  const databaseConnected = process.env.DEMO_MODE !== "true" && Boolean(databaseUrl) && !databaseUrl?.includes("demo_");
  return <AdminModule title="Blog & articles" description="Draft, revise, and publish technical product insights." status={databaseConnected ? "Database connected" : "Read-only seed catalog"}>{databaseConnected ? <BlogEditor posts={posts.map((post) => ({ id: post.id, slug: post.slug, title: post.title, excerpt: post.excerpt, content: post.content, category: post.category, status: post.status, versions: post.versions.map((version) => ({ id: version.id, version: version.version, createdAt: version.createdAt.toISOString() })) }))} /> : <div className="space-y-4"><div className="glass-panel border-amber-300/20 bg-amber-300/5 p-5 text-sm text-amber-200">Connect PostgreSQL and disable demo mode to create and publish articles.</div>{staticPosts.map((post) => <article key={post.slug} className="glass-card flex flex-wrap items-center justify-between gap-4 p-6"><div><p className="text-xs uppercase tracking-widest text-electric">{post.category}</p><h2 className="mt-2 text-xl font-bold">{post.title}</h2><p className="mt-2 text-sm text-slate-muted">{post.publishedAt} · {post.readTime}</p></div><Link href={`/blog/${post.slug}`} className="text-sm text-cyan-ai hover:text-white">Preview article →</Link></article>)}</div>}</AdminModule>;
}
