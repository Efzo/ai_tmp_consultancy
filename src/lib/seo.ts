import type { Metadata } from "next";
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return { title: `${title} | Efosa Ojomo`, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: "website", images: [{ url: "/logo_pack/logo.png" }] }, twitter: { card: "summary_large_image", title, description, images: ["/logo_pack/logo.png"] } };
}
