import ContactForm from "@/components/ContactForm";
import { getContactBudgetOptions } from "@/lib/site-settings";
import { getManagedServices } from "@/lib/services";

export default async function ContactPage() {
  const [budgetOptions, services] = await Promise.all([getContactBudgetOptions(), getManagedServices()]);
  return <ContactForm budgetOptions={budgetOptions} services={services.map((service) => ({ slug: service.slug, title: service.title }))} />;
}
