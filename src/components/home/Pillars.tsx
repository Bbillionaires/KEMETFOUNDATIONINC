import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

const pillars = [
  {
    title: "Community",
    description:
      "We bring people together around shared heritage and shared purpose, strengthening the bonds of family and community that sustain us across generations.",
  },
  {
    title: "Economic Empowerment",
    description:
      "We encourage entrepreneurship and economic self-sufficiency, equipping individuals and families with the tools to build stability and pursue opportunity.",
  },
  {
    title: "Education",
    description:
      "We champion African heritage and cultural education alongside youth development, helping our community learn, grow, and lead with knowledge of who they are.",
  },
] as const;

export function Pillars() {
  return (
    <section className="bg-kemet-ivory py-20">
      <Container>
        <SectionHeading
          eyebrow="What We Do"
          title="Three Pillars of Our Work"
          description="Everything we do is grounded in African heritage and cultural education, community development, and economic empowerment."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {pillars.map((pillar) => (
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
