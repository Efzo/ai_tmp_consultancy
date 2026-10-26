import { z } from "zod";
import defaults from "@/data/homepage.json";
const text = z.string().trim().min(1).max(4000);
const path = z.string().regex(/^\/(?!\/)[^\s]*$/);
export const homeSchema = z.object({
  hero: z.object({ title: text, subheadline: text, primaryCta: text, primaryHref: path, secondaryCta: text, contactCta: text.default("Contact"), contactHref: path.default("/contact") }),
  pillars: z.object({ title: text, subheadline: text }),
  problems: z.object({ title: text, items: z.array(text).max(12) }),
  process: z.object({ title: text, subheadline: text }),
  featured: z.object({ category: text, title: text, description: text, cta: text, slug: z.string().regex(/^[a-z0-9-]+$/) }),
  engagements: z.object({ title: text, subheadline: text }),
  differentiator: z.object({ title: text, text }),
  insights: z.object({ title: text }),
  faq: z.object({ title: text, items: z.array(z.object({ q: text, a: text })).max(20) }),
  finalCta: z.object({ title: text, text, cta: text, href: path }),
  sections: z.array(z.enum(["hero", "pillars", "problems", "process", "featured", "engagements", "differentiator", "insights", "faq", "finalCta"])).max(10).refine((sections) => new Set(sections).size === sections.length && sections.includes("hero"), "Include one hero and do not repeat sections."),
});
export type HomeContent = z.infer<typeof homeSchema>;
export const homeDefaults: HomeContent = homeSchema.parse(defaults);
