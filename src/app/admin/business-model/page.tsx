import Link from "next/link";
import { AdminModule } from "@/components/admin/AdminModule";
import { services } from "@/data/services";

const steps = [
  { title: "Set up the services", href: "/admin/services", detail: "Use the business model templates to review existing service copy and create Customer Support Systems. Save the services you want to publish. Existing URLs and other service records are retained." },
  { title: "Review projects and monthly plans", href: "/admin/packages", detail: "Choose Review business model offers. Edit deliverables, care-plan capacity, service hours, exclusions, and fees before saving. Paid prices start hidden. Saving offers updates the public page, homepage cards, and inquiry choices immediately." },
  { title: "Publish the two customer paths", href: "/admin/pages", detail: "Edit For Business Owners and For Founders & Product Teams. Add, remove, and reorder their service cards, edit ongoing support copy, then preview and publish." },
  { title: "Update the homepage", href: "/admin/page-builder", detail: "Choose Review business model homepage to load the new positioning. Edit customer paths, featured service slugs, calls to action, and FAQs. Save a draft, preview, then publish." },
  { title: "Align supporting pages", href: "/admin/pages", detail: "Use Review business model copy on Services, Engagements, About, How I Work, Contact, and Booking. Your About credentials and photos and your Booking calendar are preserved when loading those templates. Review, preview, and publish each page." },
  { title: "Update site-wide positioning", href: "/admin/seo", detail: "Review the business model title and description under Search & Social Sharing. The description also appears in the footer. Save settings when ready, and use Menu Links if you want customer-path pages in navigation." },
];

export default function BusinessModelAdminPage() {
  return <AdminModule title="Business Model & Positioning" description="Manage your technology-partner positioning, customer paths, projects, and ongoing care through the existing CMS." status="Managed technology & business solutions">
    <section className="glass-panel p-6"><h2 className="text-2xl font-semibold">Busy running your business? Let us handle the technology.</h2><p className="mt-4 text-slate-muted">Serve business owners and founders through separate paths. Combine defined delivery projects with monthly care and management agreements.</p><p className="mt-3 text-sm text-slate-muted">The templates load into the existing editors for review. They do not overwrite saved content automatically. Page drafts and previews use the existing publication workflow; service and offer saves apply their selected publication settings immediately.</p></section>
    <section className="mt-8 grid gap-4 md:grid-cols-2">{services.filter((service) => service.slug !== "software-architecture").map((service) => <article key={service.slug} className="glass-card p-6"><h2 className="text-xl font-semibold">{service.title}</h2><p className="mt-3 text-sm text-slate-muted">{service.shortDescription}</p></article>)}</section>
    <ol className="mt-10 space-y-4">{steps.map((step, index) => <li key={step.title} className="glass-panel p-6"><p className="text-sm text-electric">{String(index + 1).padStart(2, "0")}</p><h2 className="mt-2 text-xl font-semibold">{step.title}</h2><p className="mt-3 text-slate-muted">{step.detail}</p><Link href={step.href} className="mt-5 inline-block font-semibold text-electric">Open editor →</Link></li>)}</ol>
    <div className="mt-8 flex flex-wrap gap-4"><Link href="/for-businesses" className="btn-secondary">View business-owner path</Link><Link href="/for-founders" className="btn-secondary">View founder path</Link><Link href="/admin/navigation" className="btn-secondary">Edit menu links</Link></div>
  </AdminModule>;
}
