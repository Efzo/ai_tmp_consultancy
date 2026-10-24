import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getManagedServices } from "@/lib/services";
import { getCaseStudies, getTestimonials } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [caseStudies, testimonials, services] = await Promise.all([getCaseStudies(), getTestimonials(), getManagedServices()]);
  return (
    <main className="bg-midnight text-platinum">
      <section className="px-6 pb-24 pt-40 md:pb-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-electric">Technology & Product Consulting</p>
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.04] tracking-tight md:text-7xl">Product Strategy. <span className="text-electric">Technical Leadership.</span> Measurable Outcomes.</h1>
            <p className="mt-8 max-w-2xl text-xl leading-relaxed text-slate-muted">I help startups, SaaS companies, and enterprise teams define, build, modernize, and scale software and AI-powered products—from product discovery and roadmaps to architecture and delivery.</p>
            <div className="mt-10 flex flex-wrap gap-4"><Link href="/book" className="btn-primary inline-flex items-center gap-2">Book a Discovery Call <ArrowRight className="h-4 w-4" /></Link><Link href="/contact" className="btn-secondary">Request a Consulting Proposal</Link></div>
            <p className="mt-6 text-sm text-slate-muted">Advisory and technical product leadership grounded in enterprise SaaS, cloud platforms, and AI systems.</p>
          </div>
          <div className="glass-panel relative overflow-hidden p-8 md:p-10"><div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-electric/20 blur-3xl" /><p className="relative text-sm uppercase tracking-[0.2em] text-cyan-ai">Where I create leverage</p><div className="relative mt-8 space-y-6">{["Clarify the customer problem", "Define the product and technical path", "Align teams around tradeoffs", "Measure outcomes after delivery"].map((item) => <div key={item} className="flex gap-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-electric" /><span className="text-lg text-white">{item}</span></div>)}</div></div>
        </div>
      </section>

      <section className="border-y border-glass bg-white/[0.02] px-6 py-20"><div className="mx-auto max-w-7xl"><div className="mb-10 max-w-2xl"><p className="text-sm uppercase tracking-[0.25em] text-electric">Services</p><h2 className="mt-3 text-4xl font-bold">From product vision to technical execution.</h2></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`} className="glass-card p-7"><p className="text-sm capitalize text-electric">{service.slug.replaceAll("-", " ")}</p><h3 className="mt-4 text-2xl font-bold">{service.title}</h3><p className="mt-4 leading-relaxed text-slate-muted">{service.shortDescription}</p><span className="mt-7 inline-block text-sm font-semibold text-cyan-ai">Explore service →</span></Link>)}</div></div></section>

      <section className="px-6 py-20"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-sm uppercase tracking-[0.25em] text-electric">How we work</p><h2 className="mt-3 text-4xl font-bold">A practical path from ambiguity to action.</h2><p className="mt-5 leading-relaxed text-slate-muted">Every engagement is structured around the business problem, the right level of technical depth, and a clear definition of success.</p><Link href="/process" className="mt-7 inline-flex items-center gap-2 text-cyan-ai">See the consulting process <ArrowRight className="h-4 w-4" /></Link></div><div className="grid gap-4 sm:grid-cols-2">{["Discovery", "Assessment", "Scope & proposal", "Strategy & planning", "Execution oversight", "Evaluation & handover"].map((item, index) => <div key={item} className="glass-card p-5"><p className="text-sm text-electric">0{index + 1}</p><h3 className="mt-3 font-semibold">{item}</h3></div>)}</div></div></section>

      <section className="bg-white/[0.02] px-6 py-20"><div className="mx-auto max-w-7xl"><div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm uppercase tracking-[0.25em] text-electric">Selected work</p><h2 className="mt-3 text-4xl font-bold">Technical decisions with product consequences.</h2></div><Link href="/case-studies" className="text-cyan-ai">View all case studies →</Link></div><div className="grid gap-5 md:grid-cols-3">{caseStudies.map((study) => <Link key={study.slug} href={`/case-studies/${study.slug}`} className="glass-card p-7"><p className="text-xs uppercase tracking-widest text-electric">{study.category}</p><h3 className="mt-5 text-xl font-bold">{study.title}</h3><p className="mt-4 text-sm leading-relaxed text-slate-muted">{study.summary}</p></Link>)}</div></div></section>

      {testimonials.filter((testimonial) => testimonial.isPublished).length > 0 && <section className="px-6 py-20"><div className="mx-auto max-w-7xl"><div className="mb-10"><p className="text-sm uppercase tracking-[0.25em] text-electric">Client perspective</p><h2 className="mt-3 text-4xl font-bold">Trusted technical leadership.</h2></div><div className="grid gap-5 md:grid-cols-2">{testimonials.filter((testimonial) => testimonial.isPublished).map((testimonial) => <figure key={testimonial.id} className="glass-card p-7"><blockquote className="text-lg leading-relaxed text-slate-muted">“{testimonial.quote}”</blockquote><figcaption className="mt-6 text-sm"><span className="font-semibold text-white">{testimonial.name}</span><span className="text-slate-muted"> · {testimonial.role}, {testimonial.company}</span></figcaption></figure>)}</div></div></section>}

      <section className="px-6 py-24"><div className="glass-panel mx-auto max-w-5xl p-10 text-center md:p-16"><p className="text-sm uppercase tracking-[0.25em] text-electric">Start with clarity</p><h2 className="mt-4 text-4xl font-bold md:text-5xl">Bring your hardest AI product question.</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-muted">We can start with a discovery call, a focused opportunity workshop, or a technical assessment of an existing initiative.</p><div className="mt-9 flex flex-wrap justify-center gap-4"><Link href="/book" className="btn-primary">Book a Discovery Call</Link><Link href="/pricing" className="btn-secondary">View Engagement Options</Link></div></div></section>
    </main>
  );
}
