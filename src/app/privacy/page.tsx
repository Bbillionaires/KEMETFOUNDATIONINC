import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE_NAME, ORG_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME}.`,
};

export default function PrivacyPage() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Legal" title="Privacy Policy" align="left" />

        <div className="mt-8 rounded-sm border border-kemet-gold/40 bg-kemet-gold/10 px-5 py-4 text-sm font-medium text-kemet-charcoal">
          This page is a placeholder pending final legal review by Kemet Foundation Inc. The
          text below is generic, illustrative language and should not be relied upon as
          finalized or attorney-approved policy.
        </div>

        <div className="prose prose-sm mt-10 max-w-none text-kemet-charcoal/90">
          <p>Last updated: this document has not yet been finalized.</p>

          <h2>1. Information We Collect</h2>
          <p>
            When you submit a membership interest form, subscribe to our newsletter, make a
            donation, or contact us through this website, we may collect information such as your
            name, email address, phone number, city, state, ZIP code, and any optional information
            you choose to provide (such as your business or organization, occupation, skills,
            volunteer interests, or areas of interest). This website has no user accounts or
            database — submissions are delivered to us by email. If you make a donation, payment
            information is collected and processed by our third-party payment processor and is not
            stored on our servers.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to follow up on membership interest, process
            donations, send newsletter updates (if you opt in), respond to inquiries, and
            otherwise operate and improve our programs and this website.
          </p>

          <h2>3. We Do Not Sell Your Information</h2>
          <p>
            {SITE_NAME} does not sell, rent, or trade your personal information to third parties
            for their marketing purposes.
          </p>

          <h2>4. Sharing of Information</h2>
          <p>
            We may share information with service providers who help us operate this website and
            our programs (such as payment processors and email delivery services), and as required
            by law.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We take reasonable measures to protect the information you provide. However, no
            method of transmission or storage is completely secure.
          </p>

          <h2>6. Your Choices</h2>
          <p>
            You may opt out of newsletter emails at any time using the unsubscribe link in any
            newsletter email, or by contacting us directly to update or remove your information.
          </p>

          <h2>7. Cookies</h2>
          <p>
            This website does not use cookies for user accounts, since it has none. Any cookies or
            similar technologies in use are limited to basic site functionality.
          </p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            This website is not directed to children under 13, and we do not knowingly collect
            personal information from children under 13.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Continued use of this website
            after changes are posted constitutes acceptance of the revised policy.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or wish to request that your
            information be updated or removed, please contact us at{" "}
            <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a>.
          </p>
        </div>
      </Container>
    </div>
  );
}
