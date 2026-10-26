import Link from "next/link";
export default function FinalCTA({ content }: { content: { title: string; text: string; cta: string; href?: string } }) {
  return <section className="section-shell section-tint"><div className="section-inner flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center"><div><h2 className="section-title">{content.title}</h2><p className="section-intro">{content.text}</p></div><Link href={content.href ?? "/book"} className="btn-primary shrink-0">{content.cta}<span aria-hidden="true">↗</span></Link></div></section>;
}
