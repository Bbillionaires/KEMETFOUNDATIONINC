import type { VideoRecord } from "@/lib/videos-data";

export function VideoEmbed({ video }: { video: VideoRecord }) {
  return (
    <div className="overflow-hidden rounded-md border border-kemet-gold/30 shadow-gold">
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
