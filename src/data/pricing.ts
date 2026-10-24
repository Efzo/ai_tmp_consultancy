export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  type: 'fixed' | 'retainer';
  cta: string;
  stripePriceId?: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'ai-discovery-workshop',
    name: 'AI Opportunity Workshop',
    price: ',500',
    description: 'A focused 2-day engagement to identify your high-impact AI use-cases and create a validated execution roadmap.',
    features: [
      'Stakeholder Discovery Sessions',
      'AI Feasibility Audit',
      'Prioritized Opportunity Map',
      'Technical High-Level Design',
      'Next-Steps Implementation Plan'
    ],
    type: 'fixed',
    cta: 'Book Workshop',
  },
  {
    id: 'fractional-tpm-monthly',
    name: 'Fractional TPM Retainer',
    price: 'Custom',
    description: 'Ongoing technical product leadership embedded in your team. Ideal for growth-stage startups scaling their AI products.',
    features: [
      'Product Backlog Ownership',
      'Engineering Coordination',
      'Weekly Roadmap Alignment',
      'Technical Trade-off Evaluation',
      'Quarterly Outcome Reviews'
    ],
    type: 'retainer',
    cta: 'Request Pricing',
  },
  {
    id: 'ai-product-audit',
    name: 'AI Product Technical Audit',
    price: ',000',
    description: 'A comprehensive review of your existing AI implementation to identify risks, quality gaps, and performance bottlenecks.',
    features: [
      'Architecture Review',
      'LLM Output Quality Audit',
      'RAG Pipeline Evaluation',
      'Risk & Security Assessment',
      'Optimized Roadmap Report'
    ],
    type: 'fixed',
    cta: 'Order Audit',
  }
];
