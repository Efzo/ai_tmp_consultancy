import content from "./consulting.json";
export interface Service {
  slug: string; title: string; shortDescription: string; fullDescription: string;
  targetAudience: string; problemsSolved: string[]; deliverables: string[];
  engagementProcess: string[]; ctaText: string;
}
export const services: Service[] = content.services;
