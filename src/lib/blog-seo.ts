import type { Metadata } from "next";
import type { BlogPost } from "@/data/blog";
import { blogDescription } from "@/lib/blog-options";

const site = "https://www.ojomoefosa.com";
export function blogMetadata(post: BlogPost): Metadata {
  const title = post.options?.seoTitle || post.title;
  const description = blogDescription(post.excerpt, post.options);
  const url = `${site}/blog/${post.slug}`;
  const images = post.featuredImage ? [{ url: `${site}${post.featuredImage}`, alt: post.options?.images.find((image) => image.url === post.featuredImage)?.alt || post.title }] : [{ url: `${site}/logo_pack/logo.png`, alt: "Efosa Ojomo Technology Services" }];
  return {
    title: `${title} | Efosa Ojomo`, description, robots: { index: true, follow: true, "max-image-preview": "large" }, alternates: { canonical: url },
    authors: [{ name: post.options?.authorName || "Efosa Ojomo" }],
    openGraph: { title, description, url, type: "article", publishedTime: post.publishedAt, modifiedTime: post.updatedAt || post.publishedAt, authors: [post.options?.authorName || "Efosa Ojomo"], tags: post.tags, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
export function blogStructuredData(post: BlogPost) {
  const url = `${site}/blog/${post.slug}`;
  const images = [...new Set([...(post.featuredImage ? [post.featuredImage] : []), ...(post.options?.images.filter((image) => post.content.includes(`<img src="${image.url}"`)).map((image) => image.url) || [])])];
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "BlogPosting", "@id": `${url}#article`, headline: post.title, description: blogDescription(post.excerpt, post.options), mainEntityOfPage: url, url,
      datePublished: post.publishedAt, dateModified: post.updatedAt || post.publishedAt,
      author: { "@type": "Person", name: post.options?.authorName || "Efosa Ojomo" },
      publisher: { "@type": "Organization", name: "Efosa Ojomo Technology Services", url: site, logo: { "@type": "ImageObject", url: `${site}/logo_pack/logo.png` } },
      ...(images.length ? { image: images.map((image) => `${site}${image}`) } : {}), keywords: post.tags.join(", "), articleSection: post.category,
      ...(post.options?.answerSummary ? { abstract: post.options.answerSummary } : {}),
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site },
      { "@type": "ListItem", position: 2, name: "Insights", item: `${site}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ] },
  ] };
}
