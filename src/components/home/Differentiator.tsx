import React from 'react';

export default function Differentiator({ content }: { content: any }) {
  return (
    <section className="py-32 px-6 bg-slate-900/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
          {content.title}
        </h2>
        <p className="text-slate-muted text-xl leading-relaxed mb-12">
          {content.text}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-4 text-electric">Product Leadership</h3>
            <p className="text-slate-muted">Reducing risk through discovery, rigorous requirements, and strategic alignment.</p>
          </div>
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-4 text-electric">Engineering Rigor</h3>
            <p className="text-slate-muted">Ensuring stability, scalability, and maintainability through professional software architecture.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
