import Link from "next/link";
import { getPricingPlans } from "@/lib/site-settings";
import { pricingModelLabel } from "@/data/pricing";

export default async function EngagementOverview({ content }: { content: { title: string; subheadline: string } }) {
  const plans = (await getPricingPlans()).filter((plan) => plan.isPublished !== false);
  if (!plans.length) return null;
  return <section className="section-shell"><div className="section-inner">
    <div className="section-heading"><h2 className="section-title">{content.title}</h2><p className="section-intro">{content.subheadline}</p></div>
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{plans.map((plan) => <article key={plan.id} className="engagement-card flex flex-col">
      <span className="section-eyebrow mb-5">{pricingModelLabel(plan)}</span>
      <h3 className="mb-4 text-xl">{plan.name}</h3>
      {plan.showPrice === true && plan.price && <p className="mb-4 font-semibold text-electric">{plan.price}</p>}
      <p className="mb-6 flex-1 text-sm text-slate-muted">{plan.description}</p>
      <Link href={`/engagements#${plan.id}`} aria-label={`View pricing and scope for ${plan.name}`} className="text-sm font-semibold text-electric">View engagement details ↗</Link>
    </article>)}</div>
    <div className="mt-8 text-center"><Link href="/engagements" className="btn-secondary">Explore Engagements & Pricing</Link><p className="mt-4 text-sm text-slate-muted">Starting fees in USD. Final scope and fees are confirmed in a written agreement.</p></div>
  </div></section>;
}
