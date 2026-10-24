import React from 'react';
import Link from 'next/link';
import { services } from '@/data/services';

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-midnight text-platinum pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Expert <span className="text-electric">Consulting</span> for <br />
            AI-Powered Organizations
          </h1>
          <p className="text-slate-muted text-xl max-w-3xl mx-auto">
            We provide the strategic and technical leadership necessary to move your AI initiatives from conceptual prototypes to high-impact business assets.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.slug} className="glass-card p-8 flex flex-col h-full">
              <h3 className="text-2xl font-bold mb-4 text-cyan-ai">{service.title}</h3>
              <p className="text-slate-muted mb-8 flex-grow">{service.shortDescription}</p>
              <Link 
                href={`/services/${service.slug}`} 
                className="btn-secondary text-center w-full"
              >
                Explore Service
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
