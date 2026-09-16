import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/forms/ContactForm";
import { ORG_ADDRESS, ORG_EMAIL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE_NAME}. Send us a message about membership, events, donations, volunteering, or partnerships.`,
};

export default function ContactPage() {
  return (
    <section className="bg-kemet-white py-20">
      <Container>
        <SectionHeading
          eyebrow="Contact Us"
          title="We'd Love to Hear From You"
          description="Whether you have a question about membership, events, donations, volunteering, or partnerships, send us a message and we'll get back to you."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <ContactForm />
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <h2 className="font-display text-lg font-bold text-kemet-black">Mailing Address</h2>
              <address className="mt-4 not-italic text-sm leading-relaxed text-kemet-charcoal/80">
                {SITE_NAME}
                <br />
                {ORG_ADDRESS.line1}
                <br />
                {ORG_ADDRESS.city}, {ORG_ADDRESS.state} {ORG_ADDRESS.zip}
              </address>

              <h2 className="mt-8 font-display text-lg font-bold text-kemet-black">Email</h2>
              <p className="mt-4 text-sm leading-relaxed text-kemet-charcoal/80">
                <a href={`mailto:${ORG_EMAIL}`} className="text-kemet-gold-deep hover:underline">
                  {ORG_EMAIL}
                </a>
              </p>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
