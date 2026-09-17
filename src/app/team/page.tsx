import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { TEAM_MEMBERS } from "@/lib/team-data";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the team behind Kemet Foundation Inc.",
};

export default function TeamPage() {
  return (
    <section className="bg-kemet-white py-20">
      <Container>
        <SectionHeading eyebrow="Our Team" title="The People Behind Kemet Foundation" />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM_MEMBERS.map((member) => (
            <Card key={member.name} className="text-center">
              <h2 className="font-display text-lg font-bold text-kemet-black">{member.name}</h2>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-kemet-gold-deep">
                {member.title}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
