import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Efosa Ojomo Technology Services",
    short_name: "Efosa Ojomo",
    description: "Websites, custom software, product management, customer support systems, and business automation.",
    start_url: "/",
    display: "standalone",
    background_color: "#080f1f",
    theme_color: "#080f1f",
    icons: [
      { src: "/logo_pack/favicon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/logo_pack/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
