import { blogPosts as fallbackPosts, type BlogPost } from "@/data/blog";
import { prisma } from "@/lib/prisma";

const dbReady = () => { const url = process.env.DATABASE_URL; return process.env.DEMO_MODE !== "true" && Boolean(url) && !url?.includes("demo_"); };

export async function getPublicBlogPosts(): Promise<BlogPost[]> {
  if (!dbReady()) return fallbackPosts;
  try {
    const posts = await prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } });
    if (!posts.length) return fallbackPosts;
    return posts.map((post) => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, category: post.category, tags: [], content: post.content, publishedAt: (post.publishedAt ?? post.createdAt).toISOString().slice(0, 10), readTime: `${Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))} min read` }));
  } catch {
    return fallbackPosts;
  }
}

export async function getPublicBlogPost(slug: string) {
  const posts = await getPublicBlogPosts();
  return posts.find((post) => post.slug === slug);
}
