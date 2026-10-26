import ManagedPageCTA from "@/components/ManagedPageCTA";
import { getManagedPageContent, managedPageMetadata } from "@/lib/managed-pages";
import PagePreviewBanner from "@/components/admin/PagePreviewBanner";
import React from 'react';
import Link from 'next/link';
import { getPricingPlans } from '@/lib/site-settings';

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const content = await getManagedPageContent("pricing");
  const pricingPlans = (await getPricingPlans()).filter((plan) => plan.isPublished !== false);
  return (
    <main className="min-h-screen bg-midnight text-platinum pt-36 pb-20 px-6"><PagePreviewBanner slug="pricing" />
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight">{content.title}</h1>
          <p className="section-intro mx-auto">{content.description}</p>
          <p className="mt-4 text-sm text-amber-300">{content.notice}</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pricingPlans.map((plan) => (
            <div key={plan.id} className={`glass-card p-8 flex flex-col h-full ${plan.id === 'fractional-tpm-monthly' ? 'border-electric shadow-[0_0_30px_rgba(57,123,255,0.15)]' : ''}`}>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-electric font-semibold">{plan.type === "retainer" ? "Retainer" : plan.type === "milestone" ? "Milestone-based" : "Fixed fee"}</p>
                {plan.showPrice === true && plan.price && <p className="text-3xl font-bold mt-3">{plan.price}</p>}
                <p className="text-slate-muted mt-4 text-sm leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-ai">{content.featuresTitle}</h4>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-muted">
                    <span className="text-electric">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {!!plan.addOns?.length && <div className="mb-8"><h4 className="font-bold mb-3">{content.addOnsTitle}</h4><ul className="list-disc pl-5 text-slate-muted">{plan.addOns.map((item) => <li key={item}>{item}</li>)}</ul></div>}
              <Link href={`/contact?offer=${plan.id}`} className="btn-primary block text-center">{plan.cta}</Link>
              <Link href={content.consultationUrl} className="btn-secondary block text-center mt-3">{content.consultationText}</Link>
            </div>
          ))}
        </div>

        <ManagedPageCTA content={content.cta} />
      </div>
    </main>
  );
}


export async function generateMetadata() { return managedPageMetadata("pricing"); }
