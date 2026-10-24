import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { caseStudies } from "@/data/case-studies";
import { services } from "@/data/services";
import { landingPages } from "@/data/landing-pages";

const baseUrl = "https://ojomoefosa.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/services", "/about", "/case-studies", "/process", "/pricing", "/book", "/contact", "/blog", "/privacy", "/terms"];
  return [
    ...staticRoutes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date() })),
    ...services.map((service) => ({ url: `${baseUrl}/services/${service.slug}`, lastModified: new Date() })),
    ...caseStudies.map((study) => ({ url: `${baseUrl}/case-studies/${study.slug}`, lastModified: new Date() })),
    ...blogPosts.map((post) => ({ url: `${baseUrl}/blog/${post.slug}`, lastModified: new Date(post.publishedAt) })),
    ...Object.keys(landingPages).map((slug) => ({ url: `${baseUrl}/consulting/${slug}`, lastModified: new Date() })),
  ];
}
