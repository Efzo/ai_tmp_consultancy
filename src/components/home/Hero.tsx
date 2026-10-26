import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  content: { title: string; subheadline: string; primaryCta: string; primaryHref?: string; secondaryCta: string; contactCta?: string; contactHref?: string };
  portrait?: { url: string; alt: string };
}
export default function Hero({ content, portrait }: HeroProps) {
  return <section className="hero-section">
    <div className={`hero-content ${portrait ? "hero-with-portrait" : ""}`}>
      <div>
        <span className="section-eyebrow">Independent Technology & Product Consulting</span>
        <h1 className="hero-title">{content.title.split(/(\S+-\S+)/g).map((part, index) => /^(\S+-\S+)$/.test(part) ? <span key={index} className="sm:whitespace-nowrap">{part}</span> : part)}</h1>
        <p className="hero-intro">{content.subheadline}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link href={content.primaryHref ?? "/book"} className="btn-primary">{content.primaryCta}<span aria-hidden="true">↗</span></Link>
          <Link href="/services" className="btn-secondary">{content.secondaryCta}</Link>
          <Link href={content.contactHref ?? "/contact"} className="btn-secondary">{content.contactCta ?? "Contact"}</Link>
        </div>
      </div>
      {portrait && <figure className="hero-portrait mt-10 lg:mt-0"><Image src={portrait.url} alt={portrait.alt} width={440} height={550} unoptimized priority /><figcaption>Efosa Ojomo · Product strategy & software engineering</figcaption></figure>}
    </div>
  </section>;
}
