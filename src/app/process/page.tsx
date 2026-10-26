import { getManagedPageContent, managedPageMetadata } from "@/lib/managed-pages";
import PagePreviewBanner from "@/components/admin/PagePreviewBanner";

import React from 'react';
import ManagedPageCTA from "@/components/ManagedPageCTA";

export default async function ProcessPage() {
  const content = await getManagedPageContent("process");
  return (
    <main className="min-h-screen bg-midnight text-platinum pt-36 pb-20 px-6">
      <PagePreviewBanner slug="process" /><div className="max-w-4xl mx-auto">
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight">
            {content.title}
          </h1>
          <p className="section-intro mx-auto">
            {content.description}
          </p>
        </section>

        <div className="space-y-12 relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-glass hidden md:block"></div>

          {content.steps.map((item) => (
            <div key={item.step} className="relative md:pl-24 group">
              <div className="absolute left-0 top-0 w-16 h-16 hidden md:flex items-center justify-center z-10">
                <div className="w-10 h-10 rounded-full bg-midnight border-2 border-electric text-electric font-bold flex items-center justify-center transition-all duration-300 group-hover:bg-electric group-hover:text-white">
                  {item.step}
                </div>
              </div>
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold mb-4 text-cyan-ai">{item.title}</h3>
                <p className="text-slate-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <ManagedPageCTA content={content.cta} />
      </div>
    </main>
  );
}

export async function generateMetadata() { return managedPageMetadata("process"); }
