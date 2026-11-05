import type { NextConfig } from "next";
import { serviceAliases } from "./src/data/services";
import { landingPages } from "./src/data/landing-pages";

const nextConfig: NextConfig = {
  async headers() {
    const noIndex = { key: "X-Robots-Tag", value: "noindex, nofollow, nosnippet, noimageindex" };
    const privateHeaders = [
      noIndex,
      { key: "Cache-Control", value: "private, no-store" },
      { key: "Referrer-Policy", value: "no-referrer" },
    ];
    return [
      { source: "/admin/:path*", headers: privateHeaders },
      { source: "/api/:path*", headers: [noIndex] },
      { source: "/api/admin/:path*", headers: privateHeaders },
      { source: "/api/auth/:path*", headers: privateHeaders },
      { source: "/cv/:path*", headers: [noIndex] },
      // Draft previews are private, including when their URL is a public route.
      { source: "/:path*", has: [{ type: "cookie", key: "__prerender_bypass" }], headers: privateHeaders },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '7gjsnzkqgom6ibad.private.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.private.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      ...Object.entries(serviceAliases).map(([slug, current]) => ({ source: `/services/${slug}`, destination: `/services/${current}`, permanent: true })),
      ...Object.entries(landingPages).map(([slug, page]) => ({ source: `/consulting/${slug}`, destination: `/services/${serviceAliases[page.service] ?? page.service}`, permanent: true })),
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/blog.html", destination: "/blog", permanent: true },
      { source: "/thank-you.html", destination: "/contact?submitted=1", permanent: true },
    ];
  },
};

export default nextConfig;
