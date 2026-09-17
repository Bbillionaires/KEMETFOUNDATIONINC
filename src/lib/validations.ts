import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  subject: z.enum([
    "GENERAL",
    "MEMBERSHIP",
    "EVENTS",
    "DONATIONS",
    "VOLUNTEER",
    "PARTNERSHIP",
    "OTHER",
  ]),
  message: z.string().trim().min(10, "Please include a short message").max(5000),
  website: z.string().max(0).optional(), // honeypot field, must remain empty
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email(),
  source: z.string().max(100).optional(),
});

export const donationSchema = z.object({
  amountCents: z.number().int().min(500, "Minimum donation is $5").max(100000000),
  frequency: z.enum(["ONE_TIME", "MONTHLY"]),
  donorName: z.string().trim().min(1, "Name is required").max(150),
  donorEmail: z.string().trim().email("Enter a valid email address"),
  dedicationMessage: z.string().trim().max(1000).optional().or(z.literal("")),
  publicRecognition: z.boolean().default(false),
});

export type DonationInput = z.infer<typeof donationSchema>;

// Membership interest form — this site has no accounts/database, so
// "becoming a member" is a request the foundation follows up on directly,
// not a self-service signup.
export const membershipInterestSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(50),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),

  businessOrg: z.string().trim().max(200).optional().or(z.literal("")),
  occupation: z.string().trim().max(150).optional().or(z.literal("")),
  skills: z.string().trim().max(1000).optional().or(z.literal("")),
  volunteerSkills: z.string().trim().max(1000).optional().or(z.literal("")),
  areasOfInterest: z.string().trim().max(1000).optional().or(z.literal("")),
  contributionInterest: z.string().trim().max(1000).optional().or(z.literal("")),
  newsletterOptIn: z.boolean().default(false),
  website: z.string().max(0).optional(), // honeypot field, must remain empty
});

export type MembershipInterestInput = z.infer<typeof membershipInterestSchema>;
