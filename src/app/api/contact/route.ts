import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, escapeHtml, isEmailConfigured } from "@/lib/email";
import { CONTACT_SUBJECT_OPTIONS, NOTIFICATION_EMAILS, SITE_NAME } from "@/lib/constants";

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

  // Honeypot: if filled, silently treat as spam and report success without
  // sending, so bots get no signal that they were caught.
  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  const { name, email, phone, subject, message } = parsed.data;

  if (!isEmailConfigured()) {
    console.error(
      "[contact] RESEND_API_KEY/EMAIL_FROM not configured — submission was not delivered:",
      { name, email, subject }
    );
    return NextResponse.json(
      { error: "Contact form is not yet configured. Please email us directly in the meantime." },
      { status: 503 }
    );
  }

  const subjectLabel = CONTACT_SUBJECT_OPTIONS.find((o) => o.value === subject)?.label ?? subject;

  const delivered = await sendEmail({
    to: NOTIFICATION_EMAILS,
    subject: `[${SITE_NAME} Contact] ${subjectLabel} — ${name}`,
    html: `
      <div style="font-family: sans-serif; color: #1a1a1a; line-height: 1.6;">
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
        <p><strong>Subject:</strong> ${escapeHtml(subjectLabel)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-line;">${escapeHtml(message)}</p>
      </div>
    `,
  });

  if (!delivered) {
    return NextResponse.json(
      { error: "We couldn't send your message. Please try again in a moment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
