import type { MetadataRoute } from "next";
import { getPublicBlogPosts } from "@/lib/content";
import { getCaseStudies } from "@/lib/case-studies";
import { getManagedServices } from "@/lib/services";

const baseUrl = "https://www.ojomoefosa.com";

function entry(path: string, modified?: Date | string): MetadataRoute.Sitemap[number] {
  const date = modified ? new Date(modified) : undefined;
  // Omit unknown timestamps, including the epoch used by fallback case studies.
  return { url: `${baseUrl}${path}`, ...(date && Number.isFinite(date.getTime()) && date.getTime() > 0 ? { lastModified: date } : {}) };
}

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, caseStudies, services] = await Promise.all([getPublicBlogPosts(), getCaseStudies(), getManagedServices()]);
  const staticRoutes = ["", "/for-businesses", "/for-founders", "/services", "/about", "/case-studies", "/process", "/engagements", "/book", "/contact", "/blog", "/videos", "/privacy", "/terms"];
  const entries = [
    ...staticRoutes.map((route) => entry(route)),
    ...services.map((service) => entry(`/services/${service.slug}`, service.updatedAt)),
    ...caseStudies.map((study) => entry(`/case-studies/${study.slug}`, study.updatedAt)),
    ...blogPosts.map((post) => entry(`/blog/${post.slug}`, post.updatedAt ?? post.publishedAt)),
  ];
  return [...new Map(entries.map((item) => [item.url, item])).values()];
}
