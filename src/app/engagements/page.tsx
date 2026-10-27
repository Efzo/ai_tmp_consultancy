import Link from "next/link";
import ManagedPageCTA from "@/components/ManagedPageCTA";
import PagePreviewBanner from "@/components/admin/PagePreviewBanner";
import { getManagedPageContent, managedPageMetadata } from "@/lib/managed-pages";
import { getPricingPlans } from "@/lib/site-settings";
import { pricingCtaHref, pricingModelLabel } from "@/data/pricing";

export const dynamic = "force-dynamic";

export default async function EngagementsPage() {
  const [content, plans] = await Promise.all([getManagedPageContent("engagements"), getPricingPlans()]);
  const published = plans.filter((plan) => plan.isPublished !== false);
  // Describe visible services without presenting starting fees as final quotations.
  const structuredData = {
    "@context": "https://schema.org", "@type": "ItemList", name: "Engagements & Pricing",
    itemListElement: published.map((plan, index) => ({
      "@type": "ListItem", position: index + 1,
      item: {
        "@type": "Service", name: plan.name, description: plan.description,
        url: `https://ojomoefosa.com/engagements#${plan.id}`,
        provider: { "@type": "ProfessionalService", name: "Efosa Ojomo", url: "https://ojomoefosa.com" },
      },
    })),
  };
  return (
    <main className="min-h-screen bg-midnight text-platinum pt-36 pb-20 px-6">
      <PagePreviewBanner slug="engagements" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-12 md:mb-16">
          <p className="section-eyebrow mb-4">Technology & Product Consulting</p>
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight">{content.title}</h1>
          <p className="section-intro mx-auto">{content.description}</p>
          <p className="mt-5 text-sm text-slate-muted">Prices shown in USD. Starting fees are indicative; your written proposal confirms the final fee.</p>
        </section>
        {published.length === 0 ? <div className="text-center py-20 glass-card"><p className="text-slate-muted text-lg">{content.emptyText}</p></div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {published.map((plan) => (
              <article id={plan.id} key={plan.id} aria-labelledby={`${plan.id}-title`} className="glass-card p-6 sm:p-8 flex flex-col h-full border-t-4 border-t-electric scroll-mt-32">
                <p className="section-eyebrow mb-4">{pricingModelLabel(plan)}</p>
                <h2 id={`${plan.id}-title`} className="text-2xl font-semibold mb-3">{plan.name}</h2>
                <p className="text-electric text-xl font-semibold mb-5">{plan.showPrice === true && plan.price ? plan.price : "Request a tailored quote"}</p>
                <p className="text-slate-muted mb-6 leading-relaxed">{plan.description}</p>
                <dl className="space-y-4 mb-6 text-sm">
                  {plan.audience && <div><dt className="font-semibold mb-1">Who it’s for</dt><dd className="text-slate-muted">{plan.audience}</dd></div>}
                  {plan.problem && <div><dt className="font-semibold mb-1">The business problem</dt><dd className="text-slate-muted">{plan.problem}</dd></div>}
                  {plan.engagementModel && <div><dt className="font-semibold mb-1">Engagement model</dt><dd className="text-slate-muted">{plan.engagementModel}</dd></div>}
                </dl>
                <div className="mb-8 flex-1"><h3 className="font-semibold text-sm mb-3">Example deliverables</h3><ul className="space-y-3 text-sm text-slate-muted">{plan.features.map((feature, index) => <li key={index} className="flex items-start gap-3"><span aria-hidden="true" className="text-electric">✓</span><span>{feature}</span></li>)}</ul></div>
                {!!plan.addOns?.length && <div className="mb-6 text-sm"><h3 className="font-semibold mb-2">Optional, separately scoped</h3><ul className="list-disc pl-5 text-slate-muted">{plan.addOns.map((item, index) => <li key={index}>{item}</li>)}</ul></div>}
                <Link href={pricingCtaHref(plan)} aria-label={`${plan.cta}: ${plan.name}`} className="btn-primary text-center w-full">{plan.cta}</Link>
              </article>
            ))}
          </div>
        )}
        <section aria-labelledby="pricing-boundaries" className="glass-panel mt-12 p-6 sm:p-8">
          <h2 id="pricing-boundaries" className="text-2xl font-semibold mb-4">How pricing and scope work</h2>
          <ul className="space-y-3 text-slate-muted leading-relaxed list-disc pl-5">
            <li>Starting prices are not final project quotations. Fees depend on scope, complexity, requirements, and engagement duration.</li>
            <li>All paid engagements require an approved written agreement or Statement of Work before work begins.</li>
            <li>Monthly retainers include only the agreed service capacity and responsibilities, with defined meetings and response expectations.</li>
            <li>Deliverables, review rounds, acceptance criteria, and support are agreed in writing. Revisions and support are limited to that scope; additional work requires a separate agreement.</li>
            <li>Recommendations and delivery work support your business decisions. Specific commercial or technical outcomes are not guaranteed.</li>
          </ul>
        </section>
        <ManagedPageCTA content={content.cta} />
      </div>
    </main>
  );
}
export async function generateMetadata() { return managedPageMetadata("engagements"); }
