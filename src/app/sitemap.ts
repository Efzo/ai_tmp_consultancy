import type { MetadataRoute } from "next";
import { landingPages } from "@/data/landing-pages";
import { getPublicBlogPosts } from "@/lib/content";
import { getCaseStudies } from "@/lib/site-settings";
import { getManagedServices } from "@/lib/services";

const baseUrl = "https://ojomoefosa.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, caseStudies, services] = await Promise.all([getPublicBlogPosts(), getCaseStudies(), getManagedServices()]);
  const staticRoutes = ["", "/services", "/about", "/case-studies", "/process", "/pricing", "/book", "/contact", "/blog", "/privacy", "/terms"];
  return [
    ...staticRoutes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date() })),
    ...services.map((service) => ({ url: `${baseUrl}/services/${service.slug}`, lastModified: new Date() })),
    ...caseStudies.map((study) => ({ url: `${baseUrl}/case-studies/${study.slug}`, lastModified: new Date() })),
    ...blogPosts.map((post) => ({ url: `${baseUrl}/blog/${post.slug}`, lastModified: new Date(post.publishedAt) })),
    ...Object.keys(landingPages).map((slug) => ({ url: `${baseUrl}/consulting/${slug}`, lastModified: new Date() })),
  ];
}
