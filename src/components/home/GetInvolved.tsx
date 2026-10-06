import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { GET_INVOLVED_CONTENT } from "@/lib/site-content";

export function GetInvolved() {
  return (
    <section className="bg-kemet-white py-20">
      <Container>
        <SectionHeading eyebrow={GET_INVOLVED_CONTENT.eyebrow} title={GET_INVOLVED_CONTENT.title} />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {GET_INVOLVED_CONTENT.options.map((option) => (
            <Card key={option.title} className="flex flex-col items-center text-center">
              <h3 className="font-display text-xl font-bold text-kemet-black">{option.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-kemet-charcoal/80">
                {option.description}
              </p>
              <LinkButton href={option.href} variant="outline" size="sm" className="mt-6 border-kemet-gold-deep text-kemet-black hover:bg-kemet-gold/10">
                {option.cta}
              </LinkButton>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
