import ManagedPageCTA from "@/components/ManagedPageCTA";
import { getManagedPageContent, managedPageMetadata } from "@/lib/managed-pages";
import PagePreviewBanner from "@/components/admin/PagePreviewBanner";
import React from 'react';
import { getEngagementModels } from '@/lib/engagements';
import Link from 'next/link';

export const dynamic = "force-dynamic";

export default async function EngagementsPage() {
  const content = await getManagedPageContent("engagements");
  const models = await getEngagementModels();

  return (
    <main className="min-h-screen bg-midnight text-platinum pt-36 pb-20 px-6"><PagePreviewBanner slug="engagements" />
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight">{content.title}</h1>
          <p className="section-intro mx-auto">{content.description}</p>
        </section>

        {models.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <p className="text-slate-muted text-lg">{content.emptyText}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {models.map((model) => (
              <div id={model.slug} key={model.id} className="glass-card p-8 flex flex-col h-full border-t-4 border-t-electric">
                <h3 className="text-2xl font-bold mb-2">{model.name}</h3>
                <p className="text-electric font-bold mb-6">{model.type === "RETAINER" ? "Retainer" : "Scoped engagement"} · Request a Quote</p>
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
                <Link href={content.itemUrl} className="btn-secondary text-center w-full">
                  {content.itemCta}
                </Link>
              </div>
            ))}
          </div>
        )}

        <ManagedPageCTA content={content.cta} />
      </div>
    </main>
  );
}


export async function generateMetadata() { return managedPageMetadata("engagements"); }
