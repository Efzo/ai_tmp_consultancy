import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { landingPages } from "@/data/landing-pages";
import { services } from "@/data/services";

export function generateStaticParams() { return Object.keys(landingPages).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = landingPages[slug as keyof typeof landingPages];
  return page ? { title: `${page.title} | Efosa Ojomo`, description: page.description, alternates: { canonical: `/consulting/${slug}` } } : {};
}

export default async function ConsultingLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = landingPages[slug as keyof typeof landingPages];
  if (!page) notFound();
  const service = services.find((item) => item.slug === page.service);
  if (!service) notFound();

  return <main className="min-h-screen bg-midnight px-6 pb-24 pt-40 text-platinum"><div className="mx-auto max-w-5xl"><p className="text-sm uppercase tracking-[0.25em] text-electric">Focused consulting engagement</p><h1 className="mt-6 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">{page.title}</h1><p className="mt-8 max-w-3xl text-xl leading-relaxed text-slate-muted">{page.description}</p><div className="mt-10 flex flex-wrap gap-4"><Link href="/book" className="btn-primary">Book a Discovery Call</Link><Link href="/contact" className="btn-secondary">Request a Proposal</Link></div><div className="mt-20 grid gap-6 md:grid-cols-3"><div className="glass-card p-7"><h2 className="text-xl font-bold">The problem</h2><p className="mt-3 text-slate-muted">{service.shortDescription}</p></div><div className="glass-card p-7"><h2 className="text-xl font-bold">The deliverables</h2><ul className="mt-3 space-y-2 text-sm text-slate-muted">{service.deliverables.slice(0, 4).map((item) => <li key={item}>✓ {item}</li>)}</ul></div><div className="glass-card p-7"><h2 className="text-xl font-bold">The next step</h2><p className="mt-3 text-slate-muted">We clarify your context, confirm fit, and define a scoped engagement before paid work begins.</p></div></div></div></main>;
}
