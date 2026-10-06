import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { PILLARS_CONTENT } from "@/lib/site-content";

export function Pillars() {
  return (
    <section className="bg-kemet-ivory py-20">
      <Container>
        <SectionHeading
          eyebrow={PILLARS_CONTENT.eyebrow}
          title={PILLARS_CONTENT.title}
          description={PILLARS_CONTENT.description}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {PILLARS_CONTENT.pillars.map((pillar) => (
            <Card key={pillar.title} className="flex flex-col items-center text-center">
              <div className="mb-4 h-px w-12 bg-gold-gradient" aria-hidden="true" />
              <h3 className="font-display text-xl font-bold text-kemet-black">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-kemet-charcoal/80">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
