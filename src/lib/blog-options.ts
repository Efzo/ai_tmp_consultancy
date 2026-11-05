import { z } from "zod";

export const blogImageUrlSchema = z.string().regex(/^\/api\/media\/[a-z0-9-]+$/, "Choose an uploaded article image.");
export const blogOptionsSchema = z.object({
  seoTitle: z.string().trim().max(160).default(""),
  seoDescription: z.string().trim().max(160).default(""),
  authorName: z.string().trim().min(2).max(120).default("Efosa Ojomo"),
  tags: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
  answerSummary: z.string().trim().max(600).default(""),
  faqs: z.array(z.object({ question: z.string().trim().min(5).max(200), answer: z.string().trim().min(10).max(1500) })).max(8).default([]),
  images: z.array(z.object({ url: blogImageUrlSchema, alt: z.string().trim().min(2).max(300), caption: z.string().trim().max(500).default("") })).max(30).default([]),
});
export type BlogOptions = z.infer<typeof blogOptionsSchema>;
export const emptyBlogOptions: BlogOptions = blogOptionsSchema.parse({});
export const blogOptionsKey = (id: string) => `blog.${id}.options`;
export function readBlogOptions(value: unknown): BlogOptions {
  const result = blogOptionsSchema.safeParse(value);
  return result.success ? result.data : blogOptionsSchema.parse({});
}
export function blogDescription(excerpt: string, options?: BlogOptions) {
  const text = options?.seoDescription || excerpt;
  return text.length <= 160 ? text : `${text.slice(0, 157).trimEnd()}…`;
}
export function serializeJsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
