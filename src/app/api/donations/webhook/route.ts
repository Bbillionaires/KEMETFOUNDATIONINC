import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripeClient, isStripeConfigured } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";
import { SITE_NAME } from "@/lib/constants";

export const runtime = "nodejs";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const donationId = session.metadata?.donationId;

  const donation = donationId
    ? await prisma.donation.findUnique({ where: { id: donationId } })
    : await prisma.donation.findUnique({ where: { stripeCheckoutSessionId: session.id } });

  if (!donation) {
    console.error("[donations/webhook] No matching donation found for checkout session", session.id);
    return;
  }

  // Already processed (Stripe may retry/redeliver the same event) — avoid
  // sending a duplicate acknowledgment email.
  if (donation.status === "SUCCEEDED") {
    return;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

  const updated = await prisma.donation.update({
    where: { id: donation.id },
    data: {
      status: "SUCCEEDED",
      stripePaymentIntentId: paymentIntentId ?? donation.stripePaymentIntentId,
      stripeSubscriptionId: subscriptionId ?? donation.stripeSubscriptionId,
      stripeCheckoutSessionId: donation.stripeCheckoutSessionId ?? session.id,
    },
  });

  const amountDisplay = (updated.amountCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "usd",
  });
  const dedicationHtml = updated.dedicationMessage
    ? `<p style="margin-top:16px;">Your message: <em>${escapeHtml(updated.dedicationMessage)}</em></p>`
    : "";
  const recurringNote = updated.frequency === "MONTHLY" ? " (recurring monthly)" : "";

  // Fire-and-forget: don't block the webhook response on email delivery.
  sendEmail({
    to: updated.donorEmail,
    subject: `Thank you for your gift to ${SITE_NAME}`,
    html: `
      <div style="font-family: sans-serif; color: #1a1a1a; line-height: 1.6;">
        <p>Dear ${escapeHtml(updated.donorName)},</p>
        <p>Thank you for your generous gift of ${amountDisplay} to ${SITE_NAME}${recurringNote}. Your support means a great deal to our community and helps us continue our work in African heritage and cultural education, community development, and economic empowerment.</p>
        ${dedicationHtml}
        <p>With gratitude,<br/>${SITE_NAME}</p>
      </div>
    `,
  })
    .then(() =>
      prisma.donation.update({
        where: { id: updated.id },
        data: { receiptEmailSentAt: new Date() },
      })
    )
    .catch((err) => {
      console.error("[donations/webhook] Failed to send thank-you email:", err instanceof Error ? err.message : err);
    });
}

export async function POST(req: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Nothing to verify or process yet — acknowledge so Stripe doesn't retry.
  if (!isStripeConfigured() || !stripe || !webhookSecret) {
    return NextResponse.json({ received: true });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Missing stripe-signature header");
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error(
      "[donations/webhook] Signature verification failed:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn(
          "[donations/webhook] invoice.payment_failed for subscription",
          typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id ?? "unknown"
        );
        break;
      }
      default:
        break;
    }
  } catch (err) {
    // Log and still acknowledge — the PENDING donation record is already
    // durable, and we don't want Stripe to hammer retries for a bug on our
    // side. Investigate via logs/admin if this happens.
    console.error("[donations/webhook] Error handling event", event.type, err);
  }

  return NextResponse.json({ received: true });
}
