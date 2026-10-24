export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  content: string;
  publishedAt: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "designing-agentic-ai-workflows-enterprise-teams",
    title: "Designing Agentic AI Workflows for Enterprise Teams",
    excerpt: "A practical framework for turning LLM capabilities into governed, multi-step enterprise workflows with real business value.",
    category: "AI Product",
    tags: ["Agentic AI", "LLM", "Enterprise SaaS", "Workflow Design"],
    publishedAt: "2025-01-18",
    readTime: "8 min read",
    content: `Agentic AI becomes useful in enterprise settings when it is designed as a workflow system, not just a chatbot.

## Start With the Job To Be Done

The right entry point is the operational workflow: what steps are repetitive, what context is required, and where a human must stay in control.

## Product Decisions That Matter

- Define where retrieval is needed versus where deterministic logic is safer
- Decide what the agent can do autonomously and what requires approval
- Design clear fallback paths when confidence is low
- Instrument the experience so you can measure adoption, completion, and trust

## Enterprise Requirements

Agentic systems need auditability, tenant-aware controls, and responsible AI guardrails. The product question is not just whether the model can do a task, but whether the workflow is safe, measurable, and commercially valuable.

The best AI product strategy turns technical capability into repeatable business outcomes.`
  },
  {
    slug: "write-prds-for-ai-products-engineering-can-build",
    title: "How to Write PRDs for AI Products That Engineering Can Actually Build",
    excerpt: "PRDs for AI systems need more than feature requests. They need clear workflows, evaluation logic, and decision boundaries.",
    category: "Product Management",
    tags: ["PRDs", "AI Product Strategy", "Requirements", "Alignment"],
    publishedAt: "2025-01-10",
    readTime: "7 min read",
    content: `AI product requirements break down when they stop at "add AI" and never define the workflow, inputs, outputs, and failure handling.

## What an AI PRD Must Clarify

- The user problem and why AI is the right mechanism
- The sources of context, retrieval, and system constraints
- What success looks like for quality, latency, and usability
- What happens when the model is uncertain or wrong
- How the feature will be evaluated before and after launch

## Translate Capability Into Product Scope

A strong AI PRD frames the user experience, the data dependencies, the guardrails, and the tradeoffs between accuracy, speed, and cost.

## Make Evaluation Part of the Requirement

If you cannot explain how a feature will be tested, benchmarked, and observed in production, the requirement is not ready.`
  },
  {
    slug: "closing-voice-of-customer-loop-enterprise-platform-products",
    title: "Closing the Voice-of-Customer Loop in Enterprise Platform Products",
    excerpt: "Enterprise platform teams win when customer feedback becomes a disciplined input to roadmap prioritization, not just support noise.",
    category: "Enterprise SaaS",
    tags: ["Voice of Customer", "Enterprise Accounts", "Roadmaps", "Retention"],
    publishedAt: "2025-01-04",
    readTime: "9 min read",
    content: `Enterprise customers tell you what is painful, but product teams still need a system for turning that signal into product decisions.

## Separate Noise From Pattern

The most useful feedback loops connect support issues, sales conversations, customer health indicators, and delivery constraints into one prioritization view.

## Product Management Questions to Ask

- Is this a one-off account request or a repeatable platform need?
- Does solving it improve retention, adoption, or operational efficiency?
- What is the product cost of not addressing it?
- What do executive stakeholders need to understand about the tradeoff?

Voice-of-customer is strongest when it improves both product judgment and organizational trust.`
  },
  {
    slug: "bridging-engineering-product-business-outcomes",
    title: "Bridging Engineering, Product, and Business Outcomes as a Technical PM",
    excerpt: "Technical fluency matters most when it improves prioritization, stakeholder alignment, and executive decision-making.",
    category: "Technical PM",
    tags: ["Technical Product Management", "Stakeholder Alignment", "Roadmaps"],
    publishedAt: "2024-12-28",
    readTime: "7 min read",
    content: `Technical Product Managers create leverage by translating between disciplines without flattening the complexity.

## Technical Depth Is Not the Goal

Technical credibility matters because it helps you ask sharper questions, challenge weak assumptions, and make better tradeoffs. It is valuable only if it improves outcomes.

## The Real TPM Leverage Points

- Clarifying requirements before they become delivery risk
- Framing platform work in business terms leadership can act on
- Translating customer needs into engineering-ready priorities
- Turning technical constraints into product decisions instead of surprises

That bridge between engineering, product, and business is where strong technical product leadership compounds.`
  },
  {
    slug: "pricing-and-packaging-enterprise-ai-saas-product",
    title: "Pricing and Packaging an Enterprise AI SaaS Product",
    excerpt: "AI product strategy is incomplete without pricing logic, customer segmentation, and a credible enterprise narrative.",
    category: "AI Product",
    tags: ["Pricing Strategy", "Enterprise SaaS", "Go-To-Market"],
    publishedAt: "2024-12-20",
    readTime: "6 min read",
    content: `Product strategy does not stop at the feature roadmap. For enterprise AI products, packaging and pricing shape how the market understands value.

## Start With Customer Segmentation

Different customers buy for different reasons. Tiers should reflect differences in workflow complexity, governance needs, service expectations, and ROI potential.

## Tie Packaging to Outcomes

The strongest packaging model connects features to business outcomes such as automation, faster resolution, better insights, or lower operating cost.

Good pricing strategy helps the product tell a commercial story before the first sales call is over.`
  },
  {
    slug: "product-metrics-that-matter-cloud-platform-teams",
    title: "The Product Metrics That Matter for Cloud and Platform Teams",
    excerpt: "Cloud and platform products need a balanced scorecard that ties reliability and delivery data to customer and business outcomes.",
    category: "Platform Products",
    tags: ["Product Metrics", "SLA", "Platform Strategy"],
    publishedAt: "2024-12-12",
    readTime: "6 min read",
    content: `Platform teams often track deep operational metrics but struggle to connect them to product outcomes.

## Start With Outcome Categories

A useful platform metric set usually covers customer adoption and account health, delivery speed and release confidence, reliability and SLA protection, and commercial or operational value created.

## Avoid Metric Silos

Deployment speed matters, but only in context. A faster release process is meaningful if it improves time-to-value, reduces escalations, or helps retain customers.

When cloud and platform metrics are tied to business outcomes, platform work becomes easier to defend, fund, and scale.`
  }
];
