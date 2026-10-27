import { notFound, redirect } from "next/navigation";
import ManagedPageEditor from "@/components/admin/ManagedPageEditor";
import { prisma } from "@/lib/prisma";
import { isSiteSettingsDatabaseReady } from "@/lib/site-settings";
import { getPageDefaults, isManagedPageSlug, parsePageContent } from "@/lib/page-content-schema";
export default async function PageEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "pricing") redirect("/admin/pages/engagements");
  if (!isManagedPageSlug(slug)) notFound();
  const ready = isSiteSettingsDatabaseReady();
  const page = ready ? await prisma.page.findUnique({ where: { slug }, include: { versions: { orderBy: { version: "desc" }, take: 10 } } }).catch(() => null) : null;
  const parsed = parsePageContent(slug, page?.content);
  return <ManagedPageEditor key={`${slug}-${page?.updatedAt.toISOString() ?? "new"}`} slug={slug} ready={ready} id={page?.id} revision={page?.versions[0]?.version ?? 0} content={parsed.success ? parsed.data : getPageDefaults(slug)} metaTitle={page?.metaTitle ?? ""} metaDescription={page?.metaDescription ?? ""} status={page?.status ?? "Original website content"} versions={page?.versions.map((version) => ({ id: version.id, version: version.version, createdAt: version.createdAt.toISOString() })) ?? []} />;
}
