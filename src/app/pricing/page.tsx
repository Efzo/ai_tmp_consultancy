import React from 'react';
import Link from 'next/link';
import { getPricingPlans } from '@/lib/site-settings';

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const pricingPlans = await getPricingPlans();
  return (
    <main className="min-h-screen bg-midnight text-platinum pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Investment <span className="text-electric">Options</span>
          </h1>
          <p className="text-slate-muted text-xl max-w-3xl mx-auto">
            Structured engagements designed to provide immediate technical clarity 
            and long-term strategic value.
          </p>
          <p className="mt-4 text-sm text-amber-300">Initial prices are planning estimates and require confirmation in an approved proposal.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div key={plan.id} className={`glass-card p-8 flex flex-col h-full ${plan.id === 'fractional-tpm-monthly' ? 'border-electric shadow-[0_0_30px_rgba(57,123,255,0.15)]' : ''}`}>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.type === 'retainer' ? (
                    <span className="text-slate-muted">/ month</span>
                  ) : (
                    <span className="text-slate-muted">/ engagement</span>
                  )}
                </div>
                <p className="text-slate-muted mt-4 text-sm leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-ai">What's Included</h4>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-muted">
                    <span className="text-electric">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {plan.type === 'fixed' ? (
                <Link href={`/contact?service=${plan.id}`} className="btn-primary block w-full py-3 text-center font-bold">
                  {plan.cta}
                </Link>
              ) : (
                <Link href="/book" className="btn-secondary block text-center w-full py-3 font-bold">
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        <section className="mt-24 text-center">
          <div className="glass-panel p-12 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-slate-muted mb-8">
              Every business is different. If none of these packages fit your current needs, 
              I'm happy to build a custom engagement tailored to your specific goals.
            </p>
            <Link href="/contact" className="btn-secondary inline-block">
              Request Custom Proposal
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
