import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const services = [
  ["ai-strategy", "AI Product Strategy & Roadmapping"],
  ["fractional-tpm", "Fractional AI Technical Product Management"],
  ["solution-architecture", "AI Solution Architecture & Implementation Advisory"],
  ["enterprise-search", "Enterprise Search & AI Knowledge Systems"],
  ["ai-audit", "AI Product Audit & Technical Assessment"],
];

for (const [slug, title] of services) {
  await prisma.service.upsert({ where: { slug }, update: { title }, create: { slug, title, shortDescription: `${title} for teams building valuable AI products.`, fullDescription: `${title} scoped around your business problem, technical context, and measurable outcomes.`, targetAudience: "Startups, SaaS teams, and enterprise product organizations.", problemsSolved: ["Unclear product priorities", "Technical delivery risk"], deliverables: ["Strategy", "Roadmap", "Technical recommendations"], engagementProcess: ["Discovery", "Assessment", "Planning", "Handover"], ctaText: "Discuss this service", price: null } });
}

await prisma.page.upsert({ where: { slug: "home" }, update: {}, create: { slug: "home", title: "Homepage", content: [{ id: "hero-1", type: "hero", title: "Homepage hero", visible: true }, { id: "services-1", type: "services", title: "Services grid", visible: true }, { id: "cta-1", type: "cta", title: "Discovery call CTA", visible: true }], status: "PUBLISHED", isPublished: true, publishedAt: new Date(), versions: { create: { version: 1, title: "Homepage", content: [{ id: "hero-1", type: "hero", title: "Homepage hero", visible: true }, { id: "services-1", type: "services", title: "Services grid", visible: true }, { id: "cta-1", type: "cta", title: "Discovery call CTA", visible: true }] } } } });

if (process.env.ADMIN_EMAIL) await prisma.user.upsert({ where: { email: process.env.ADMIN_EMAIL }, update: { role: "OWNER", name: "Efosa Ojomo" }, create: { email: process.env.ADMIN_EMAIL, role: "OWNER", name: "Efosa Ojomo" } });

const footerSettings = {
  "footer.linkedinUrl": "https://linkedin.com/in/efosa-o-4882a015a/",
  "footer.articlesUrl": "/blog",
  "footer.allServicesUrl": "/services",
  "footer.aiStrategyUrl": "/services/ai-strategy",
  "footer.fractionalTpmUrl": "/services/fractional-tpm",
  "footer.aiArchitectureUrl": "/services/solution-architecture",
  "footer.aboutUrl": "/about",
  "footer.processUrl": "/process",
  "footer.caseStudiesUrl": "/case-studies",
  "footer.contactUrl": "/contact",
  "footer.privacyUrl": "/privacy",
  "footer.termsUrl": "/terms",
};
for (const [key, value] of Object.entries(footerSettings)) await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });

console.log("CMS seed complete.");
await prisma.$disconnect();
