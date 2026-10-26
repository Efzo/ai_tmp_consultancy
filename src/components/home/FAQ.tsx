export default function FAQ({ content }: { content: { title: string; items: { q: string; a: string }[] } }) {
  return <section className="section-shell"><div className="section-inner grid gap-8 lg:grid-cols-[.7fr_1fr]"><h2 className="section-title">{content.title}</h2><div>{content.items.map((item, index) => <div className="faq-item" key={index}><h3 className="mb-3 text-lg">{item.q}</h3><p className="text-slate-muted">{item.a}</p></div>)}</div></div></section>;
}
