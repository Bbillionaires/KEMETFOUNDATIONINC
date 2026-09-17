import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, escapeHtml, isEmailConfigured } from "@/lib/email";
import { ORG_EMAIL, SITE_NAME } from "@/lib/constants";

// This site has no database, so there is no subscriber list to manage here.
// Each signup is forwarded by email so the organization can add it to
// whatever mailing list tool they use.
export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(`newsletter:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();

  if (!isEmailConfigured()) {
    console.error("[newsletter] RESEND_API_KEY/EMAIL_FROM not configured — signup was not delivered:", email);
    return NextResponse.json({ success: true });
  }

  await sendEmail({
    to: ORG_EMAIL,
    subject: `[${SITE_NAME}] New newsletter signup`,
    html: `<p>New newsletter signup: <strong>${escapeHtml(email)}</strong> (source: ${escapeHtml(
      parsed.data.source ?? "footer"
    )})</p>`,
  });

  return NextResponse.json({ success: true });
}
