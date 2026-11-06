import { z } from "zod";
import defaults from "@/data/page-defaults.json";

const text = z.string().trim().min(1).max(12000);
const short = z.string().trim().min(1).max(300);
export const pageLink = z.string().trim().max(500).refine((value) => /^\/(?!\/)[^\s\\]*$/.test(value) || /^https:\/\/[^\s]+$/.test(value), "Use a site path starting with / or an HTTPS URL.");
const optionalLink = pageLink.or(z.literal(""));
const cta = z.object({ title: short, description: text, primaryText: short, primaryUrl: pageLink, secondaryText: z.string().trim().max(300), secondaryUrl: optionalLink }).refine((value) => !value.secondaryText || Boolean(value.secondaryUrl), "Add a URL for the secondary button.");
const card = z.object({ title: short, description: text });
const listing = { title: short, description: text };
const audiencePage = z.object({ ...listing, servicesHeading: short, items: z.array(z.object({ title: short, description: text, cta: short, href: pageLink })).max(12), ongoingTitle: short, ongoingDescription: text, cta });
const legal = z.object({ label: z.string().trim().max(300), title: short, introduction: text, sections: z.array(z.object({ title: short, body: text })).min(1).max(40) });
export const pageSchemas = {
  "for-businesses": audiencePage,
  "for-founders": audiencePage,
  about: z.object({
    headline: short,
    tagline: short.default(defaults.about.tagline),
    introductionHeading: short.default(defaults.about.introductionHeading),
    introduction: z.array(text).max(12).default(defaults.about.introduction),
    promise: short.default(defaults.about.promise),
    founderHeading: short.default(defaults.about.founderHeading),
    founderName: short.default(defaults.about.founderName),
    founderRole: short.default(defaults.about.founderRole),
    bio: z.array(text).min(1).max(30),
    founderPrinciple: short.default(defaults.about.founderPrinciple),
    expertiseHeading: short, expertise: z.array(short).max(30),
    audiences: z.object({ heading: short, cards: z.array(z.object({ title: short, body: z.array(text).max(8) })).max(12) }).default(defaults.about.audiences),
    capabilities: z.object({ heading: short, cards: z.array(card).max(12) }).default(defaults.about.capabilities),
    pedigreeHeading: short, pedigree: z.array(z.object({ title: short, desc: text })).max(30),
    approach: z.object({ heading: short, tagline: short, steps: z.array(z.object({ step: short, title: short, description: text })).max(12) }).default(defaults.about.approach),
    foundation: z.object({ heading: short, paragraphs: z.array(text).max(12) }).default(defaults.about.foundation),
    educationHeading: short.default("Education"),
    education: z.array(z.object({ qualification: short, institution: short, period: z.string().trim().max(200), details: z.string().trim().max(2000) })).max(30).default([]),
    certsHeading: short, certs: z.array(z.object({ name: short, status: short })).max(30),
    imageUrl: optionalLink, imageAlt: z.string().trim().max(300), aboutImageUrl: optionalLink, aboutImageAlt: z.string().trim().max(300),
    cta: cta.default(defaults.about.cta), signature: short.default(defaults.about.signature),
  }).refine((value) => !value.imageUrl || Boolean(value.imageAlt), "Add descriptive alt text for the main portrait.").refine((value) => !value.aboutImageUrl || Boolean(value.aboutImageAlt), "Add descriptive alt text for the About page portrait."),
  process: z.object({ ...listing, steps: z.array(z.object({ step: short, title: short, description: text })).min(1).max(20), cta }),
  book: z.object({ ...listing, bookingUrl: z.string().trim().url().startsWith("https://").or(z.literal("")), calendarText: short, unavailableTitle: short, unavailableDescription: text, fallbackText: short, fallbackUrl: pageLink, cards: z.array(card).max(12) }),
  contact: z.object({ ...listing, submitText: short, successTitle: short, returnText: short, returnUrl: pageLink, callTitle: short, callDescription: text, callText: short, callUrl: pageLink, note: text }),
  services: z.object({ ...listing, itemCta: short }),
  engagements: z.object({ ...listing, emptyText: text, cta, eyebrow: short.default(defaults.engagements.eyebrow), priceNotice: text.default(defaults.engagements.priceNotice), scopeTitle: short.default(defaults.engagements.scopeTitle), scopeItems: z.array(text).max(20).default(defaults.engagements.scopeItems) }),
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
export const managedPageNames: Record<ManagedPageSlug, string> = { "for-businesses": "For Business Owners", "for-founders": "For Founders & Product Teams", about: "About", process: "How I Work", book: "Booking Page", contact: "Contact Page", services: "Services Page Intro", engagements: "Engagements & Pricing Page Intro", pricing: "Pricing Page Intro", "case-studies": "Case Studies Page Intro", blog: "Blog Page Intro", videos: "Videos Page Intro", privacy: "Privacy Policy", terms: "Terms of Service" };
export const pagePath = (slug: ManagedPageSlug) => `/${slug}`;
