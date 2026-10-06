import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { MEMBERSHIP_TEASER_CONTENT } from "@/lib/site-content";

export function MembershipTeaser() {
  return (
    <section className="bg-kemet-green py-20 text-kemet-white">
      <Container className="flex flex-col items-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-kemet-gold">
          {MEMBERSHIP_TEASER_CONTENT.eyebrow}
        </p>
        <h2 className="font-display max-w-2xl text-3xl font-bold sm:text-4xl">
          {MEMBERSHIP_TEASER_CONTENT.title}
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-kemet-ivory/90">
          {MEMBERSHIP_TEASER_CONTENT.body}
        </p>
        <LinkButton href="/membership" size="lg">
          Become a Member
        </LinkButton>
      </Container>
    </section>
  );
}
