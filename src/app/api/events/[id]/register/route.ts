import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

function formatEventWhen(startAt: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(startAt);
}

function buildConfirmationEmail(
  eventTitle: string,
  eventLocation: string,
  startAt: Date,
  status: "CONFIRMED" | "WAITLISTED"
): { subject: string; html: string } {
  if (status === "CONFIRMED") {
    return {
      subject: `You're registered: ${eventTitle}`,
      html: `<p>You're confirmed for <strong>${eventTitle}</strong>.</p><p>${formatEventWhen(startAt)}<br />${eventLocation}</p><p>We look forward to seeing you there.</p><p>&mdash; Kemet Foundation Inc</p>`,
    };
  }
  return {
    subject: `You're on the waitlist: ${eventTitle}`,
    html: `<p>This event is currently at capacity, so you've been added to the waitlist for <strong>${eventTitle}</strong>.</p><p>${formatEventWhen(startAt)}<br />${eventLocation}</p><p>We'll email you if a spot opens up.</p><p>&mdash; Kemet Foundation Inc</p>`,
  };
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Middleware already gates this route to authenticated requests, but this
  // is a security-sensitive write, so we defensively re-check here too.
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in to register." }, { status: 401 });
  }

  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(`event-register:${ip}`, { limit: 20, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  if (event.status === "CANCELLED") {
    return NextResponse.json({ error: "This event has been cancelled." }, { status: 400 });
  }
  if (event.status !== "PUBLISHED") {
    return NextResponse.json({ error: "This event is not open for registration." }, { status: 400 });
  }
  if (event.registrationDeadline && event.registrationDeadline < new Date()) {
    return NextResponse.json(
      { error: "The registration deadline for this event has passed." },
      { status: 400 }
    );
  }

  const confirmedCount = await prisma.eventRegistration.count({
    where: { eventId: event.id, status: "CONFIRMED" },
  });
  const isFull = event.capacity != null && confirmedCount >= event.capacity;
  const status = isFull ? "WAITLISTED" : "CONFIRMED";

  let registration;
  try {
    registration = await prisma.eventRegistration.create({
      data: { eventId: event.id, userId: session.user.id, status },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "You're already registered for this event." }, { status: 409 });
    }
    throw err;
  }

  // Fire-and-forget confirmation/waitlist email — never block the response on it.
  if (session.user.email) {
    const { subject, html } = buildConfirmationEmail(event.title, event.location, event.startAt, status);
    const registrationId = registration.id;
    const toEmail = session.user.email;
    void (async () => {
      try {
        const sent = await sendEmail({ to: toEmail, subject, html });
        if (sent) {
          await prisma.eventRegistration.update({
            where: { id: registrationId },
            data: { confirmationEmailSentAt: new Date() },
          });
        }
      } catch (err) {
        console.error("Failed to send event registration email", err);
      }
    })();
  }

  return NextResponse.json({ status: registration.status }, { status: 201 });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const registration = await prisma.eventRegistration.findUnique({
    where: { eventId_userId: { eventId: id, userId: session.user.id } },
  });

  if (!registration || registration.status === "CANCELLED") {
    return NextResponse.json({ error: "You are not registered for this event." }, { status: 404 });
  }

  // Note: if the event was at capacity, cancelling a confirmed registration
  // does not automatically promote the next waitlisted registrant — that is
  // left as a manual admin follow-up for now.
  await prisma.eventRegistration.update({
    where: { id: registration.id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ status: "CANCELLED" });
}
