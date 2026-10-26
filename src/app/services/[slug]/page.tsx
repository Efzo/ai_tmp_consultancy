import { pageMetadata } from "@/lib/seo";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getManagedService, getManagedServices } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const services = await getManagedServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getManagedService(slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-midnight text-platinum pt-36 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <Link href="/services" className="text-slate-muted hover:text-white transition-colors text-sm mb-4 block">
            ← Back to All Services
          </Link>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
            {service.title}
          </h1>
          <p className="text-xl text-slate-muted max-w-3xl">
            {service.shortDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-ai">Overview</h2>
              <p className="text-slate-muted leading-relaxed text-lg">
                {service.fullDescription}
              </p>
            </section>

            <section className="glass-panel p-6">
              <h2 className="text-xl font-bold mb-3">Best fit for</h2>
              <p className="text-slate-muted leading-relaxed">{service.targetAudience}</p>
              <p className="mt-4 text-sm text-slate-muted">The proposal defines responsibilities, deliverables, acceptance criteria, and exclusions. Advisory, hands-on implementation, and ongoing support are agreed explicitly. Maintenance and operational support require a separate scope unless included in the proposal.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-cyan-ai">What we solve</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.problemsSolved.map((problem, idx) => (
                  <div key={idx} className="glass-card p-4 flex items-start gap-3">
                    <span className="text-electric">✓</span>
                    <span className="text-slate-muted">{problem}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-cyan-ai">Key Deliverables</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.deliverables.map((item, idx) => (
                  <div key={idx} className="glass-card p-4 flex items-start gap-3">
                    <span className="text-slate-muted">•</span>
                    <span className="text-slate-muted">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="glass-panel p-8 sticky top-32">
              <h3 className="text-xl font-bold mb-6">Engagement Process</h3>
              <div className="space-y-6">
                {service.engagementProcess.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-electric/20 text-electric flex items-center justify-center font-bold border border-electric/30">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-muted">{step}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/book"
                className="btn-primary block text-center w-full mt-10"
              >
                {service.ctaText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getManagedService(slug);
  return service ? pageMetadata(service.metaTitle || service.title, service.metaDescription || service.shortDescription, `/services/${service.slug}`) : {};
}
