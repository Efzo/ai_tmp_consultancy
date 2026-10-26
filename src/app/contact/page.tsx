import { getManagedPageContent, managedPageMetadata } from "@/lib/managed-pages";
import PagePreviewBanner from "@/components/admin/PagePreviewBanner";

import ContactForm from "@/components/ContactForm";
import { getContactDetails, getContactBudgetOptions, getPricingPlans } from "@/lib/site-settings";
import { getManagedServices } from "@/lib/services";
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string; offer?: string }> }) {
  const [budgetOptions, services, offers, query, details] = await Promise.all([getContactBudgetOptions(), getManagedServices(), getPricingPlans(), searchParams, getContactDetails()]);
  const content = await getManagedPageContent("contact");
  const initialService = services.find((service) => service.slug === query.service)?.slug;
  const offer = offers.find((offer) => offer.id === query.offer && offer.isPublished !== false)?.name;
  return <><PagePreviewBanner slug="contact" /><ContactForm content={content} budgetOptions={budgetOptions} services={services.map(({ slug, title }) => ({ slug, title }))} details={details} initialService={initialService} offer={offer} /></>;
}

export async function generateMetadata() { return managedPageMetadata("contact"); }
