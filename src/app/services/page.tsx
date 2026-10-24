import Link from 'next/link';
import { getManagedServices } from '@/lib/services';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await getManagedServices();
  return (
    <main className="min-h-screen bg-midnight text-platinum pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Expert <span className="text-electric">Consulting</span> for <br />
            Technology-Driven Organizations
          </h1>
          <p className="text-slate-muted text-xl max-w-3xl mx-auto">
            We provide the product strategy, technical leadership, and delivery guidance necessary to turn complex business challenges into valuable digital products.
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
