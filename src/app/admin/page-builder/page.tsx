import PageBuilder from "@/components/admin/PageBuilder";
import { prisma } from "@/lib/prisma";

async function getPage(slug: string) {
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return null;
  try { return await prisma.page.findUnique({ where: { slug }, include: { versions: { orderBy: { version: "desc" }, take: 10 } } }); } catch { return null; }
}

export default async function PageBuilderPage({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  const { slug = "home" } = await searchParams;
  const page = await getPage(slug);
  return <PageBuilder initialPage={page ? { id: page.id, slug: page.slug, title: page.title, content: page.content, metaTitle: page.metaTitle, metaDescription: page.metaDescription } : undefined} initialVersions={page?.versions.map((version) => ({ id: version.id, version: version.version, title: version.title, createdAt: version.createdAt.toISOString() }))} />;
}
