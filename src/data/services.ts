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
    slug: 'product-management',
    title: 'Technical Product Management',
    shortDescription: 'Turn complex business goals into clear product direction, rigorous requirements, and an executable delivery roadmap.',
    fullDescription: 'I help product and engineering teams create clarity across discovery, prioritization, requirements, and delivery. The work connects customer needs and business outcomes to practical technical decisions without losing momentum.',
    targetAudience: 'SaaS companies, enterprise product teams, and founders building or modernizing digital products.',
    problemsSolved: ['Unclear product direction', 'Weak product and engineering alignment', 'Backlog and prioritization challenges', 'Requirements that create rework'],
    deliverables: ['Product strategy and roadmap', 'PRDs and acceptance criteria', 'Prioritized backlog', 'Outcome and KPI framework', 'Stakeholder alignment plan'],
    engagementProcess: ['Discovery', 'Product and technical assessment', 'Prioritization', 'Roadmap definition', 'Delivery support'],
    ctaText: 'Discuss Product Leadership'
  },
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
    slug: 'product-delivery',
    title: 'Product Delivery & Digital Transformation',
    shortDescription: 'Modernize workflows, align delivery teams, and turn strategic priorities into measurable product outcomes.',
    fullDescription: 'Create the operating clarity needed to move from strategy to execution through delivery planning, process improvement, vendor coordination, and change leadership.',
    targetAudience: 'Organizations improving delivery processes, modernizing operations, or launching new digital products.',
    problemsSolved: ['Slow or unpredictable delivery', 'Fragmented operating processes', 'Vendor and stakeholder misalignment', 'Transformation initiatives without measurable outcomes'],
    deliverables: ['Delivery operating model', 'Transformation roadmap', 'Cross-functional plan', 'Risk and dependency register', 'Outcome reporting'],
    engagementProcess: ['Current-state assessment', 'Future-state design', 'Delivery planning', 'Execution support', 'Measurement and handover'],
    ctaText: 'Discuss Delivery Support'
  },
  {
    slug: 'fractional-tpm',
    title: 'Fractional Technical Product Management',
    shortDescription: 'Ongoing technical product leadership for organizations that do not require a full-time senior TPM.',
    fullDescription: 'Get the expertise of a senior Technical Product Manager without the overhead of a full-time executive hire. I embed with your team to drive product and engineering alignment, manage the product backlog, and ensure that technical decisions are tied to measurable business outcomes.',
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
    title: 'Technology Advisory & Solution Architecture',
    shortDescription: 'Make sound architecture, integration, cloud, and modernization decisions for complex software and AI-enabled products.',
    fullDescription: 'I provide the architectural perspective needed to improve an existing platform or design a new one. The work covers system boundaries, APIs, cloud integration, data flows, security, and—where relevant—AI architecture.',
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
    title: 'Digital Transformation & Knowledge Systems',
    shortDescription: 'Modernize workflows, connect enterprise knowledge, and create technology systems that improve how teams operate.',
    fullDescription: 'I help organizations turn fragmented workflows and information into more effective digital systems. This may include enterprise search, knowledge platforms, process modernization, and AI-enabled productivity improvements.',
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
    title: 'Product & Technology Assessment',
    shortDescription: 'Structured reviews of existing products and technology systems to identify risks, gaps, and high-value improvements.',
    fullDescription: 'I provide an unbiased review of your product strategy, technical architecture, delivery system, and—where relevant—AI capabilities. You receive a clear view of the most important risks and a prioritized path to improvement.',
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
    ctaText: 'Request an Assessment'
  }
];
