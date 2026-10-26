import React from 'react';
import Link from 'next/link';

export default function FinalCTA({ content }: { content: any }) {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto glass-panel p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden border border-electric/20">
        <div className="absolute top-0 left-0 w-full h-full bg-electric/5 pointer-events-none" />
        <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight relative z-10">
          {content.title}
        </h2>
        <p className="text-slate-muted text-xl mb-12 max-w-2xl mx-auto relative z-10">
          {content.text}
        </p>
        <Link href="/contact" className="btn-primary text-lg px-10 py-5 relative z-10">
          {content.cta}
        </Link>
      </div>
    </section>
  );
}
