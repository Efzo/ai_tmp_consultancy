const steps = [
  { title: "Discover", description: "Define the problem, understand the users, and assess feasibility." },
  { title: "Design", description: "Set the product direction, architecture, and delivery plan." },
  { title: "Build", description: "Implement the agreed scope with regular reviews and feedback." },
  { title: "Launch", description: "Test the solution and prepare for deployment and handover." },
  { title: "Improve", description: "Review performance, gather feedback, and prioritize what comes next." },
];
export default function Process({ content }: { content: { title: string; subheadline: string } }) {
  return <section className="section-shell section-tint"><div className="section-inner"><div className="section-heading"><h2 className="section-title">{content.title}</h2><p className="section-intro">{content.subheadline}</p></div><ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-5">{steps.map((step, index) => <li className="process-step" key={step.title}><span className="process-step-number">0{index + 1}</span><h3 className="mb-3 mt-5 text-xl">{step.title}</h3><p className="text-sm text-slate-muted">{step.description}</p></li>)}</ol></div></section>;
}
