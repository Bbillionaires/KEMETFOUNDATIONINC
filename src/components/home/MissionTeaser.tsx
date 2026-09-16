import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";

export function MissionTeaser() {
  return (
    <section className="bg-kemet-white py-20">
      <Container>
        <SectionHeading
          eyebrow="Our Mission"
          title="Rooted in Heritage. Driven by Purpose."
          description="Kemet Foundation Inc exists to connect our community to African heritage and cultural education while building the economic, educational, and family foundations that make lasting advancement possible."
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
