import offers from "./offers.json";
import { z } from "zod";
// Version the unified catalog so legacy pricing settings cannot mask these offers.
// The previous pricing.plans record is retained for reference, never overwritten.
export const pricingCatalogKey = "pricing.engagements.v1";
export interface PricingPlan {
  id: string; name: string; price: string; description: string; features: string[];
  type: 'fixed' | 'milestone' | 'retainer'; cta: string;
  addOns?: string[]; showPrice?: boolean; isPublished?: boolean;
  audience?: string; problem?: string; engagementModel?: string;
  ctaDestination?: 'book' | 'contact';
  serviceSlug?: string;
}
export const pricingPlanSchema = z.object({
  id: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  name: z.string().trim().min(2).max(120),
  price: z.string().trim().max(160).default(""),
  showPrice: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  description: z.string().trim().min(10).max(1000),
  audience: z.string().trim().max(500).default(""),
  problem: z.string().trim().max(500).default(""),
  engagementModel: z.string().trim().max(500).default(""),
  features: z.array(z.string().trim().min(1).max(300)).max(20),
  addOns: z.array(z.string().trim().min(1).max(300)).max(20).default([]),
  type: z.enum(["fixed", "milestone", "retainer"]),
  cta: z.string().trim().min(2).max(80),
  ctaDestination: z.enum(["book", "contact"]).default("contact"),
  serviceSlug: z.enum(["", "technical-product-management", "software-engineering", "ai-solutions", "software-architecture"]).default(""),
});
export const pricingPlansSchema = z.array(pricingPlanSchema).min(1).max(12)
  .refine((plans) => new Set(plans.map((plan) => plan.id)).size === plans.length, "Offer IDs must be unique.")
  .refine((plans) => plans.every((plan) => !plan.showPrice || Boolean(plan.price)), "Add a price before making it visible.");
export const pricingPlans = offers as PricingPlan[];
export function pricingCtaHref(plan: PricingPlan) {
  return plan.ctaDestination === "book" ? "/book" : `/contact?offer=${encodeURIComponent(plan.id)}`;
}
export function pricingModelLabel(plan: PricingPlan) {
  return plan.type === "retainer" ? "Monthly advisory" : plan.type === "milestone" ? "Custom delivery project" : "Fixed-scope engagement";
}
