import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const services = [
  {
    slug: "product-management",
    title: "Technical Product Management",
    shortDescription: "Turn complex business goals into clear product direction, rigorous requirements, and an executable delivery roadmap.",
    fullDescription: "Connect customer needs and business outcomes to practical product and technical decisions across discovery, prioritization, requirements, and delivery.",
    targetAudience: "SaaS companies, enterprise product teams, and founders building or modernizing digital products.",
    problemsSolved: ["Unclear product direction", "Weak product and engineering alignment", "Backlog and prioritization challenges", "Requirements that create rework"],
    deliverables: ["Product strategy and roadmap", "PRDs and acceptance criteria", "Prioritized backlog", "Outcome and KPI framework", "Stakeholder alignment plan"],
    engagementProcess: ["Discovery", "Product and technical assessment", "Prioritization", "Roadmap definition", "Delivery support"],
    ctaText: "Discuss Product Leadership",
    price: null,
  },
  {
    slug: "ai-strategy",
    title: "AI Product Strategy & Roadmapping",
    shortDescription: "Move from an AI opportunity or business challenge to a validated product strategy and practical implementation roadmap.",
    fullDescription: "Identify high-value AI opportunities, validate them through customer and technical discovery, and create a rigorous plan for responsible execution.",
    targetAudience: "Startups, SaaS founders, and enterprise innovation teams.",
    problemsSolved: ["Unclear AI value proposition", "Unvalidated AI use cases", "Difficulty prioritizing opportunities", "Gaps between business goals and technical feasibility"],
    deliverables: ["AI opportunity map", "Product requirements", "Prioritized MVP roadmap", "Success metrics framework", "AI risk and feasibility assessment"],
    engagementProcess: ["Discovery", "Use-case validation", "Technical feasibility analysis", "Strategy and roadmap definition", "Handover"],
    ctaText: "Discuss AI Strategy",
    price: null,
  },
  {
    slug: "fractional-tpm",
    title: "Fractional Technical Product Management",
    shortDescription: "Ongoing technical product leadership for organizations that do not require a full-time senior TPM.",
    fullDescription: "Embed senior technical product leadership into your team to drive alignment, manage the roadmap, and connect technical decisions to measurable outcomes.",
    targetAudience: "Growth-stage startups and mid-market SaaS companies.",
    problemsSolved: ["Lack of technical product leadership", "Inefficient product and engineering coordination", "Poorly defined requirements", "Difficulty balancing technical debt and delivery"],
    deliverables: ["Owned product backlog", "Acceptance criteria", "Alignment framework", "Product performance reporting", "Technology assessments"],
    engagementProcess: ["Onboarding and audit", "Backlog refinement", "Iterative delivery management", "Stakeholder reporting", "Continuous optimization"],
    ctaText: "Discuss Fractional Leadership",
    price: null,
  },
  {
    slug: "solution-architecture",
    title: "Technology Advisory & Solution Architecture",
    shortDescription: "Make sound architecture, integration, cloud, and modernization decisions for complex software and AI-enabled products.",
    fullDescription: "Improve an existing platform or design a new one with clear system boundaries, APIs, data flows, cloud integration, security, and appropriate AI architecture.",
    targetAudience: "CTOs, engineering leaders, product architects, and organizations modernizing technology platforms.",
    problemsSolved: ["Architecture uncertainty", "Integration and scaling challenges", "Cloud modernization risk", "Security and governance gaps"],
    deliverables: ["System architecture blueprint", "API and integration strategy", "Cloud modernization plan", "Technical risk assessment", "Implementation guidance"],
    engagementProcess: ["Technical audit", "Architecture design", "Trade-off review", "Blueprint validation", "Implementation oversight"],
    ctaText: "Discuss Technology Advisory",
    price: null,
  },
  {
    slug: "product-delivery",
    title: "Product Delivery & Digital Transformation",
    shortDescription: "Modernize workflows, align delivery teams, and turn strategic priorities into measurable product outcomes.",
    fullDescription: "Create the operating clarity needed to move from strategy to execution through delivery planning, process improvement, vendor coordination, and change leadership.",
    targetAudience: "Organizations improving delivery processes, modernizing operations, or launching new digital products.",
    problemsSolved: ["Slow or unpredictable delivery", "Fragmented operating processes", "Vendor and stakeholder misalignment", "Transformation initiatives without measurable outcomes"],
    deliverables: ["Delivery operating model", "Transformation roadmap", "Cross-functional plan", "Risk and dependency register", "Outcome reporting"],
    engagementProcess: ["Current-state assessment", "Future-state design", "Delivery planning", "Execution support", "Measurement and handover"],
    ctaText: "Discuss Delivery Support",
    price: null,
  },
  {
    slug: "enterprise-search",
    title: "Digital Transformation & Knowledge Systems",
    shortDescription: "Modernize workflows, connect enterprise knowledge, and create technology systems that improve how teams operate.",
    fullDescription: "Turn fragmented workflows and information into more effective digital systems through enterprise search, knowledge platforms, process modernization, and AI-enabled productivity improvements.",
    targetAudience: "Enterprise teams with complex workflows and large internal knowledge bases.",
    problemsSolved: ["Information silos", "Poor internal search", "Manual knowledge retrieval", "Unstructured transformation priorities"],
    deliverables: ["Transformation strategy", "Knowledge system blueprint", "Search and retrieval roadmap", "Process improvement plan", "Adoption roadmap"],
    engagementProcess: ["Knowledge and workflow audit", "Prioritization", "System design", "Quality and adoption planning", "Rollout support"],
    ctaText: "Discuss Transformation",
    price: null,
  },
  {
    slug: "ai-audit",
    title: "Product & Technology Assessment",
    shortDescription: "Review your product, architecture, and delivery system to identify risks, gaps, and high-value improvements.",
    fullDescription: "Receive an unbiased review of your product strategy, technical architecture, delivery system, and—where relevant—AI capabilities with a prioritized path to improvement.",
    targetAudience: "Organizations preparing for growth, modernization, investment, or a major product decision.",
    problemsSolved: ["Unclear product risks", "Technical bottlenecks", "Low delivery confidence", "Uncertainty about the next investment"],
    deliverables: ["Product and technical review", "Architecture assessment", "Risk and opportunity report", "Prioritized improvement roadmap", "Leadership readout"],
    engagementProcess: ["Existing system review", "Stakeholder interviews", "Evidence and quality analysis", "Gap identification", "Recommendation delivery"],
    ctaText: "Request an Assessment",
    price: null,
  },
];

for (const service of services) {
  await prisma.service.upsert({ where: { slug: service.slug }, update: { ...service, isPublished: true }, create: { ...service, isPublished: true } });
}

await prisma.page.upsert({ where: { slug: "home" }, update: {}, create: { slug: "home", title: "Homepage", content: [{ id: "hero-1", type: "hero", title: "Homepage hero", visible: true }, { id: "services-1", type: "services", title: "Services grid", visible: true }, { id: "cta-1", type: "cta", title: "Discovery call CTA", visible: true }], status: "PUBLISHED", isPublished: true, publishedAt: new Date(), versions: { create: { version: 1, title: "Homepage", content: [{ id: "hero-1", type: "hero", title: "Homepage hero", visible: true }, { id: "services-1", type: "services", title: "Services grid", visible: true }, { id: "cta-1", type: "cta", title: "Discovery call CTA", visible: true }] } } } });

if (process.env.ADMIN_EMAIL) {
  const existingOwner = await prisma.user.findUnique({ where: { email: process.env.ADMIN_EMAIL } });
  const password = process.env.ADMIN_PASSWORD ? await bcrypt.hash(process.env.ADMIN_PASSWORD, 12) : existingOwner?.password ?? null;
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL },
    update: { role: "OWNER", name: "Efosa Ojomo", ...(existingOwner?.password ? {} : { password }) },
    create: { email: process.env.ADMIN_EMAIL, role: "OWNER", name: "Efosa Ojomo", password },
  });
}

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

await prisma.siteSetting.upsert({
  where: { key: "navigation.items" },
  update: { value: [{ label: "Services", href: "/services" }, { label: "Case Studies", href: "/case-studies" }, { label: "About", href: "/about" }, { label: "Process", href: "/process" }, { label: "Blog", href: "/blog" }] },
  create: { key: "navigation.items", value: [{ label: "Services", href: "/services" }, { label: "Case Studies", href: "/case-studies" }, { label: "About", href: "/about" }, { label: "Process", href: "/process" }, { label: "Blog", href: "/blog" }] },
});

await prisma.siteSetting.upsert({
  where: { key: "seo.settings" },
  update: { value: { title: "Efosa Ojomo | Technology & Product Consulting", description: "Technical product management, AI strategy, and technology advisory for organizations building and modernizing digital products.", ogImage: "/logo_pack/logo.png" } },
  create: { key: "seo.settings", value: { title: "Efosa Ojomo | Technology & Product Consulting", description: "Technical product management, AI strategy, and technology advisory for organizations building and modernizing digital products.", ogImage: "/logo_pack/logo.png" } },
});

await prisma.siteSetting.upsert({
  where: { key: "pricing.plans" },
  update: { value: [{ id: "product-discovery-roadmap", name: "Product Discovery & Roadmap Sprint", price: "Custom", description: "Clarify the customer problem, evaluate options, and create a practical product and delivery roadmap.", features: ["Stakeholder discovery", "Product requirements", "Prioritized roadmap", "Delivery plan"], type: "fixed", cta: "Request a Proposal" }, { id: "fractional-tpm-monthly", name: "Fractional Technical Product Management", price: "Custom", description: "Ongoing technical product leadership for complex software and AI-enabled products.", features: ["Product backlog ownership", "Engineering coordination", "Roadmap alignment", "Outcome reviews"], type: "retainer", cta: "Request Pricing" }, { id: "product-technology-assessment", name: "Product & Technology Assessment", price: "Custom", description: "Review your product, architecture, and delivery system to identify risks and high-value improvements.", features: ["Product review", "Architecture assessment", "Risk analysis", "Improvement roadmap"], type: "fixed", cta: "Request an Assessment" }] },
  create: { key: "pricing.plans", value: [{ id: "product-discovery-roadmap", name: "Product Discovery & Roadmap Sprint", price: "Custom", description: "Clarify the customer problem, evaluate options, and create a practical product and delivery roadmap.", features: ["Stakeholder discovery", "Product requirements", "Prioritized roadmap", "Delivery plan"], type: "fixed", cta: "Request a Proposal" }, { id: "fractional-tpm-monthly", name: "Fractional Technical Product Management", price: "Custom", description: "Ongoing technical product leadership for complex software and AI-enabled products.", features: ["Product backlog ownership", "Engineering coordination", "Roadmap alignment", "Outcome reviews"], type: "retainer", cta: "Request Pricing" }, { id: "product-technology-assessment", name: "Product & Technology Assessment", price: "Custom", description: "Review your product, architecture, and delivery system to identify risks and high-value improvements.", features: ["Product review", "Architecture assessment", "Risk analysis", "Improvement roadmap"], type: "fixed", cta: "Request an Assessment" }] },
});

const contactBudgetOptions = [
  { value: "undetermined", label: "Undetermined" },
  { value: "5k-15k", label: "$5k - $15k" },
  { value: "15k-50k", label: "$15k - $50k" },
  { value: "50k-plus", label: "$50k+" },
];
await prisma.siteSetting.upsert({ where: { key: "contact.budgetOptions" }, update: {}, create: { key: "contact.budgetOptions", value: contactBudgetOptions } });

console.log("CMS seed complete.");
await prisma.$disconnect();
