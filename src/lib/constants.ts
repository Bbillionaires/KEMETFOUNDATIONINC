export const SITE_NAME = "Kemet Foundation Inc";

// `||` (not `??`) so a blank string set in the hosting platform's
// environment variables (e.g. an empty NEXT_PUBLIC_SITE_URL left over
// from a template) falls back to the default instead of producing an
// invalid empty URL.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kemetfoundationinc.org";

export const ORG_ADDRESS = {
  line1: "P.O. Box 2284",
  city: "Jacksonville",
  state: "FL",
  zip: "32208",
};

// Publicly displayed contact address (footer, contact page, mailto links).
export const ORG_EMAIL = process.env.NEXT_PUBLIC_ORG_EMAIL || "info@kemetfoundationinc.org";

// Where form submission / donation notification emails are actually
// delivered — separate from the public-facing ORG_EMAIL above so the
// organization can route internal notifications to personal inboxes
// without changing what's shown to site visitors. Comma-separate multiple
// addresses via the ORG_NOTIFICATION_EMAILS env var to override.
export const NOTIFICATION_EMAILS = (
  process.env.ORG_NOTIFICATION_EMAILS?.split(",").map((e) => e.trim()).filter(Boolean) ?? [
    "raphaell759@yahoo.com",
    "greenwood100inc@gmail.com",
  ]
);

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/mission", label: "Our Mission" },
  { href: "/membership", label: "Membership" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Our Team" },
  { href: "/contact", label: "Contact" },
] as const;

export const DONATION_PRESETS_CENTS = [2500, 5000, 10000, 25000, 50000] as const;

export const CONTACT_SUBJECT_OPTIONS = [
  { value: "GENERAL", label: "General Information" },
  { value: "MEMBERSHIP", label: "Membership" },
  { value: "EVENTS", label: "Events" },
  { value: "DONATIONS", label: "Donations" },
  { value: "VOLUNTEER", label: "Volunteer" },
  { value: "PARTNERSHIP", label: "Business/Community Partnership" },
  { value: "OTHER", label: "Other" },
] as const;
