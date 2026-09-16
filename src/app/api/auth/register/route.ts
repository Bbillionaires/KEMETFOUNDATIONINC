import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const SALT_ROUNDS = 12;

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(`register:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Please check the form and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const email = data.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const now = new Date();

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "MEMBER",
      profile: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          city: data.city,
          state: data.state,
          zip: data.zip,
          businessOrg: data.businessOrg || null,
          occupation: data.occupation || null,
          skills: data.skills || null,
          volunteerSkills: data.volunteerSkills || null,
          areasOfInterest: data.areasOfInterest || null,
          contributionInterest: data.contributionInterest || null,
          newsletterOptIn: data.newsletterOptIn,
          termsAcceptedAt: now,
          privacyAcceptedAt: now,
          membershipStatus: "PENDING",
        },
      },
    },
    select: { id: true, email: true },
  });

  if (data.newsletterOptIn) {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true, unsubscribedAt: null },
      create: { email, source: "membership_registration" },
    });
  }

  return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
}
