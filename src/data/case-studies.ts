export interface CaseStudy {
  slug: string;
  title: string;
  category: string;
  summary: string;
  challenge: string;
  solution: string;
  outcome: string;
  technicalDecisions: string[];
  metrics: { label: string; value: string }[];
  image?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'clinchdesk-ai-platform',
    title: 'ClinchDesk: AI-Powered SaaS Platform',
    category: 'AI SaaS Platform',
    summary: 'Leading the product roadmap and technical architecture for a multi-tenant AI platform focused on enterprise productivity.',
    challenge: 'The challenge was to bridge the gap between a complex AI feature set and a seamless, multi-tenant enterprise experience that ensured data isolation while maximizing the utility of LLM-powered agents.',
    solution: 'Implemented a rigorous product roadmap focused on tenant isolation strategy, administrative workflows, and a modular AI feature set. Defined the pricing architecture and enterprise readiness plan to ensure the platform could scale from early adopters to enterprise clients.',
    outcome: 'Established a production-ready product framework that allows for rapid AI feature iteration while maintaining strict enterprise security and scalability standards.',
    technicalDecisions: [
      'Architected multi-tenant isolation to ensure zero data leakage between enterprise clients',
      'Defined a modular LLM integration layer to prevent vendor lock-in',
      'Implemented a structured AI evaluation framework to measure response quality and hallucination risks',
      'Designed a scalable admin portal for tenant management and feature flagging'
    ],
    metrics: [
      { label: 'Tenant Isolation', value: '100% Secure' },
      { label: 'Feature Velocity', value: '3x Increase' },
      { label: 'Enterprise Readiness', value: 'Production Ready' }
    ]
  },
  {
    slug: 'enterprise-cloud-modernization',
    title: 'Cloud Platform Modernization Initiative',
    category: 'Platform Modernization',
    summary: 'Directing requirements translation and technical roadmapping for high-scale enterprise cloud and ERP integration.',
    challenge: 'Modernizing legacy enterprise workflows without disrupting critical business operations, while integrating complex ERP systems into a modern cloud architecture.',
    solution: 'Served as the primary bridge between business stakeholders and engineering teams, translating vague business requirements into high-fidelity PRDs and technical roadmaps. Focused on reliability planning and SLA-aware product delivery.',
    outcome: 'Reduced deployment friction and improved system reliability across enterprise Azure platform engagements, leading to higher client retention.',
    technicalDecisions: [
      'Developed a phased migration strategy to reduce operational risk during modernization',
      'Implemented SLA-aware delivery pipelines to ensure 99.9%+ uptime',
      'Designed integration patterns for legacy ERP systems to sync with cloud-native microservices',
      'Established a cross-functional alignment framework for executive reporting'
    ],
    metrics: [
      { label: 'Client Retention', value: '25% Increase' },
      { label: 'SLA Uptime', value: '99.9%+' },
      { label: 'Deployment Time', value: '87% Reduction' }
    ]
  },
  {
    slug: 'agentic-ai-workflow-concept',
    title: 'Agentic AI Enterprise Workflow Assistant',
    category: 'Agentic AI Concept',
    summary: 'Strategic architecture for an AI assistant automating multi-step enterprise workflows with human-in-the-loop oversight.',
    challenge: 'Designing an agentic system that could handle complex, non-linear business processes without sacrificing reliability or safety.',
    solution: 'Designed a conceptual architecture utilizing RAG for context injection, tool-use for action execution, and a strict human-in-the-loop (HITL) verification layer for critical decision points.',
    outcome: 'Provided a validated blueprint for automating high-friction enterprise tasks, reducing manual processing time by an estimated 85%.',
    technicalDecisions: [
      'Designed a state-machine based agent orchestration to handle multi-step workflows',
      'Integrated RAG to ground agent actions in proprietary enterprise knowledge',
      'Implemented a verification gateway for high-risk AI actions',
      'Designed a feedback loop for continuous improvement of agent prompts'
    ],
    metrics: [
      { label: 'Manual Effort', value: '85% Reduction' },
      { label: 'Process Speed', value: '10x Faster' },
      { label: 'Accuracy', value: 'High-Confidence' }
    ]
  }
];
