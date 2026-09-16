import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const profileUpdateSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(50),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  businessOrg: z.string().trim().max(200).optional().or(z.literal("")),
  occupation: z.string().trim().max(150).optional().or(z.literal("")),
  skills: z.string().trim().max(1000).optional().or(z.literal("")),
  volunteerSkills: z.string().trim().max(1000).optional().or(z.literal("")),
  areasOfInterest: z.string().trim().max(1000).optional().or(z.literal("")),
  contributionInterest: z.string().trim().max(1000).optional().or(z.literal("")),
  newsletterOptIn: z.boolean().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.memberProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  return NextResponse.json({ profile });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = profileUpdateSchema.partial().safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Please check the form and try again." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const updated = await prisma.memberProfile.update({
    where: { userId: session.user.id },
    data: {
      ...(data.firstName !== undefined && { firstName: data.firstName }),
      ...(data.lastName !== undefined && { lastName: data.lastName }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.city !== undefined && { city: data.city }),
      ...(data.state !== undefined && { state: data.state }),
      ...(data.zip !== undefined && { zip: data.zip }),
      ...(data.businessOrg !== undefined && { businessOrg: data.businessOrg || null }),
      ...(data.occupation !== undefined && { occupation: data.occupation || null }),
      ...(data.skills !== undefined && { skills: data.skills || null }),
      ...(data.volunteerSkills !== undefined && { volunteerSkills: data.volunteerSkills || null }),
      ...(data.areasOfInterest !== undefined && { areasOfInterest: data.areasOfInterest || null }),
      ...(data.contributionInterest !== undefined && {
        contributionInterest: data.contributionInterest || null,
      }),
      ...(data.newsletterOptIn !== undefined && { newsletterOptIn: data.newsletterOptIn }),
    },
  });

  return NextResponse.json({ success: true, profile: updated });
}
