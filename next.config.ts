import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/blog.html", destination: "/blog", permanent: true },
      { source: "/thank-you.html", destination: "/contact?submitted=1", permanent: true },
    ];
  },
};

export default nextConfig;
