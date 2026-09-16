import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { getSiteContentMap } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Mission",
  description:
    "The mission, vision, and core principles of Kemet Foundation Inc: African heritage and cultural education, community development, and economic empowerment.",
};

const FALLBACKS = {
  mission_statement:
    "Kemet Foundation Inc exists to uplift our community by reconnecting people with African heritage and cultural education, strengthening families, and building pathways to economic empowerment. We are committed to community development and collective advancement, working alongside the people we serve to build institutions that last.",
  vision_statement:
    "We envision a community where African heritage is celebrated and passed down with pride, where families are strong and supported, and where economic opportunity and quality education are within reach for everyone. We see a future built on collective advancement, entrepreneurship, and the sustainable institutions our community deserves.",
  core_principles:
    "African Heritage & Cultural Education — honoring and teaching the history and culture that shape our identity\nCommunity Development — investing in the people and places that make our community strong\nFamily & Community Strengthening — supporting the bonds that hold families and neighborhoods together\nEconomic Empowerment & Entrepreneurship — equipping people with tools to build stability and opportunity\nEducation & Youth Development — preparing the next generation to lead\nCommunity Service — showing up for one another in tangible, consistent ways",
  why_kemet:
    "Kemet Foundation Inc takes its name from the ancient name for the land now known as Egypt, a reminder of the depth and richness of African heritage. We believe that understanding where we come from strengthens our ability to build where we are going. Our work is grounded in the belief that cultural pride, education, and economic self-sufficiency are inseparable parts of community advancement.",
  our_approach:
    "We approach our work by listening to and partnering with the community we serve, focusing on education, family strengthening, and economic empowerment as the foundation for lasting change. Rather than working in isolation, we build toward sustainable institutions designed to serve our community for generations, guided by our members and grounded in collective action.",
  community_impact:
    "Our impact is measured in the families strengthened, the heritage preserved and passed on, and the opportunities created through education and economic empowerment. As a growing organization, we are committed to building sustainable institutions whose impact will be felt for generations, and we invite our community to grow with us.",
} as const;

export default async function MissionPage() {
  const content = await getSiteContentMap(FALLBACKS);
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
            Our Mission
          </p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Heritage, Family, and Empowerment
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
