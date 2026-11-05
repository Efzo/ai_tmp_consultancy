import { blogPosts as fallbackPosts, type BlogPost } from "@/data/blog";
import { blogOptionsKey, readBlogOptions } from "@/lib/blog-options";
import { prisma } from "@/lib/prisma";

const dbReady = () => { const url = process.env.DATABASE_URL; return process.env.DEMO_MODE !== "true" && Boolean(url) && !url?.includes("demo_"); };

export async function getPublicBlogPosts(): Promise<BlogPost[]> {
  if (!dbReady()) return fallbackPosts;
  try {
    const posts = await prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } });

    const settings = await prisma.siteSetting.findMany({ where: { key: { in: posts.map((post) => blogOptionsKey(post.id)) } } }).catch(() => []);
    const optionsByKey = new Map(settings.map((setting) => [setting.key, readBlogOptions(setting.value)]));
    return posts.map((post) => {
      const options = optionsByKey.get(blogOptionsKey(post.id)) || readBlogOptions(undefined);
      return { featuredImage: post.featuredImage, options, slug: post.slug, title: post.title, excerpt: post.excerpt, category: post.category, tags: options.tags, content: post.content, publishedAt: (post.publishedAt ?? post.createdAt).toISOString().slice(0, 10), updatedAt: post.updatedAt.toISOString(), readTime: `${Math.max(1, Math.ceil(post.content.replace(/<[^>]*>/g, " ").split(/\s+/).length / 200))} min read` };
    });
  } catch {
    return fallbackPosts;
  }
}

export async function getPublicBlogPost(slug: string) {
  const posts = await getPublicBlogPosts();
  return posts.find((post) => post.slug === slug);
}
