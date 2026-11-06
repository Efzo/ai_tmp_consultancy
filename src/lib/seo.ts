import type { Metadata } from "next";

export function searchDescription(value: string) {
  const description = value.replace(/\s+/g, " ").trim();
  if (description.length <= 160) return description;
  const excerpt = description.slice(0, 157);
  const boundary = excerpt.lastIndexOf(" ");
  return `${boundary > 100 ? excerpt.slice(0, boundary) : excerpt}…`;
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const snippet = searchDescription(description);
  return { title: `${title} | Efosa Ojomo`, description: snippet, alternates: { canonical: path }, openGraph: { title, description: snippet, url: path, type: "website", images: [{ url: "/logo_pack/logo.png" }] }, twitter: { card: "summary_large_image", title, description: snippet, images: ["/logo_pack/logo.png"] } };
}
