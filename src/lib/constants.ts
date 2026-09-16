export const SITE_NAME = "Kemet Foundation Inc";

// `||` (not `??`) so a blank string set in the hosting platform's
// environment variables (e.g. an empty NEXT_PUBLIC_SITE_URL left over
// from a template) falls back to the default instead of producing an
// invalid empty URL. The org has not purchased kemetfoundationinc.org,
// so the default points at the live Vercel deployment instead.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kemetfoundationinc.vercel.app";

export const ORG_ADDRESS = {
  line1: "P.O. Box 2284",
  city: "Jacksonville",
  state: "FL",
  zip: "32208",
};

export const ORG_EMAIL = process.env.NEXT_PUBLIC_ORG_EMAIL || "info@kemetfoundationinc.org";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/mission", label: "Our Mission" },
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
