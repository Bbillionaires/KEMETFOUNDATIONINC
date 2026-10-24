import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VIDEO_SECTION_CONTENT } from "@/lib/site-content";

export function VideoSection() {
  return (
    <section className="bg-kemet-black py-20 text-kemet-white">
      <Container>
        <SectionHeading
          eyebrow={VIDEO_SECTION_CONTENT.eyebrow}
          title={VIDEO_SECTION_CONTENT.title}
          light
        />
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-md border border-kemet-gold/30 shadow-gold">
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_SECTION_CONTENT.youtubeId}`}
              title={VIDEO_SECTION_CONTENT.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
