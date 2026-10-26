import Link from "next/link";
import ConsultingImport from "@/components/admin/ConsultingImport";
import AdminDirectory from "@/components/admin/AdminDirectory";
import { AdminModule } from "@/components/admin/AdminModule";

const pageGuide = [
  { name: "Homepage", url: "/", editor: "/admin/page-builder", action: "Edit Homepage", scope: "Text, section order, FAQs, buttons, and SEO", state: "Editable" },
  { name: "About", url: "/about", editor: "/admin/pages/about", action: "Edit About", scope: "Biography, expertise, experience, certifications, profile image, and SEO", state: "Editable" },
  { name: "Services", url: "/services", copyEditor: "/admin/pages/services", editor: "/admin/services", action: "Service Pages", scope: "Individual service descriptions, deliverables, and SEO", state: "Editable services" },
  { name: "Engagements", url: "/engagements", copyEditor: "/admin/pages/engagements", editor: "/admin/engagements", action: "Ways to Work Together", scope: "Engagement models and deliverables", state: "Editable models" },
  { name: "Offers & Pricing", url: "/pricing", copyEditor: "/admin/pages/pricing", editor: "/admin/packages", action: "Offers & Pricing", scope: "Offers, add-ons, prices, and price visibility", state: "Editable offers" },
  { name: "Case Studies", url: "/case-studies", copyEditor: "/admin/pages/case-studies", editor: "/admin/case-studies", action: "Project Case Studies", scope: "Project stories, features, and screenshots", state: "Editable projects" },
  { name: "Blog", url: "/blog", copyEditor: "/admin/pages/blog", editor: "/admin/blog", action: "Blog Articles", scope: "Articles, categories, and publication status", state: "Editable articles" },
  { name: "Videos", url: "/videos", copyEditor: "/admin/pages/videos", editor: "/admin/videos", action: "Videos", scope: "Video entries and their publication status", state: "Editable videos" },
  { name: "Contact", url: "/contact", editor: "/admin/pages/contact", action: "Edit Contact Page", scope: "Page copy, form button, success heading, sidebar, and SEO; shared contact details stay in Site Settings", state: "Editable" },
  { name: "Book a Call", url: "/book", editor: "/admin/pages/book", action: "Edit Booking Page", scope: "Booking page copy, calendar URL, fallback message, information cards, and SEO", state: "Editable" },
  { name: "How I Work", url: "/process", editor: "/admin/pages/process", action: "Edit How I Work", scope: "Page text, sections, and SEO", state: "Editable" },
  { name: "Privacy Policy", url: "/privacy", editor: "/admin/pages/privacy", action: "Edit Privacy Policy", scope: "Page text, sections, and SEO", state: "Editable" },
  { name: "Terms of Service", url: "/terms", editor: "/admin/pages/terms", action: "Edit Terms of Service", scope: "Page text, sections, and SEO", state: "Editable" },
];

export default function ContentPage() {
  return <AdminModule title="Where to Edit" description="Choose what you want to change. Each destination below explains what it controls." status="Editing guide">
    <div className="glass-panel p-6"><h2 className="text-xl font-bold">Start with the part of the website you want to update</h2><p className="mt-3 text-slate-muted">Homepage text belongs in Edit Homepage. Service descriptions belong in Service Pages. Ways to Work Together explains how clients hire you; Offers & Pricing controls what each offer includes and whether prices are shown.</p><p className="mt-3 text-sm text-slate-muted">All pages listed below have connected content editors. Use Website Pages to edit introductions, page sections, and SEO; use the specialized editors for services, offers, articles, and project records.</p><a href="#page-guide" className="mt-4 inline-block text-cyan-ai">Find a website page ↓</a></div>
    <AdminDirectory />
    <section id="page-guide" className="scroll-mt-28 space-y-4"><h2 className="text-2xl font-bold">Website pages: what can I edit?</h2><p className="text-sm text-slate-muted">Listing page introductions and headings can also be edited under Website Pages. The specialized editors below manage the items displayed on those pages.</p><div className="glass-panel overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><caption className="sr-only">Public pages, available editing controls, and editor destinations</caption><thead className="border-b border-glass text-slate-muted"><tr><th scope="col" className="p-4">Website page</th><th scope="col" className="p-4">Available controls</th><th scope="col" className="p-4">Editing status</th><th scope="col" className="p-4">Go to editor</th></tr></thead><tbody className="divide-y divide-glass">{pageGuide.map((page) => <tr key={page.url}><th scope="row" className="p-4 font-medium"><Link href={page.url} target="_blank" rel="noopener noreferrer" className="text-cyan-ai hover:underline">{page.name} ↗</Link></th><td className="max-w-xs p-4 text-slate-muted">{page.scope}</td><td className={`p-4 ${page.state.startsWith("Editable") ? "text-cyan-ai" : "text-amber-200"}`}>{page.state}</td><td className="p-4"><Link href={page.editor} className="text-cyan-ai hover:underline">{page.action} →</Link>{page.copyEditor && <Link href={page.copyEditor} className="mt-2 block text-cyan-ai hover:underline">Edit page introduction →</Link>}</td></tr>)}</tbody></table></div></section>
    <details className="glass-panel p-6"><summary className="cursor-pointer font-semibold">Initial content setup · owner only</summary><p className="my-4 text-sm text-slate-muted">Use this when setting up the consulting catalog. Everyday editing happens in the editors above.</p><ConsultingImport /></details>
  </AdminModule>;
}
