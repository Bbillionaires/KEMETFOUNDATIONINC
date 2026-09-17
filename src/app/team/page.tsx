import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the team behind Kemet Foundation Inc.",
};

export default async function TeamPage() {
  const teamMembers = await safeQuery(
    () =>
      prisma.teamMember.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
    []
  );

  return (
    <section className="bg-kemet-white py-20">
      <Container>
        <SectionHeading eyebrow="Our Team" title="The People Behind Kemet Foundation" />

        {teamMembers.length === 0 ? (
          <p className="mx-auto mt-12 max-w-md text-center text-sm leading-relaxed text-kemet-charcoal/70">
            Our team page is being updated. Check back soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <Card key={member.id} className="text-center">
                <h2 className="font-display text-lg font-bold text-kemet-black">{member.name}</h2>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-kemet-gold-deep">
                  {member.title}
                </p>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
