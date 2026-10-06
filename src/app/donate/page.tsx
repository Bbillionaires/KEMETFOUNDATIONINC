import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { DonateForm } from "@/components/forms/DonateForm";
import { SITE_NAME } from "@/lib/constants";
import { DONATE_PAGE_CONTENT } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Donate",
  description: `Support ${SITE_NAME}'s work in African heritage and cultural education, community development, and economic empowerment with a one-time or monthly gift.`,
};

export default function DonatePage() {
  return (
    <section className="bg-kemet-white py-20">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Give"
          title={DONATE_PAGE_CONTENT.title}
          description={DONATE_PAGE_CONTENT.description}
        />

        <Card className="mt-14">
          <DonateForm />
        </Card>

        <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-kemet-charcoal/60">
          {SITE_NAME} {DONATE_PAGE_CONTENT.acknowledgmentNotice}
        </p>
      </Container>
    </section>
  );
}
