import defaults from "@/data/page-defaults.json";
import type { ManagedPageContent } from "@/lib/page-content-schema";

export function getConsultantPortrait(content: ManagedPageContent<"about">, placement: "hero" | "about") {
  const primary = content.imageUrl
    ? { url: content.imageUrl, alt: content.imageAlt }
    : { url: defaults.about.imageUrl, alt: defaults.about.imageAlt };
  return placement === "about" && content.aboutImageUrl
    ? { url: content.aboutImageUrl, alt: content.aboutImageAlt }
    : primary;
}

// Authenticated CMS uploads need their protected route while previewing a draft.
export function portraitPreviewUrl(url: string, preview: boolean) {
  return preview && url.startsWith("/api/media/") ? url.replace("/api/media/", "/api/admin/media/") : url;
}
