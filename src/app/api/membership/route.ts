import { NextResponse } from "next/server";
import { membershipInterestSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, escapeHtml, isEmailConfigured } from "@/lib/email";
import { NOTIFICATION_EMAILS, SITE_NAME } from "@/lib/constants";

// This site has no accounts/database. A membership "application" is just a
// request the foundation follows up on directly, delivered by email.
export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(`membership:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = membershipInterestSchema.safeParse(body);
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

  const data = parsed.data;

  if (!isEmailConfigured()) {
    console.error("[membership] RESEND_API_KEY/EMAIL_FROM not configured — submission was not delivered:", {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
    });
    return NextResponse.json(
      { error: "Membership requests are not yet configured. Please email us directly in the meantime." },
      { status: 503 }
    );
  }

  const optionalRows = [
    ["Business / Organization", data.businessOrg],
    ["Occupation", data.occupation],
    ["Skills", data.skills],
    ["Volunteer Skills", data.volunteerSkills],
    ["Areas of Interest", data.areasOfInterest],
    ["How they'd like to contribute", data.contributionInterest],
  ]
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value as string)}</p>`)
    .join("");

  const delivered = await sendEmail({
    to: NOTIFICATION_EMAILS,
    subject: `[${SITE_NAME}] New membership interest — ${data.firstName} ${data.lastName}`,
    html: `
      <div style="font-family: sans-serif; color: #1a1a1a; line-height: 1.6;">
        <p><strong>Name:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
        <p><strong>Location:</strong> ${escapeHtml(data.city)}, ${escapeHtml(data.state)} ${escapeHtml(data.zip)}</p>
        <p><strong>Newsletter opt-in:</strong> ${data.newsletterOptIn ? "Yes" : "No"}</p>
        ${optionalRows}
      </div>
    `,
  });

  if (!delivered) {
    return NextResponse.json(
      { error: "We couldn't submit your request. Please try again in a moment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
