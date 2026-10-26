import React from 'react';
import Link from 'next/link';

const engagements = [
  { 
    title: "Product Discovery", 
    desc: "A high-intensity sprint to define requirements, architecture, and a delivery roadmap.", 
    cta: "Get a Roadmap" 
  },
  { 
    title: "Custom Engineering", 
    desc: "End-to-end development of your MVP or a critical feature, from design to production.", 
    cta: "Build My Product" 
  },
  { 
    title: "Fractional TPM", 
    desc: "Ongoing technical leadership to align your roadmap and manage engineering delivery.", 
    cta: "Scale My Team" 
  },
];

export default function EngagementOverview({ content }: { content: any }) {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            {content.title}
          </h2>
          <p className="text-slate-muted text-xl max-w-3xl mx-auto">
            {content.subheadline}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {engagements.map((e) => (
            <div key={e.title} className="glass-card p-10 flex flex-col text-center border-t-4 border-t-electric">
              <h3 className="text-2xl font-bold mb-4">{e.title}</h3>
              <p className="text-slate-muted mb-8 flex-grow">{e.desc}</p>
              <Link href="/engagements" className="btn-secondary w-full">
                {e.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
