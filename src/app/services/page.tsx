import { getManagedPageContent, managedPageMetadata } from "@/lib/managed-pages";
import PagePreviewBanner from "@/components/admin/PagePreviewBanner";
import Link from 'next/link';
import { getManagedServices } from '@/lib/services';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const content = await getManagedPageContent("services");
  const services = await getManagedServices();
  return (
    <main className="min-h-screen bg-midnight text-platinum pt-36 pb-20 px-6"><PagePreviewBanner slug="services" />
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight">{content.title}</h1>
          <p className="section-intro mx-auto">{content.description}</p>
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
                {content.itemCta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


export async function generateMetadata() { return managedPageMetadata("services"); }
