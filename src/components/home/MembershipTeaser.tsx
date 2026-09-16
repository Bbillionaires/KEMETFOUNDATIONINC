import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export function MembershipTeaser() {
  return (
    <section className="bg-kemet-green py-20 text-kemet-white">
      <Container className="flex flex-col items-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-kemet-gold">
          Membership
        </p>
        <h2 className="font-display max-w-2xl text-3xl font-bold sm:text-4xl">
          Join a Community Committed to Collective Advancement
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-kemet-ivory/90">
          Membership connects you with others working toward the same goals: strengthening
          families, supporting economic empowerment, and passing on African heritage to the next
          generation. Members help shape our work and stand alongside a community invested in
          building something lasting.
        </p>
        <LinkButton href="/membership/register" size="lg">
          Become a Member
        </LinkButton>
      </Container>
    </section>
  );
}
