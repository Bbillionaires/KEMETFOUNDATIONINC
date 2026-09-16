import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE_NAME, ORG_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${SITE_NAME}.`,
};

export default function TermsPage() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Legal" title="Terms of Service" align="left" />

        <div className="mt-8 rounded-sm border border-kemet-gold/40 bg-kemet-gold/10 px-5 py-4 text-sm font-medium text-kemet-charcoal">
          This page is a placeholder pending final legal review by Kemet Foundation Inc. The
          text below is generic, illustrative language and should not be relied upon as
          finalized or attorney-approved terms.
        </div>

        <div className="prose prose-sm mt-10 max-w-none text-kemet-charcoal/90">
          <p>Last updated: this document has not yet been finalized.</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the {SITE_NAME} website, registering for membership, registering
            for an event, or making a donation, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use this website.
          </p>

          <h2>2. Use of the Website</h2>
          <p>
            This website is provided by {SITE_NAME}, a Florida nonprofit corporation, for the
            purpose of sharing information about our mission and programs, facilitating membership
            registration, event registration, and donations. You agree to use this website only
            for lawful purposes and in a manner that does not infringe upon the rights of, or
            restrict or inhibit the use and enjoyment of, this website by any third party.
          </p>

          <h2>3. Membership</h2>
          <p>
            Submitting a membership application does not guarantee acceptance. {SITE_NAME}{" "}
            reviews all applications and reserves the right to approve, decline, or later change
            the status of any membership at its discretion.
          </p>

          <h2>4. Accounts and Security</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials
            and for all activity that occurs under your account. Please notify us promptly of any
            unauthorized use of your account.
          </p>

          <h2>5. Donations and Payments</h2>
          <p>
            Donations made through this website are voluntary contributions to {SITE_NAME} and,
            except where required otherwise by law, are non-refundable. Payment processing is
            handled by a third-party payment processor.
          </p>

          <h2>6. Acceptable Use</h2>
          <p>
            You agree not to misuse this website, including by attempting to gain unauthorized
            access to any part of the site, interfering with its normal operation, or submitting
            false, misleading, or fraudulent information.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and images, is the
            property of {SITE_NAME} or its licensors and is protected by applicable intellectual
            property laws.
          </p>

          <h2>8. Disclaimer and Limitation of Liability</h2>
          <p>
            This website and its content are provided &ldquo;as is&rdquo; without warranties of
            any kind. {SITE_NAME} shall not be liable for any damages arising from your use of, or
            inability to use, this website.
          </p>

          <h2>9. Changes to These Terms</h2>
          <p>
            We may update these Terms of Service from time to time. Continued use of this website
            after changes are posted constitutes acceptance of the revised terms.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions about these Terms of Service, please contact us at{" "}
            <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a>.
          </p>
        </div>
      </Container>
    </div>
  );
}
