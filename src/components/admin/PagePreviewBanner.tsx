import Link from "next/link";
import { canPreviewPages } from "@/lib/managed-pages";
import type { ManagedPageSlug } from "@/lib/page-content-schema";
export default async function PagePreviewBanner({ slug }: { slug: ManagedPageSlug | "home" }) {
  if (!await canPreviewPages()) return null;
  return <aside aria-label="Draft preview" className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 rounded-xl border border-electric bg-midnight p-4 text-sm text-white shadow-xl"><p><strong>Draft preview</strong> · Unpublished content, visible only to you.</p><div className="flex gap-4"><Link href={slug === "home" ? "/admin/page-builder" : `/admin/pages/${slug}`} className="text-cyan-ai">Back to editor</Link><a href={`/api/admin/preview?slug=${slug}&disable=1`} className="text-cyan-ai">Exit preview</a></div></aside>;
}
