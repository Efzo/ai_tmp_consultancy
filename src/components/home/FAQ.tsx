import React from 'react';

const faqs = [
  { q: "Do you work with early-stage startups?", a: "Yes. I specialize in taking products from 0 to 1, helping founders define their MVP and build a scalable technical foundation." },
  { q: "Can you help with existing legacy systems?", a: "Absolutely. I provide technical audits and modernization roadmaps to help organizations evolve their architecture without breaking current operations." },
  { q: "How do you handle AI integrations?", a: "I treat AI as a capability, not a magic bullet. I focus on reliability, guardrails, and ensuring AI solves a specific, measurable business problem." },
  { q: "Do you offer ongoing maintenance?", a: "Yes, I provide technical advisory retainers for companies that need high-level oversight without a full-time CTO/VP Eng." },
];

export default function FAQ({ content }: { content: any }) {
  return (
    <section className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-6 tracking-tight">{content.title}</h2>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card p-6">
              <h3 className="text-lg font-bold mb-2 text-electric">{faq.q}</h3>
              <p className="text-slate-muted leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
