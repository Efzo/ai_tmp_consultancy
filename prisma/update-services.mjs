import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const newPillars = [
  {
    slug: "technical-product-management",
    title: "Technical Product Management & Strategy",
    shortDescription: "Turn complex business goals into clear product direction, rigorous requirements, and an executable delivery roadmap.",
    fullDescription: "Connect customer needs and business outcomes to practical product and technical decisions across discovery, prioritization, requirements, and delivery.",
    targetAudience: "SaaS companies, enterprise product teams, and founders building or modernizing digital products.",
    problemsSolved: ["Unclear product direction", "Weak product and engineering alignment", "Backlog and prioritization challenges", "Requirements that create rework"],
    deliverables: ["Product strategy and roadmap", "PRDs and acceptance criteria", "Prioritized backlog", "Outcome and KPI framework", "Stakeholder alignment plan"],
    engagementProcess: ["Discovery", "Product and technical assessment", "Prioritization", "Roadmap definition", "Delivery support"],
    ctaText: "Discuss Product Leadership",
  },
  {
    slug: "software-engineering",
    title: "Custom Software Engineering",
    shortDescription: "Build reliable, maintainable software that solves real operational and customer problems.",
    fullDescription: "Full-stack web application development, SaaS product development, and bespoke internal tools using a modern, type-safe stack.",
    targetAudience: "Startups, growing businesses, and enterprises needing production-ready software.",
    problemsSolved: ["Lack of scalable architecture", "Slow delivery velocity", "Unstable production systems", "Technical debt"],
    deliverables: ["Production-ready application", "Technical architecture documentation", "API specifications", "Deployment pipeline"],
    engagementProcess: ["Requirement scoping", "Architecture design", "Iterative development", "QA & Testing", "Deployment"],
    ctaText: "Start Building",
  },
  {
    slug: "ai-solutions",
    title: "AI Solutions & Workflow Automation",
    shortDescription: "Apply AI to useful business workflows while considering reliability, security, and operational oversight.",
    fullDescription: "LLM-powered applications, AI assistants, RAG, and enterprise knowledge retrieval integrated into existing business processes.",
    targetAudience: "Organizations looking to leverage AI for tangible operational gains.",
    problemsSolved: ["Manual data extraction", "Inefficient knowledge retrieval", "Poor customer support scaling", "Repetitive operational tasks"],
    deliverables: ["AI prototype", "Integration blueprint", "Deployed AI agent/workflow", "Evaluation framework"],
    engagementProcess: ["AI opportunity mapping", "Technical feasibility", "MVP implementation", "Evaluation & Guardrails", "Rollout"],
    ctaText: "Implement AI",
  },
  {
    slug: "software-architecture",
    title: "Software Architecture & Technical Advisory",
    shortDescription: "Make defensible technology decisions and build systems that can evolve with your business.",
    fullDescription: "Software architecture and system design, cloud modernization, and technical due diligence for complex platforms.",
    targetAudience: "CTOs, engineering leaders, and organizations modernizing technology platforms.",
    problemsSolved: ["System scaling bottlenecks", "Integration complexity", "Cloud cost inefficiency", "Technical risk in new ventures"],
    deliverables: ["Architecture blueprint", "API strategy", "Modernization roadmap", "Technical risk assessment"],
    engagementProcess: ["Technical audit", "Architecture design", "Trade-off review", "Blueprint validation", "Oversight"],
    ctaText: "Get Expert Advice",
  },
];

async function main() {
  console.log("Updating services to new pillars...");
  for (const service of newPillars) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: { ...service, isPublished: true },
      create: { ...service, isPublished: true },
    });
  }
  console.log("Services updated successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
