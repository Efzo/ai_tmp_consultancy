import Image from "next/image";
import { blogMetadata, blogStructuredData } from "@/lib/blog-seo";
import { serializeJsonLd } from "@/lib/blog-options";
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
  return blogMetadata(post);
}

function renderContent(content: string) {
  if (/<(?:p|h[2-4]|figure|img|ul|ol|strong|em|blockquote|div)\b/i.test(content)) return <div className="blog-rich-text" dangerouslySetInnerHTML={{ __html: sanitizeRichText(content) }} />;
  return content.split("\n\n").map((block, index) => block.startsWith("## ") ? <h2 key={index} className="mt-10 text-2xl font-bold text-cyan-ai">{block.slice(3)}</h2> : block.split("\n").every((line) => line.startsWith("- ")) ? <ul key={index} className="my-6 list-disc space-y-2 pl-6 text-slate-muted">{block.split("\n").map((line) => <li key={line}>{line.slice(2)}</li>)}</ul> : <p key={index} className="mt-6 leading-8 text-slate-muted">{block}</p>);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = await getPublicBlogPost(slug); if (!post) notFound();
  return <main className="min-h-screen bg-midnight px-6 pb-24 pt-36 text-platinum"><article className="mx-auto max-w-3xl"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogStructuredData(post)) }} /><Link href="/blog" className="text-sm text-slate-muted hover:text-white">← Back to all articles</Link><header className="mt-10 border-b border-glass pb-10"><p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-electric">{post.category}</p><h1 className="text-4xl font-bold leading-tight md:text-6xl">{post.title}</h1><div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-muted"><span>By {post.options?.authorName || "Efosa Ojomo"}</span><time dateTime={post.publishedAt}>{post.publishedAt}</time>{post.updatedAt && post.updatedAt.slice(0, 10) !== post.publishedAt && <span>Updated <time dateTime={post.updatedAt}>{post.updatedAt.slice(0, 10)}</time></span>}<span>•</span><span>{post.readTime}</span></div></header>{post.featuredImage && <figure className="my-8"><Image src={post.featuredImage} alt={post.options?.images.find((image) => image.url === post.featuredImage)?.alt || post.title} width={1200} height={800} unoptimized className="h-auto w-full rounded-xl border border-glass" />{post.options?.images.find((image) => image.url === post.featuredImage)?.caption && <figcaption className="mt-3 text-sm text-slate-muted">{post.options.images.find((image) => image.url === post.featuredImage)?.caption}</figcaption>}</figure>}{post.options?.answerSummary && <section className="glass-panel my-8 p-6" aria-label="Article summary"><h2 className="text-xl font-bold">At a glance</h2><p className="mt-3 whitespace-pre-line leading-8 text-slate-muted">{post.options.answerSummary}</p></section>}<div className="pt-4 [&_img]:my-6 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-xl [&_figcaption]:text-sm [&_figcaption]:text-slate-muted">{renderContent(post.content)}</div>{Boolean(post.options?.faqs.length) && <section className="mt-12 space-y-6"><h2 className="text-2xl font-bold">Questions &amp; answers</h2>{post.options?.faqs.map((faq) => <div key={faq.question}><h3 className="text-lg font-semibold">{faq.question}</h3><p className="mt-2 whitespace-pre-line leading-8 text-slate-muted">{faq.answer}</p></div>)}</section>}<div className="mt-12 flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="rounded-full border border-glass px-3 py-1 text-xs text-slate-muted">{tag}</span>)}</div><div className="glass-panel mt-16 p-8 text-center"><h2 className="text-2xl font-bold">Need help planning or building your product?</h2><p className="mt-3 text-slate-muted">Book a discovery conversation to discuss your product, technical, or roadmap challenge.</p><Link href="/book" className="btn-primary mt-6 inline-block">Book a Discovery Call</Link></div></article></main>;
}
