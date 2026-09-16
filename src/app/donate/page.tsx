import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { DonateForm } from "@/components/forms/DonateForm";
import { getSiteContent } from "@/lib/site-content";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Donate",
  description: `Support ${SITE_NAME}'s work in African heritage and cultural education, community development, and economic empowerment with a one-time or monthly gift.`,
};

export default async function DonatePage() {
  const [taxExemptValue, customDisclaimer] = await Promise.all([
    getSiteContent("org_tax_exempt", "false"),
    getSiteContent("org_tax_disclaimer", ""),
  ]);

  const isTaxExempt = taxExemptValue === "true";
  const disclaimer =
    customDisclaimer.trim() ||
    (isTaxExempt
      ? `Your donation may be tax-deductible to the extent allowed by law; please consult your tax advisor. ${SITE_NAME} will provide a donation acknowledgment for your records.`
      : `${SITE_NAME} will provide a donation acknowledgment for your records. Please contact us regarding the tax-deductibility of your gift.`);

  return (
    <section className="bg-kemet-white py-20">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Give"
          title="Support Our Mission"
          description="Your gift helps us invest in African heritage and cultural education, community development, family strengthening, and economic empowerment."
        />

        <Card className="mt-14">
          <DonateForm />
        </Card>

        <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-kemet-charcoal/60">
          {disclaimer}
        </p>

        <p className="mt-4 text-center text-sm text-kemet-charcoal/70">
          <Link href="/donate/wall" className="font-semibold text-kemet-gold-deep hover:underline">
            View our donor recognition wall
          </Link>
        </p>
      </Container>
    </section>
  );
}
