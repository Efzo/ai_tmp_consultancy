import { z } from "zod";
export const caseDetailsSchema = z.object({
  tradeoffs: z.string().trim().max(4000).default(""),
  features: z.array(z.string().trim().min(1).max(300)).max(30).default([]),
  lessons: z.string().trim().max(4000).default(""),
});
export type CaseDetails = z.infer<typeof caseDetailsSchema>;
export const emptyCaseDetails: CaseDetails = { tradeoffs: "", features: [], lessons: "" };
