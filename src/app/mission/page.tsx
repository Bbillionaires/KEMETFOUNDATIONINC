import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { MISSION_PAGE_CONTENT } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Our Mission",
  description:
    "The mission, vision, and core principles of Kemet Foundation Inc: African heritage and cultural education, community development, and economic empowerment.",
};

export default function MissionPage() {
  const content = MISSION_PAGE_CONTENT;
  const corePrinciples = content.core_principles
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      <section className="relative overflow-hidden border-b border-kemet-gold/20 bg-kemet-black pattern-kemet py-20 text-center text-kemet-white">
        <div className="absolute inset-0 bg-kemet-radial" aria-hidden="true" />
        <Container className="relative">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-kemet-gold">
            {content.heroEyebrow}
          </p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            {content.heroTitle}
          </h1>
        </Container>
      </section>

      <section className="bg-kemet-white py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <Card>
            <SectionHeading eyebrow="Mission" title="Our Mission" align="left" />
            <p className="mt-6 text-base leading-relaxed text-kemet-charcoal/85">
              {content.mission_statement}
            </p>
          </Card>
          <Card>
            <SectionHeading eyebrow="Vision" title="Our Vision" align="left" />
            <p className="mt-6 text-base leading-relaxed text-kemet-charcoal/85">
              {content.vision_statement}
            </p>
          </Card>
        </Container>
      </section>

      <section className="bg-kemet-ivory py-20">
        <Container>
          <SectionHeading eyebrow="What We Stand For" title="Core Principles" />
          <ul className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            {corePrinciples.map((principle) => (
              <li
                key={principle}
                className="rounded-sm border border-kemet-gold/30 bg-kemet-white p-5 text-sm leading-relaxed text-kemet-charcoal/85"
              >
                {principle}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-kemet-white py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Our Story" title="Why Kemet" align="left" />
          <p className="mt-6 text-base leading-relaxed text-kemet-charcoal/85">
            {content.why_kemet}
          </p>
        </Container>
      </section>

      <section className="bg-kemet-ivory py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="How We Work" title="Our Approach" align="left" />
          <p className="mt-6 text-base leading-relaxed text-kemet-charcoal/85">
            {content.our_approach}
          </p>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-kemet-green py-20 text-kemet-white">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Looking Ahead"
            title="Community Impact"
            align="left"
            light
          />
          <p className="mt-6 text-base leading-relaxed text-kemet-ivory/90">
            {content.community_impact}
          </p>
        </Container>
      </section>
    </>
  );
}
