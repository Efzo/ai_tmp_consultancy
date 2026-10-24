export interface Service {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  targetAudience: string;
  problemsSolved: string[];
  deliverables: string[];
  engagementProcess: string[];
  ctaText: string;
}

export const services: Service[] = [
  {
    slug: 'ai-strategy',
    title: 'AI Product Strategy & Roadmapping',
    shortDescription: 'Moving from AI ideas and business challenges to validated product strategies, technical requirements, and implementation roadmaps.',
    fullDescription: 'Our AI Strategy engagement is designed to strip away the hype and focus on real business value. We help you identify the specific AI opportunities that will drive the most impact for your organization, validate them through customer discovery, and create a rigorous execution plan.',
    targetAudience: 'Startups, SaaS founders, and enterprise innovation teams.',
    problemsSolved: [
      'Unclear AI value proposition',
      'Lack of technical roadmap for AI implementation',
      'Difficulty prioritizing AI use-cases',
      'Gap between business goals and technical feasibility'
    ],
    deliverables: [
      'AI Opportunity Map',
      'Product Requirements Documents (PRDs)',
      'Prioritized MVP Roadmap',
      'Success Metrics & KPI Framework',
      'AI Risk & Feasibility Assessment'
    ],
    engagementProcess: [
      'Discovery & Stakeholder Interviews',
      'Use-case Validation',
      'Technical Feasibility Analysis',
      'Strategy & Roadmap Definition',
      'Handover & Execution Plan'
    ],
    ctaText: 'Get Your AI Roadmap'
  },
  {
    slug: 'fractional-tpm',
    title: 'Fractional AI Technical Product Management',
    shortDescription: 'Ongoing technical product leadership for organizations that do not require a full-time senior TPM.',
    fullDescription: 'Get the expertise of a senior Technical Product Manager without the overhead of a full-time executive hire. I embed with your team to drive engineering alignment, manage the product backlog, and ensure that every technical decision is tied to a measurable business outcome.',
    targetAudience: 'Growth-stage startups and mid-market SaaS companies.',
    problemsSolved: [
      'Lack of technical leadership in the product org',
      'Inefficient engineering/product coordination',
      'Poorly defined requirements leading to rework',
      'Difficulty balancing technical debt with feature delivery'
    ],
    deliverables: [
      'Owned & Prioritized Product Backlog',
      'Detailed Acceptance Criteria',
      'Cross-functional Alignment Framework',
      'Product Performance Reporting',
      'Vendor & Technology Assessments'
    ],
    engagementProcess: [
      'Onboarding & Audit',
      'Backlog Refinement',
      'Iterative Delivery Management',
      'Stakeholder Reporting',
      'Continuous Optimization'
    ],
    ctaText: 'Secure Fractional Leadership'
  },
  {
    slug: 'solution-architecture',
    title: 'AI Solution Architecture & Implementation Advisory',
    shortDescription: 'Architecting enterprise-grade AI systems with a focus on RAG, Agentic workflows, and scalable cloud integration.',
    fullDescription: 'Designing AI systems is fundamentally different from designing traditional software. We provide the architectural blueprint for your AI application, focusing on data retrieval quality, LLM orchestration, and security, ensuring your system is scalable and maintainable.',
    targetAudience: 'CTOs, Engineering VPs, and Product Architects.',
    problemsSolved: [
      'Inefficient RAG implementations',
      'Hallucination risks in production',
      'Scaling challenges with LLM costs and latency',
      'Security and governance gaps in AI workflows'
    ],
    deliverables: [
      'AI System Architecture Diagram',
      'LLM Orchestration Strategy',
      'Data Ingestion & Retrieval Blueprint',
      'AI Evaluation Framework',
      'Cloud Deployment Plan'
    ],
    engagementProcess: [
      'Technical Audit',
      'Architecture Design',
      'Proof of Concept (PoC) Validation',
      'Production Blueprinting',
      'Implementation Oversight'
    ],
    ctaText: 'Architect Your AI System'
  },
  {
    slug: 'enterprise-search',
    title: 'Enterprise Search & AI Knowledge Systems',
    shortDescription: 'Transforming corporate knowledge into actionable intelligence through semantic and hybrid retrieval systems.',
    fullDescription: 'The biggest hurdle to enterprise AI is data access. We specialize in building the "Knowledge Layer" for your business—integrating disparate data sources into a unified, semantic search system that powers AI assistants and internal productivity.',
    targetAudience: 'Enterprise teams with large internal knowledge bases.',
    problemsSolved: [
      'Difficulty finding information across silos',
      'Poor quality internal search results',
      'Manual effort in knowledge retrieval',
      'Lack of structured AI-ready data'
    ],
    deliverables: [
      'Enterprise Search Strategy',
      'Document Ingestion Pipeline',
      'Hybrid Retrieval Architecture',
      'Search Relevance Evaluation Report',
      'Knowledge Management Roadmap'
    ],
    engagementProcess: [
      'Knowledge Audit',
      'Indexing Strategy',
      'Retrieval System Design',
      'Quality Tuning',
      'System Rollout'
    ],
    ctaText: 'Unlock Your Knowledge'
  },
  {
    slug: 'ai-audit',
    title: 'AI Product Audit & Technical Assessment',
    shortDescription: 'Structured reviews of existing AI initiatives to identify risks, gaps, and optimization opportunities.',
    fullDescription: 'Is your AI product performing as expected? We provide an unbiased, expert review of your existing AI initiatives—analyzing the product strategy, technical architecture, and output quality to provide a clear path to improvement.',
    targetAudience: 'Companies with existing AI features in production or beta.',
    problemsSolved: [
      'Stagnant AI product growth',
      'Unexpected technical bottlenecks',
      'Low user adoption of AI features',
      'Uncertainty about technical debt in AI stack'
    ],
    deliverables: [
      'Comprehensive Technical Audit Report',
      'Product Gap Analysis',
      'Architecture Review',
      'Prioritized Improvement Roadmap',
      'Performance Evaluation Framework'
    ],
    engagementProcess: [
      'Existing System Review',
      'Data & Quality Analysis',
      'Stakeholder Interviews',
      'Gap Identification',
      'Recommendation Delivery'
    ],
    ctaText: 'Audit Your AI Product'
  }
];
