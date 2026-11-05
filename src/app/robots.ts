import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // Crawlers must be able to see noindex headers and retired-document 410s.
    // Authentication, rather than robots.txt, protects private information.
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://www.ojomoefosa.com/sitemap.xml",
  };
}
