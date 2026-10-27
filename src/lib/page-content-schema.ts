import { z } from "zod";
import defaults from "@/data/page-defaults.json";

const text = z.string().trim().min(1).max(12000);
const short = z.string().trim().min(1).max(300);
export const pageLink = z.string().trim().max(500).refine((value) => /^\/(?!\/)[^\s\\]*$/.test(value) || /^https:\/\/[^\s]+$/.test(value), "Use a site path starting with / or an HTTPS URL.");
const optionalLink = pageLink.or(z.literal(""));
const cta = z.object({ title: short, description: text, primaryText: short, primaryUrl: pageLink, secondaryText: z.string().trim().max(300), secondaryUrl: optionalLink }).refine((value) => !value.secondaryText || Boolean(value.secondaryUrl), "Add a URL for the secondary button.");
const card = z.object({ title: short, description: text });
const listing = { title: short, description: text };
const legal = z.object({ label: z.string().trim().max(300), title: short, introduction: text, sections: z.array(z.object({ title: short, body: text })).min(1).max(40) });
export const pageSchemas = {
  about: z.object({ headline: short, bio: z.array(text).min(1).max(30), expertiseHeading: short, expertise: z.array(short).max(30), pedigreeHeading: short, pedigree: z.array(z.object({ title: short, desc: text })).max(30), certsHeading: short, certs: z.array(z.object({ name: short, status: short })).max(30), imageUrl: optionalLink, imageAlt: z.string().trim().max(300), aboutImageUrl: optionalLink, aboutImageAlt: z.string().trim().max(300) }).refine((value) => !value.imageUrl || Boolean(value.imageAlt), "Add descriptive alt text for the main portrait.").refine((value) => !value.aboutImageUrl || Boolean(value.aboutImageAlt), "Add descriptive alt text for the About page portrait."),
  process: z.object({ ...listing, steps: z.array(z.object({ step: short, title: short, description: text })).min(1).max(20), cta }),
  book: z.object({ ...listing, bookingUrl: z.string().trim().url().startsWith("https://").or(z.literal("")), calendarText: short, unavailableTitle: short, unavailableDescription: text, fallbackText: short, fallbackUrl: pageLink, cards: z.array(card).max(12) }),
  contact: z.object({ ...listing, submitText: short, successTitle: short, returnText: short, returnUrl: pageLink, callTitle: short, callDescription: text, callText: short, callUrl: pageLink, note: text }),
  services: z.object({ ...listing, itemCta: short }),
  engagements: z.object({ ...listing, emptyText: text, cta }),
  pricing: z.object({ ...listing, notice: text, featuresTitle: short, addOnsTitle: short, consultationText: short, consultationUrl: pageLink, cta }),
  "case-studies": z.object({ ...listing, itemCta: short, emptyText: text }),
  blog: z.object({ ...listing, eyebrow: short }),
  videos: z.object({ ...listing, emptyTitle: short, emptyText: text }),
  privacy: legal,
  terms: legal,
};
export type ManagedPageSlug = keyof typeof pageSchemas;
export type ManagedPageContent<K extends ManagedPageSlug> = z.infer<(typeof pageSchemas)[K]>;
export function isManagedPageSlug(value: string): value is ManagedPageSlug { return Object.hasOwn(pageSchemas, value); }
export function getPageDefaults<K extends ManagedPageSlug>(slug: K): ManagedPageContent<K> { return pageSchemas[slug].parse(defaults[slug]) as ManagedPageContent<K>; }
export function parsePageContent<K extends ManagedPageSlug>(slug: K, value: unknown) {
  // Older About records did not have editable section labels or image fields.
  const input = value && typeof value === "object" && !Array.isArray(value) ? { ...getPageDefaults(slug), ...value } : value;
  if (slug === "engagements" && input && typeof input === "object" && "title" in input && input.title === "How to Engage") input.title = "Engagements & Pricing";
  return pageSchemas[slug].safeParse(input);
}
export const managedPageNames: Record<ManagedPageSlug, string> = { about: "About", process: "How I Work", book: "Booking Page", contact: "Contact Page", services: "Services Page Intro", engagements: "Engagements & Pricing Page Intro", pricing: "Pricing Page Intro", "case-studies": "Case Studies Page Intro", blog: "Blog Page Intro", videos: "Videos Page Intro", privacy: "Privacy Policy", terms: "Terms of Service" };
export const pagePath = (slug: ManagedPageSlug) => `/${slug}`;
