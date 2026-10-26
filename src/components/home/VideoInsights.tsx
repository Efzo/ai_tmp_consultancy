import React from 'react';

interface Video {
  title: string;
  description: string;
  url: string;
  category: string;
}

interface VideoInsightsProps {
  content: {
    title?: string;
    subheadline?: string;
    videos: Video[];
  };
}

function getEmbedUrl(url: string) {
  if (url.includes('youtube.com/watch?v=')) {
    return { type: 'iframe', url: url.replace('watch?v=', 'embed/') };
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('/').pop();
    return { type: 'iframe', url: `https://www.youtube.com/embed/${id}` };
  }
  if (url.includes('vimeo.com/') || url.includes('player.vimeo.com')) {
    const id = url.split('/').pop();
    return { type: 'iframe', url: `https://player.vimeo.com/video/${id}` };
  }
  if (url.match(/\.(mp4|webm|ogg)$/i) || url.includes('blob.vercel-storage.com')) {
    return { type: 'video', url: url };
  }
  return { type: 'iframe', url: url };
}

export default function VideoInsights({ content }: VideoInsightsProps) {
  if (!content || !content.videos || content.videos.length === 0) return null;

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {content.title && (
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              {content.title}
            </h2>
            {content.subheadline && (
              <p className="text-slate-muted text-xl max-w-3xl mx-auto">
                {content.subheadline}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {content.videos.map((video, idx) => {
            const { type, url } = getEmbedUrl(video.url);
            return (
              <div key={idx} className="glass-card overflow-hidden group">
                <div className="aspect-video relative bg-midnight">
                  {type === 'iframe' ? (
                    <iframe 
                      src={url} 
                      className="absolute inset-0 w-full h-full" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    />
                  ) : (
                    <video 
                      src={url} 
                      controls 
                      className="absolute inset-0 w-full h-full object-cover"
                      preload="none"
                    />
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-electric bg-electric/10 px-3 py-1 rounded-full border border-electric/20">
                      {video.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">{video.title}</h3>
                  <p className="text-slate-muted leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
