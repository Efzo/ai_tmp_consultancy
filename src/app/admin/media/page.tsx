import { AdminModule } from "@/components/admin/AdminModule";
import MediaUploader from "@/components/admin/MediaUploader";
import { prisma } from "@/lib/prisma";

async function getAssets() {
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return [];
  try { return await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 50 }); } catch { return []; }
}

export default async function MediaAdminPage() {
  const assets = await getAssets();
  return <AdminModule title="Media library" description="Upload and reuse approved images and documents." status={process.env.BLOB_READ_WRITE_TOKEN ? "Storage configured" : "Storage required"}><div className="grid gap-8 lg:grid-cols-[360px_1fr]"><MediaUploader /><div className="glass-panel p-6"><h2 className="text-xl font-bold">Uploaded assets</h2>{assets.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2">{assets.map((asset) => <div key={asset.id} className="rounded-xl border border-glass bg-white/5 p-4"><p className="truncate text-sm font-medium">{asset.filename}</p><p className="mt-2 text-xs text-slate-muted">{asset.altText}</p><a href={asset.url} target="_blank" rel="noreferrer" className="mt-4 inline-block text-xs text-cyan-ai">Open asset →</a></div>)}</div> : <p className="mt-4 text-sm leading-relaxed text-slate-muted">No assets are stored yet. Configure Vercel Blob, PostgreSQL, and upload an approved asset.</p>}</div></div></AdminModule>;
}
