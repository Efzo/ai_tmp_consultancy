import { z } from "zod";
import defaults from "@/data/homepage.json";
const text = z.string().trim().min(1).max(4000);
const path = z.string().regex(/^\/(?!\/)[^\s\\]*$/);
const serviceSlugs = z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).max(12).refine((items) => new Set(items).size === items.length, "Do not repeat services.");
export const homeSchema = z.object({
  hero: z.object({ title: text, subheadline: text, primaryCta: text, primaryHref: path, secondaryCta: text, contactCta: text.default("Contact"), contactHref: path.default("/contact"), eyebrow: text.default(defaults.hero.eyebrow), portraitCaption: text.default(defaults.hero.portraitCaption) }),
  pillars: z.object({ title: text, subheadline: text, serviceSlugs: serviceSlugs.optional() }),
  audiences: z.object({ title: text, subheadline: text, items: z.array(z.object({ title: text, description: text, cta: text, href: path })).max(6) }).default(defaults.audiences),
  problems: z.object({ title: text, items: z.array(text).max(12) }),
  process: z.object({ title: text, subheadline: text }),
  featured: z.object({ category: text, title: text, description: text, cta: text, slug: z.string().regex(/^[a-z0-9-]+$/) }),
  engagements: z.object({ title: text, subheadline: text }),
  differentiator: z.object({ title: text, text }),
  insights: z.object({ title: text }),
  faq: z.object({ title: text, items: z.array(z.object({ q: text, a: text })).max(20) }),
  finalCta: z.object({ title: text, text, cta: text, href: path }),
  sections: z.array(z.enum(["hero", "audiences", "pillars", "problems", "process", "featured", "engagements", "differentiator", "insights", "faq", "finalCta"])).max(11).refine((sections) => new Set(sections).size === sections.length && sections.includes("hero"), "Include one hero and do not repeat sections."),
});
export type HomeContent = z.infer<typeof homeSchema>;
export const homeDefaults: HomeContent = homeSchema.parse(defaults);
