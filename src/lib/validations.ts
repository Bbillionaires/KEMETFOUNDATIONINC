import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20),
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

  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms of Service" }),
  }),
  acceptPrivacy: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Privacy Policy" }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

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

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1),
});

export const eventInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().min(1),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  location: z.string().trim().min(1).max(300),
  startAt: z.string().min(1),
  endAt: z.string().min(1),
  registrationDeadline: z.string().optional().or(z.literal("")),
  capacity: z.number().int().positive().optional().nullable(),
  isFree: z.boolean().default(true),
  priceCents: z.number().int().nonnegative().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]).default("DRAFT"),
});

export const teamMemberSchema = z.object({
  name: z.string().trim().min(1).max(150),
  title: z.string().trim().min(1).max(200),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const announcementSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1),
  audience: z.enum(["PUBLIC", "MEMBERS"]).default("PUBLIC"),
  isActive: z.boolean().default(true),
});
