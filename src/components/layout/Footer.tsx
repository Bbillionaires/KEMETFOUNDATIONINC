import Link from "next/link";
import { KemetLogo } from "@/components/brand/KemetLogo";
import { Container } from "@/components/ui/Container";
import { NAV_LINKS, ORG_ADDRESS, ORG_EMAIL } from "@/lib/constants";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function Footer() {
  return (
    <footer className="bg-kemet-black pattern-kemet text-kemet-ivory">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <KemetLogo emblemOnly className="h-16 w-16" />
          <p className="mt-4 font-display text-lg font-semibold text-kemet-white">Kemet Foundation Inc</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-kemet-ivory/70">
            Building community, preserving legacy, and creating the future through African heritage,
            education, and economic empowerment.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-kemet-gold">
            Explore
          </h3>
          <ul className="space-y-2.5 text-sm text-kemet-ivory/80">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-kemet-gold">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/donate" className="hover:text-kemet-gold">
                Donate
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-kemet-gold">
            Contact
          </h3>
          <address className="not-italic text-sm leading-relaxed text-kemet-ivory/80">
            Kemet Foundation Inc
            <br />
            {ORG_ADDRESS.line1}
            <br />
            {ORG_ADDRESS.city}, {ORG_ADDRESS.state} {ORG_ADDRESS.zip}
            <br />
            <a href={`mailto:${ORG_EMAIL}`} className="hover:text-kemet-gold">
              {ORG_EMAIL}
            </a>
          </address>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-kemet-gold">
            Newsletter
          </h3>
          <p className="mb-3 text-sm text-kemet-ivory/70">
            Stay informed on programs, events, and ways to get involved.
          </p>
          <NewsletterForm compact />
        </div>
      </Container>

      <div className="kemet-divider" />

      <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-kemet-ivory/60 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Kemet Foundation Inc. All rights reserved.</p>
        <p>A Florida nonprofit corporation.</p>
      </Container>

      <div className="kemet-divider" />

      <Container className="py-4 text-center text-xs text-kemet-ivory/50">
        <p>Website Developed by De&apos;Aris Henry</p>
      </Container>
    </footer>
  );
}
