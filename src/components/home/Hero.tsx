import { LogoIntro } from "@/components/brand/LogoIntro";
import { LinkButton } from "@/components/ui/Button";
import { HERO_CONTENT } from "@/lib/site-content";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-kemet-gold/20 bg-kemet-black pattern-kemet">
      <div className="absolute inset-0 bg-kemet-radial" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-20 text-center sm:px-6 lg:flex-row lg:gap-16 lg:py-28 lg:text-left">
        <div className="w-full max-w-md lg:w-5/12">
          <LogoIntro />
        </div>

        <div className="lg:w-7/12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-kemet-gold">
            {HERO_CONTENT.eyebrow}
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-kemet-white sm:text-5xl lg:text-6xl">
            {HERO_CONTENT.headingLines[0]}
            <br />
            {HERO_CONTENT.headingLines[1]}
            <br />
            <span className="text-kemet-gold">{HERO_CONTENT.headingLines[2]}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-kemet-ivory/80 lg:mx-0">
            {HERO_CONTENT.body}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <LinkButton href="/membership" size="lg">
              Become a Member
            </LinkButton>
            <LinkButton
              href="/events"
              variant="outline"
              size="lg"
              className="!text-kemet-white !border-kemet-gold hover:!bg-kemet-gold/10"
            >
              View Events
            </LinkButton>
            <LinkButton href="/donate" variant="secondary" size="lg">
              Support the Mission
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
