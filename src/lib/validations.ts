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
