import { getManagedPageContent, managedPageMetadata } from "@/lib/managed-pages";
import PagePreviewBanner from "@/components/admin/PagePreviewBanner";

import ContactForm from "@/components/ContactForm";
import { getContactDetails, getContactBudgetOptions, getPricingPlans } from "@/lib/site-settings";
import { serviceAliases } from "@/data/services";
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string; offer?: string }> }) {
  const [budgetOptions, offers, query, details] = await Promise.all([getContactBudgetOptions(), getPricingPlans(), searchParams, getContactDetails()]);
  const published = offers.filter((offer) => offer.isPublished !== false);
  const content = await getManagedPageContent("contact");
  const requestedService = query.service ? serviceAliases[query.service] ?? query.service : undefined;
  const selected = published.find((offer) => offer.id === query.offer)
    ?? (requestedService ? published.find((offer) => offer.serviceSlug === requestedService) : undefined);
  const initialService = selected?.id;
  const offer = selected?.name;
  const options = published.length ? published.map(({ id, name }) => ({ slug: id, title: name })) : [{ slug: "general-inquiry", title: "General inquiry" }];
  return <><PagePreviewBanner slug="contact" /><ContactForm content={content} budgetOptions={budgetOptions} services={options} details={details} initialService={initialService} offer={offer} /></>;
}

export async function generateMetadata() { return managedPageMetadata("contact"); }
