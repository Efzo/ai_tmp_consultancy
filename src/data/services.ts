import content from "./consulting.json";
export interface Service {
  slug: string; title: string; shortDescription: string; fullDescription: string;
  targetAudience: string; problemsSolved: string[]; deliverables: string[];
  engagementProcess: string[]; ctaText: string;
}
export const services: Service[] = content.services;
export const serviceAliases: Record<string, string> = {
  "product-management": "technical-product-management",
  "fractional-tpm": "technical-product-management",
  "product-delivery": "technical-product-management",
  "ai-strategy": "ai-solutions",
  "enterprise-search": "ai-solutions",
  "ai-audit": "ai-solutions",
  "solution-architecture": "software-architecture",
};
