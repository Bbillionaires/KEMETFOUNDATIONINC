import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);

  const rl = checkRateLimit(`contact:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form for errors and try again." },
      { status: 400 }
    );
  }

  // Honeypot: if filled, silently treat as spam and report success without saving,
  // so bots get no signal that they were caught.
  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  const { name, email, phone, subject, message } = parsed.data;

  await prisma.contactSubmission.create({
    data: {
      name,
      email,
      phone: phone || null,
      subject,
      message,
      ipAddress: ip,
    },
  });

  return NextResponse.json({ success: true });
}
