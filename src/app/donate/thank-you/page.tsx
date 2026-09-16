import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Thank You",
  description: `Thank you for your generous gift to ${SITE_NAME}.`,
};

export default async function DonateThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  return (
    <section className="bg-kemet-white py-24">
      <Container className="max-w-2xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-kemet-gold-deep">
          Thank You
        </p>
        <h1 className="font-display text-4xl font-bold text-kemet-black sm:text-5xl">
          Your Generosity Makes a Difference
        </h1>
        <p className="mt-6 text-base leading-relaxed text-kemet-charcoal/80">
          Thank you for your gift to {SITE_NAME}. We&apos;re truly grateful for your support of
          our work in African heritage and cultural education, community development, family
          strengthening, and economic empowerment. A confirmation email is on its way to you
          shortly.
        </p>
        {sessionId && (
          <p className="mt-4 text-xs text-kemet-charcoal/40">Confirmation reference: {sessionId}</p>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <LinkButton href="/">Return Home</LinkButton>
          <LinkButton
            href="/donate/wall"
            variant="outline"
            className="border-kemet-gold-deep text-kemet-black hover:bg-kemet-gold/10"
          >
            View Donor Wall
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
