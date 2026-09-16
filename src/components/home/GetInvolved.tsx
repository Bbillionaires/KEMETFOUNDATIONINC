import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

const options = [
  {
    title: "Volunteer",
    description: "Give your time and talents to support our community's work.",
    href: "/contact",
    cta: "Get in Touch",
  },
  {
    title: "Become a Member",
    description: "Join our community and help guide the direction of our work.",
    href: "/membership/register",
    cta: "Join Us",
  },
  {
    title: "Donate",
    description: "Support our mission with a one-time or recurring gift.",
    href: "/donate",
    cta: "Give Now",
  },
] as const;

export function GetInvolved() {
  return (
    <section className="bg-kemet-white py-20">
      <Container>
        <SectionHeading eyebrow="Get Involved" title="Ways to Support the Mission" />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {options.map((option) => (
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
