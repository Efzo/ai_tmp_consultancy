import { getManagedPageContent, managedPageMetadata } from "@/lib/managed-pages";
import PagePreviewBanner from "@/components/admin/PagePreviewBanner";
import BlogIndex from "@/components/BlogIndex";
import { getPublicBlogPosts } from "@/lib/content";


export const revalidate = 60;

export default async function BlogPage() {
  const content = await getManagedPageContent("blog");
  const blogPosts = await getPublicBlogPosts();
  return (
    <main className="min-h-screen bg-midnight px-6 pb-24 pt-36 text-platinum"><PagePreviewBanner slug="blog" />
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-electric">{content.eyebrow}</p>
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">{content.title}</h1>
          <p className="text-xl leading-relaxed text-slate-muted">{content.description}</p>
        </header>
        <BlogIndex posts={blogPosts} />
      </div>
    </main>
  );
}

export async function generateMetadata() { return managedPageMetadata("blog"); }
