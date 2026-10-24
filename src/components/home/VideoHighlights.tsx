import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { VideoEmbed } from "@/components/video/VideoEmbed";
import { getFeaturedVideos } from "@/lib/videos-data";
import { VIDEO_HIGHLIGHTS_CONTENT } from "@/lib/site-content";

export function VideoHighlights() {
  const videos = getFeaturedVideos(1);

  if (videos.length === 0) return null;

  return (
    <section className="bg-kemet-black py-20 text-kemet-white">
      <Container>
        <SectionHeading
          eyebrow={VIDEO_HIGHLIGHTS_CONTENT.eyebrow}
          title={VIDEO_HIGHLIGHTS_CONTENT.title}
          light
        />
        <div className="mx-auto mt-10 max-w-3xl space-y-8">
          {videos.map((video) => (
            <VideoEmbed key={video.slug} video={video} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <LinkButton
            href="/videos"
            variant="outline"
            size="md"
            className="!text-kemet-white !border-kemet-gold hover:!bg-kemet-gold/10"
          >
            View All Videos
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
