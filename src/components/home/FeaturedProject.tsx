import React from 'react';
import Link from 'next/link';

export default function FeaturedProject({ content }: { content: any }) {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0 border-0">
          <div className="p-12 flex flex-col justify-center">
            <span className="text-xs font-bold tracking-widest uppercase text-electric mb-4 inline-block">{content.category}</span>
            <h2 className="text-4xl font-bold mb-6 tracking-tight">{content.title}</h2>
            <p className="text-slate-muted text-lg mb-8 leading-relaxed">
              {content.description}
            </p>
            <Link href={`/case-studies/${content.slug}`} className="btn-primary w-fit">
              {content.cta}
            </Link>
          </div>
          <div className="bg-slate-800/50 min-h-[400px] relative flex items-center justify-center border-l border-electric/10">
            <div className="text-slate-500 italic">Project Mockup / Screenshot</div>
          </div>
        </div>
      </div>
    </section>
  );
}
