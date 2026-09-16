import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Donor Recognition Wall",
  description: `With gratitude to the donors who support ${SITE_NAME}'s mission.`,
};

export default async function DonorWallPage() {
  // Only donor names are ever shown here — never amounts, never emails.
  const donors = await prisma.donation.findMany({
    where: { status: "SUCCEEDED", publicRecognition: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, donorName: true },
  });

  return (
    <section className="bg-kemet-white py-20">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="With Gratitude"
          title="Donor Recognition Wall"
          description="We're honored to recognize the generous supporters who make our mission possible."
        />

        {donors.length === 0 ? (
          <div className="mx-auto mt-12 max-w-md text-center">
            <p className="text-sm leading-relaxed text-kemet-charcoal/70">
              Be the first to support our mission.
            </p>
            <LinkButton href="/donate" className="mt-6">
              Donate Now
            </LinkButton>
          </div>
        ) : (
          <>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {donors.map((donor) => (
                <Card key={donor.id} className="text-center">
                  <p className="font-display text-base font-bold text-kemet-black">
                    {donor.donorName}
                  </p>
                </Card>
              ))}
            </div>
            <p className="mt-10 text-center text-sm text-kemet-charcoal/70">
              <Link href="/donate" className="font-semibold text-kemet-gold-deep hover:underline">
                Join them and make a gift
              </Link>
            </p>
          </>
        )}
      </Container>
    </section>
  );
}
