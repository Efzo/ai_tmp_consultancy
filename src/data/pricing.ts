import offers from "./offers.json";
export interface PricingPlan {
  id: string; name: string; price: string; description: string; features: string[];
  type: 'fixed' | 'milestone' | 'retainer'; cta: string;
  addOns?: string[]; showPrice?: boolean; isPublished?: boolean;
}
export const pricingPlans = offers as PricingPlan[];
