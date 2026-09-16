import { NextResponse } from "next/server";
import { WebhooksHelper } from "square";
import { prisma } from "@/lib/prisma";
import { getSquareClient, isSquareConfigured } from "@/lib/square";
import { sendEmail } from "@/lib/email";
import { SITE_NAME } from "@/lib/constants";

export const runtime = "nodejs";

// Square webhook payloads are raw REST JSON (snake_case), independent of the
// SDK's camelCase request/response types — these describe only the fields
// this handler actually reads.
type SquareWebhookEvent = {
  type?: string;
  data?: {
    type?: string;
    id?: string;
    object?: {
      payment?: { id?: string; order_id?: string; status?: string };
      subscription?: { id?: string; plan_variation_id?: string };
    };
  };
};

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendThankYouEmail(donation: {
  id: string;
  donorName: string;
  donorEmail: string;
  amountCents: number;
  dedicationMessage: string | null;
  frequency: string;
}) {
  const amountDisplay = (donation.amountCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "usd",
  });
  const dedicationHtml = donation.dedicationMessage
    ? `<p style="margin-top:16px;">Your message: <em>${escapeHtml(donation.dedicationMessage)}</em></p>`
    : "";
  const recurringNote = donation.frequency === "MONTHLY" ? " (recurring monthly)" : "";

  // Fire-and-forget: don't block the webhook response on email delivery.
  sendEmail({
    to: donation.donorEmail,
    subject: `Thank you for your gift to ${SITE_NAME}`,
    html: `
      <div style="font-family: sans-serif; color: #1a1a1a; line-height: 1.6;">
        <p>Dear ${escapeHtml(donation.donorName)},</p>
        <p>Thank you for your generous gift of ${amountDisplay} to ${SITE_NAME}${recurringNote}. Your support means a great deal to our community and helps us continue our work in African heritage and cultural education, community development, and economic empowerment.</p>
        ${dedicationHtml}
        <p>With gratitude,<br/>${SITE_NAME}</p>
      </div>
    `,
  })
    .then(() =>
      prisma.donation.update({
        where: { id: donation.id },
        data: { receiptEmailSentAt: new Date() },
      })
    )
    .catch((err) => {
      console.error("[donations/webhook] Failed to send thank-you email:", err instanceof Error ? err.message : err);
    });
}

async function handlePaymentUpdated(payment: { id?: string; order_id?: string; status?: string }) {
  if (!payment.order_id || payment.status !== "COMPLETED") return;

  const square = getSquareClient();
  if (!square) return;

  // Payment objects don't carry our own reference; the Order we created it
  // against does (set to our Donation.id at checkout time).
  const { order } = await square.orders.get({ orderId: payment.order_id });
  const donationId = order?.referenceId;
  if (!donationId) {
    console.error("[donations/webhook] Order has no reference_id", payment.order_id);
    return;
  }

  const donation = await prisma.donation.findUnique({ where: { id: donationId } });
  if (!donation) {
    console.error("[donations/webhook] No matching donation for reference_id", donationId);
    return;
  }

  // Square may redeliver events — avoid a duplicate acknowledgment email.
  if (donation.status === "SUCCEEDED") return;

  const updated = await prisma.donation.update({
    where: { id: donation.id },
    data: {
      status: "SUCCEEDED",
      squarePaymentId: payment.id ?? donation.squarePaymentId,
      squareOrderId: payment.order_id,
    },
  });

  await sendThankYouEmail(updated);
}

async function handleSubscriptionCreated(subscription: { id?: string; plan_variation_id?: string }) {
  if (!subscription.id || !subscription.plan_variation_id) return;

  // Subscription objects carry no reference_id of their own; we correlate
  // via the one-off plan variation we created uniquely for this donation.
  const donation = await prisma.donation.findFirst({
    where: { squarePlanVariationId: subscription.plan_variation_id },
  });
  if (!donation) {
    console.error(
      "[donations/webhook] No matching donation for plan variation",
      subscription.plan_variation_id
    );
    return;
  }

  await prisma.donation.update({
    where: { id: donation.id },
    data: { squareSubscriptionId: subscription.id },
  });
}

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

  let event: SquareWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment.updated":
      case "payment.created": {
        const payment = event.data?.object?.payment;
        if (payment) await handlePaymentUpdated(payment);
        break;
      }
      case "subscription.created": {
        const subscription = event.data?.object?.subscription;
        if (subscription) await handleSubscriptionCreated(subscription);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    // Log and still acknowledge — the PENDING donation record is already
    // durable, and we don't want Square to hammer retries for a bug on our
    // side. Investigate via logs/admin if this happens.
    console.error("[donations/webhook] Error handling event", event.type, err);
  }

  return NextResponse.json({ received: true });
}
