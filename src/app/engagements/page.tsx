import React from 'react';
import { getEngagementModels } from '@/lib/engagements';
import Link from 'next/link';

export const dynamic = "force-dynamic";

export default async function EngagementsPage() {
  const models = await getEngagementModels();

  return (
    <main className="min-h-screen bg-midnight text-platinum pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            How to <span className="text-electric">Engage</span>
          </h1>
          <p className="text-slate-muted text-xl max-w-3xl mx-auto">
            Flexible engagement models designed to fit your organization's current stage, 
            from rapid discovery to long-term technical leadership.
          </p>
        </section>

        {models.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <p className="text-slate-muted text-lg">No engagement models published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {models.map((model) => (
              <div key={model.id} className="glass-card p-8 flex flex-col h-full border-t-4 border-t-electric">
                <h3 className="text-2xl font-bold mb-2">{model.name}</h3>
                <p className="text-electric font-bold mb-6">{model.price}</p>
                <p className="text-slate-muted mb-8 flex-grow leading-relaxed">
                  {model.description}
                </p>
                <div className="space-y-3 mb-8">
                  {model.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <span className="text-electric">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="btn-secondary text-center w-full">
                  {model.ctaText}
                </Link>
              </div>
            ))}
          </div>
        )}

        <section className="mt-20 glass-card p-12 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Need a custom proposal?</h3>
          <p className="text-slate-muted mb-8">
            If none of these models perfectly fit your needs, I'm happy to scope a 
            custom engagement tailored to your specific business objectives.
          </p>
          <Link href="/contact" className="btn-primary inline-block">
            Request a Custom Proposal
          </Link>
        </section>
      </div>
    </main>
  );
}
