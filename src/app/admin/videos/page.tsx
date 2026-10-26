import { AdminModule } from "@/components/admin/AdminModule";
import VideoEditor from "@/components/admin/VideoEditor";
import { getVideoInsights } from "@/app/actions/videos";

export const dynamic = "force-dynamic";

export default async function VideosAdminPage() {
  const videos = await getVideoInsights();
  return (
    <AdminModule
      title="Videos"
      description="Manage the strategic video briefs that build trust and explain your delivery model."
      status={`${videos.length} videos`}
    >
      <VideoEditor videos={videos} />
    </AdminModule>
  );
}
