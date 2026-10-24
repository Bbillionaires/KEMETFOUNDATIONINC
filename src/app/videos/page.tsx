import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoEmbed } from "@/components/video/VideoEmbed";
import { VIDEOS } from "@/lib/videos-data";
import { VIDEOS_PAGE_CONTENT } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Videos",
  description: "Videos shared by Kemet Foundation Inc.",
};

export default function VideosPage() {
  return (
    <>
      <section className="pattern-kemet bg-kemet-black py-20 text-kemet-white">
        <Container>
          <SectionHeading
            eyebrow={VIDEOS_PAGE_CONTENT.eyebrow}
            title={VIDEOS_PAGE_CONTENT.title}
            description={VIDEOS_PAGE_CONTENT.description}
            light
          />
        </Container>
      </section>

      <section className="bg-kemet-white py-16 sm:py-20">
        <Container>
          {VIDEOS.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-sm border border-kemet-gold/30 bg-kemet-ivory p-10 text-center">
              <p className="text-base leading-relaxed text-kemet-charcoal/80">
                No videos have been posted yet &mdash; check back soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-10 sm:grid-cols-2">
              {VIDEOS.map((video) => (
                <div key={video.slug}>
                  <VideoEmbed video={video} />
                  <h2 className="mt-4 font-display text-lg font-bold text-kemet-black">{video.title}</h2>
                  {video.channel && (
                    <p className="mt-1 text-sm text-kemet-charcoal/60">{video.channel}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
