/**
 * Transactional email sender. No-ops (and logs) when RESEND_API_KEY is not
 * configured, so registration/event/donation flows work end-to-end before
 * an administrator wires up real email infrastructure.
 */

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.info(`[email:disabled] Would send "${subject}" to ${to}`);
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    }),
  });

  return res.ok;
}
