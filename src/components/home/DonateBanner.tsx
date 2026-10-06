import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { DONATE_BANNER_CONTENT } from "@/lib/site-content";

export function DonateBanner() {
  return (
    <section className="relative overflow-hidden bg-kemet-black pattern-kemet py-16 text-kemet-white">
      <div className="absolute inset-0 bg-kemet-radial" aria-hidden="true" />
      <Container className="relative flex flex-col items-center gap-5 text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          {DONATE_BANNER_CONTENT.title}
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-kemet-ivory/80 sm:text-base">
          {DONATE_BANNER_CONTENT.body}
        </p>
        <LinkButton href="/donate" size="lg">
          Donate Now
        </LinkButton>
      </Container>
    </section>
  );
}
