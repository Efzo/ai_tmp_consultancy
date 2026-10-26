import React from 'react';
import Link from 'next/link';

interface HeroProps {
  content: {
    title: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
  };
}

export default function Hero({ content }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-6 pt-32 overflow-hidden">
      {/* Enterprise Grid Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', 
            backgroundSize: '40px 40px' 
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-midnight to-midnight" />
      </div>

      {/* Sophisticated Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-electric/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-ai/20 blur-[150px] rounded-full" />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Trust Badge - Added mt-16 to push it away from the navbar */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-electric/30 bg-electric/10 text-electric text-xs font-bold tracking-widest uppercase mb-8 mt-16 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-electric"></span>
          </span>
          Strategic Technology Partner
        </div>

        <h1 className="text-6xl md:text-9xl font-bold mb-8 tracking-tighter leading-[0.9]">
          {content.title}
        </h1>
        
        <p className="text-slate-muted text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          {content.subheadline}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/contact" className="btn-primary text-lg px-10 py-5 w-full sm:w-auto group">
            {content.primaryCta}
            <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
          </Link>
          <Link href="/services" className="btn-secondary text-lg px-10 py-5 w-full sm:w-auto">
            {content.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
