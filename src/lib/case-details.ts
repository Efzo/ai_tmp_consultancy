import { z } from "zod";
export const screenshotUrlSchema = z.string().trim().max(2000).refine((value) => /^\/api\/media\/[a-z0-9-]+$/.test(value) || isPublicHttpsUrl(value), "Use an HTTPS screenshot URL or a managed image.");
function isPublicHttpsUrl(value: string) {
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; }
  catch { return false; }
}
const optionalWebUrl = z.string().trim().max(2000).refine((value) => !value || isPublicHttpsUrl(value), "Use a complete HTTPS URL without embedded credentials.").default("");
export const caseDetailsSchema = z.object({
  tradeoffs: z.string().trim().max(4000).default(""),
  features: z.array(z.string().trim().min(1).max(300)).max(30).default([]),
  lessons: z.string().trim().max(4000).default(""),
  productUrl: optionalWebUrl,
  embedUrl: optionalWebUrl,
  showEmbed: z.boolean().default(false),
  screenshots: z.array(z.object({ url: screenshotUrlSchema, alt: z.string().trim().max(300).default(""), caption: z.string().trim().max(500).default("") })).max(20).default([]),
}).refine((value) => !value.showEmbed || Boolean(value.embedUrl), "Add a preview URL before enabling the embedded preview.");
export type CaseDetails = z.infer<typeof caseDetailsSchema>;
export const emptyCaseDetails: CaseDetails = { tradeoffs: "", features: [], lessons: "", productUrl: "", embedUrl: "", showEmbed: false, screenshots: [] };
