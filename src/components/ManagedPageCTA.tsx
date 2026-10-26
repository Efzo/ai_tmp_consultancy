import Link from "next/link";
export default function ManagedPageCTA({ content }: { content: { title: string; description: string; primaryText: string; primaryUrl: string; secondaryText: string; secondaryUrl: string } }) {
  return <section className="mt-16 border-t border-glass pt-12"><div className="mx-auto max-w-3xl"><h2 className="section-title mb-5">{content.title}</h2><p className="section-intro mb-7">{content.description}</p><div className="flex flex-col gap-3 sm:flex-row"><Link href={content.primaryUrl} className="btn-primary">{content.primaryText}</Link>{content.secondaryText && content.secondaryUrl && <Link href={content.secondaryUrl} className="btn-secondary">{content.secondaryText}</Link>}</div></div></section>;
}
