import { NextResponse } from "next/server";
import { WebhooksHelper } from "square";
import { isSquareConfigured } from "@/lib/square";
import { sendEmail, escapeHtml } from "@/lib/email";
import { NOTIFICATION_EMAILS, SITE_NAME } from "@/lib/constants";

export const runtime = "nodejs";

// This site has no database, so this webhook doesn't update any stored
// donation record — it simply notifies the organization by email when a
// payment succeeds. Square itself remains the system of record for
// payment history.
type SquarePaymentWebhookEvent = {
  type?: string;
  data?: {
    object?: {
      payment?: {
        id?: string;
        status?: string;
        amountMoney?: { amount?: string | number; currency?: string };
        buyerEmailAddress?: string;
        note?: string;
      };
    };
  };
};

export async function POST(req: Request) {
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  const notificationUrl = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL;

  // Nothing to verify or process yet — acknowledge so Square doesn't retry.
  if (!isSquareConfigured() || !signatureKey || !notificationUrl) {
    return NextResponse.json({ received: true });
  }

  const rawBody = await req.text();
  const signatureHeader = req.headers.get("x-square-hmacsha256-signature");

  if (!signatureHeader) {
    return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
  }

  const valid = await WebhooksHelper.verifySignature({
    requestBody: rawBody,
    signatureHeader,
    signatureKey,
    notificationUrl,
  });

  if (!valid) {
    console.error("[donations/webhook] Signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: SquarePaymentWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    if (event.type === "payment.updated" || event.type === "payment.created") {
      const payment = event.data?.object?.payment;
      if (payment?.status === "COMPLETED") {
        const amountCents = Number(payment.amountMoney?.amount ?? 0);
        const amountDisplay = (amountCents / 100).toLocaleString("en-US", {
          style: "currency",
          currency: payment.amountMoney?.currency ?? "USD",
        });

        await sendEmail({
          to: NOTIFICATION_EMAILS,
          subject: `[${SITE_NAME}] New donation received — ${amountDisplay}`,
          html: `
            <div style="font-family: sans-serif; color: #1a1a1a; line-height: 1.6;">
              <p><strong>Amount:</strong> ${amountDisplay}</p>
              ${payment.buyerEmailAddress ? `<p><strong>Donor email:</strong> ${escapeHtml(payment.buyerEmailAddress)}</p>` : ""}
              ${payment.note ? `<p><strong>Details:</strong> ${escapeHtml(payment.note)}</p>` : ""}
              <p><strong>Square payment ID:</strong> ${escapeHtml(payment.id ?? "unknown")}</p>
            </div>
          `,
        }).catch((err) => {
          console.error("[donations/webhook] Failed to send notification email:", err instanceof Error ? err.message : err);
        });
      }
    }
  } catch (err) {
    console.error("[donations/webhook] Error handling event", event.type, err);
  }

  return NextResponse.json({ received: true });
}
