export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  type: 'fixed' | 'retainer';
  cta: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'product-discovery-roadmap',
    name: 'Product Discovery & Roadmap Sprint',
    price: 'Custom',
    description: 'A focused engagement to clarify the customer problem, evaluate options, and create a practical product and delivery roadmap.',
    features: [
      'Stakeholder Discovery Sessions',
      'Prioritized Opportunity Map',
      'Product Requirements and Technical Direction',
      'Next-Steps Delivery Plan'
    ],
    type: 'fixed',
    cta: 'Request a Proposal',
  },
  {
    id: 'fractional-tpm-monthly',
    name: 'Fractional Technical Product Management',
    price: 'Custom',
    description: 'Ongoing technical product leadership embedded in your team. Ideal for organizations delivering complex software or AI-enabled products.',
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
    id: 'product-technology-assessment',
    name: 'Product & Technology Assessment',
    price: 'Custom',
    description: 'A practical review of your product, architecture, and delivery system to identify risks, gaps, and the highest-value improvements.',
    features: [
      'Product and Technical Review',
      'Architecture and Delivery Assessment',
      'Risk and Opportunity Assessment',
      'Optimized Roadmap Report'
    ],
    type: 'fixed',
    cta: 'Request an Assessment',
  }
];
