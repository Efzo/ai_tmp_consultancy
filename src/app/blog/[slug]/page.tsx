import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts as fallbackPosts } from "@/data/blog";
import { getPublicBlogPost } from "@/lib/content";
import { sanitizeRichText } from "@/lib/rich-text";

export const dynamicParams = true;
export const revalidate = 60;
export function generateStaticParams() { return fallbackPosts.map((post) => ({ slug: post.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const post = await getPublicBlogPost(slug); if (!post) return {};
  return { title: `${post.title} | Efosa Ojomo`, description: post.excerpt, alternates: { canonical: `/blog/${post.slug}` }, openGraph: { title: post.title, description: post.excerpt, type: "article" } };
}

function renderContent(content: string) {
  if (/<(?:p|h[2-4]|ul|ol|strong|em|blockquote|div)\b/i.test(content)) return <div className="blog-rich-text" dangerouslySetInnerHTML={{ __html: sanitizeRichText(content) }} />;
  return content.split("\n\n").map((block, index) => block.startsWith("## ") ? <h2 key={index} className="mt-10 text-2xl font-bold text-cyan-ai">{block.slice(3)}</h2> : block.split("\n").every((line) => line.startsWith("- ")) ? <ul key={index} className="my-6 list-disc space-y-2 pl-6 text-slate-muted">{block.split("\n").map((line) => <li key={line}>{line.slice(2)}</li>)}</ul> : <p key={index} className="mt-6 leading-8 text-slate-muted">{block}</p>);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = await getPublicBlogPost(slug); if (!post) notFound();
  return <main className="min-h-screen bg-midnight px-6 pb-24 pt-36 text-platinum"><article className="mx-auto max-w-3xl"><Link href="/blog" className="text-sm text-slate-muted hover:text-white">← Back to all articles</Link><header className="mt-10 border-b border-glass pb-10"><p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-electric">{post.category}</p><h1 className="text-4xl font-bold leading-tight md:text-6xl">{post.title}</h1><div className="mt-6 flex gap-4 text-sm text-slate-muted"><span>{post.publishedAt}</span><span>•</span><span>{post.readTime}</span></div></header><div className="pt-4">{renderContent(post.content)}</div><div className="mt-12 flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="rounded-full border border-glass px-3 py-1 text-xs text-slate-muted">{tag}</span>)}</div><div className="glass-panel mt-16 p-8 text-center"><h2 className="text-2xl font-bold">Need help turning an AI idea into a plan?</h2><p className="mt-3 text-slate-muted">Book a discovery conversation to discuss your product, technical, or roadmap challenge.</p><Link href="/book" className="btn-primary mt-6 inline-block">Book a Discovery Call</Link></div></article></main>;
}
