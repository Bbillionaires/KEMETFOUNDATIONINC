import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { MISSION_TEASER_CONTENT } from "@/lib/site-content";

export function MissionTeaser() {
  return (
    <section className="bg-kemet-white py-20">
      <Container>
        <SectionHeading
          eyebrow={MISSION_TEASER_CONTENT.eyebrow}
          title={MISSION_TEASER_CONTENT.title}
          description={MISSION_TEASER_CONTENT.description}
        />
        <div className="mt-8 flex justify-center">
          <LinkButton href="/mission" variant="outline" size="md" className="border-kemet-gold-deep text-kemet-black hover:bg-kemet-gold/10">
            Read Our Full Mission
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
