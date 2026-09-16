import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const newsletterToggleSchema = z.object({
  newsletterOptIn: z.boolean(),
});

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = newsletterToggleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { newsletterOptIn } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  await prisma.memberProfile.update({
    where: { userId: session.user.id },
    data: { newsletterOptIn },
  });

  if (newsletterOptIn) {
    await prisma.newsletterSubscriber.upsert({
      where: { email: user.email },
      update: { active: true, unsubscribedAt: null },
      create: { email: user.email, source: "member_dashboard" },
    });
  } else {
    await prisma.newsletterSubscriber.updateMany({
      where: { email: user.email },
      data: { active: false, unsubscribedAt: new Date() },
    });
  }

  return NextResponse.json({ success: true, newsletterOptIn });
}
