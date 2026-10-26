import { ContentStatus } from "@prisma/client";

export type EngagementType = "FIXED" | "RETAINER" | "HOURLY";

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  details?: import("@/lib/case-details").CaseDetails;
  businessProblem: string;
  role: string;
  requirements: string;
  architecture: string;
  stack: string[];
  implementation: string;
  challenges: string;
  outcomes: string;
  images: string[];
  relatedServices: string[];
  status: ContentStatus;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EngagementModel {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  type: EngagementType;
  ctaText: string;
  relatedServices: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
