import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { donationSchema } from "@/lib/validations";
import { getStripeClient, isStripeConfigured } from "@/lib/stripe";
import { SITE_URL } from "@/lib/constants";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(`donate-checkout:${ip}`, { limit: 15, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = donationSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Please check the form and try again." },
      { status: 400 }
    );
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Online donations are not yet configured. Please contact us directly." },
      { status: 503 }
    );
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json(
      { error: "Online donations are not yet configured. Please contact us directly." },
      { status: 503 }
    );
  }

  const data = parsed.data;
  const session = await getServerSession(authOptions);

  // Amounts are always taken from the validated request body (server-side
  // computed by donationSchema), never trusted from a client-supplied Stripe
  // price or line item.
  const donation = await prisma.donation.create({
    data: {
      donorName: data.donorName,
      donorEmail: data.donorEmail.toLowerCase(),
      amountCents: data.amountCents,
      frequency: data.frequency,
      dedicationMessage: data.dedicationMessage || null,
      publicRecognition: data.publicRecognition,
      status: "PENDING",
      userId: session?.user?.id ?? null,
    },
  });

  const successUrl = `${SITE_URL}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${SITE_URL}/donate`;

  try {
    const checkoutSession =
      data.frequency === "MONTHLY"
        ? await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [
              {
                price_data: {
                  currency: "usd",
                  product_data: { name: "Monthly Donation to Kemet Foundation Inc" },
                  recurring: { interval: "month" },
                  unit_amount: data.amountCents,
                },
                quantity: 1,
              },
            ],
            customer_email: data.donorEmail,
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: { donationId: donation.id },
            subscription_data: { metadata: { donationId: donation.id } },
          })
        : await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
              {
                price_data: {
                  currency: "usd",
                  product_data: { name: "Donation to Kemet Foundation Inc" },
                  unit_amount: data.amountCents,
                },
                quantity: 1,
              },
            ],
            customer_email: data.donorEmail,
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: { donationId: donation.id },
          });

    await prisma.donation.update({
      where: { id: donation.id },
      data: { stripeCheckoutSessionId: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[donations/checkout] Stripe session creation failed:", err instanceof Error ? err.message : err);
    await prisma.donation
      .update({ where: { id: donation.id }, data: { status: "FAILED" } })
      .catch(() => {});
    return NextResponse.json(
      { error: "We couldn't start checkout. Please try again in a moment." },
      { status: 502 }
    );
  }
}
