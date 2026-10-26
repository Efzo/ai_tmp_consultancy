import { AdminModule } from "@/components/admin/AdminModule";
import MediaUploader from "@/components/admin/MediaUploader";
import MediaAssetList from "@/components/admin/MediaAssetList";
import { prisma } from "@/lib/prisma";

async function getAssets() {
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return [];
  try { return await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 50 }); } catch { return []; }
}

export default async function MediaAdminPage() {
  const assets = await getAssets();
  const storageReady = Boolean(process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_READ_WRITE_TOKEN.includes("demo_"));
  return <AdminModule title="Images & Files" description="Upload, review, and remove approved images and documents." status={storageReady ? "Storage configured" : "Storage required"}><div className="grid gap-8 lg:grid-cols-[360px_1fr]"><MediaUploader /><div className="glass-panel p-6"><h2 className="text-xl font-bold">Uploaded assets</h2>{!storageReady && <p className="mt-3 text-sm text-amber-200">Add a real BLOB_READ_WRITE_TOKEN to the Vercel Production environment before uploading.</p>}<MediaAssetList assets={assets} /></div></div></AdminModule>;
}
