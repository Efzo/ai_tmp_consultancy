import Image from "next/image";
import ProductPreview from "@/components/ProductPreview";
import type { CaseDetails } from "@/lib/case-details";

export default function CaseStudyShowcase({ title, images, details, assets = [] }: {
  title: string; images: string[]; details?: CaseDetails; assets?: { id: string; altText: string | null }[];
}) {
  const hasPreview = details?.showEmbed && details.embedUrl;
  return <section className="mt-16 space-y-6" aria-labelledby="project-showcase">
    <div className="flex flex-wrap items-center justify-between gap-4"><h2 id="project-showcase" className="text-2xl font-bold">Screenshots & product preview</h2>{details?.productUrl && <a href={details.productUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">Visit product ↗</a>}</div>
    {images.length > 0 && <div className="grid gap-6 sm:grid-cols-2">{images.map((url, index) => {
      const metadata = details?.screenshots.find((item) => item.url === url);
      const alt = metadata?.alt || assets.find((asset) => `/api/media/${asset.id}` === url)?.altText || `${title} product screenshot ${index + 1}`;
      return <figure key={url} className={`overflow-hidden rounded-2xl border border-glass ${index === 0 ? "sm:col-span-2" : ""}`}><a href={url} target="_blank" rel="noopener noreferrer" aria-label={`View full screenshot: ${alt}`}><Image src={url} alt={alt} width={1200} height={800} sizes={index === 0 ? "(max-width: 896px) 100vw, 896px" : "(max-width: 639px) 100vw, 448px"} unoptimized className="h-auto w-full bg-white/5 object-contain" /></a>{metadata?.caption && <figcaption className="border-t border-glass px-5 py-4 text-sm text-slate-muted">{metadata.caption}</figcaption>}</figure>;
    })}</div>}
    {hasPreview && <ProductPreview url={details.embedUrl} title={title} />}
    {!images.length && !hasPreview && !details?.productUrl && <p className="glass-card p-6 text-slate-muted">Screenshots are not available. The written overview describes the documented project scope.</p>}
  </section>;
}
