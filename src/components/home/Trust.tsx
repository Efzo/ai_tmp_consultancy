import React from 'react';
import Image from 'next/image';
import { getTrustLogos } from '@/lib/site-settings';

interface TrustProps {
  content: {
    title: string;
    text: string;
    logos: string[];
  };
}

export default async function Trust({ content }: TrustProps) {
  const logosData = await getTrustLogos();
  
  // Handle legacy data (string array) or current data (object array)
  const logos = Array.isArray(logosData) 
    ? logosData.map((item, idx) => 
        typeof item === 'string' 
          ? { name: item, logoUrl: '/logo_pack/logo.png' } 
          : item
      )
    : [];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-electric/10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{content.title}</h2>
            <p className="text-slate-muted text-lg">
              {content.text}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-10 opacity-70 grayscale hover:grayscale-0 transition-all">
             {logos.map((logo, idx) => (
               <div key={idx} className="relative h-10 w-32 transition-all hover:opacity-100">
                 <Image 
                   src={logo.logoUrl} 
                   alt={logo.name} 
                   fill 
                   className="object-contain" 
                   sizes="128px"
                 />
               </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}
