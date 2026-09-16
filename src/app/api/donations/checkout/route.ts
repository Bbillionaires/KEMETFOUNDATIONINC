import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { donationSchema } from "@/lib/validations";
import { getSquareClient, getSquareLocationId, isSquareConfigured } from "@/lib/square";
import { SITE_URL } from "@/lib/constants";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { Order, CheckoutOptions } from "square";

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

  if (!isSquareConfigured()) {
    return NextResponse.json(
      { error: "Online donations are not yet configured. Please contact us directly." },
      { status: 503 }
    );
  }

  const square = getSquareClient();
  if (!square) {
    return NextResponse.json(
      { error: "Online donations are not yet configured. Please contact us directly." },
      { status: 503 }
    );
  }

  const data = parsed.data;
  const session = await getServerSession(authOptions);
  const locationId = getSquareLocationId();

  // Amounts are always taken from the validated request body (server-side
  // computed by donationSchema), never trusted from a client-supplied price.
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

  const dollars = (data.amountCents / 100).toFixed(2);

  try {
    let subscriptionPlanVariationId: string | undefined;

    if (data.frequency === "MONTHLY") {
      // Square subscriptions require a fixed-price Catalog subscription
      // plan; since donors pick an arbitrary amount, create a one-off plan
      // + variation priced for this exact donation (see square.ts research
      // notes — there is no inline arbitrary-amount subscription field).
      const planName = `Monthly Donation - $${dollars}`;
      const catalogResponse = await square.catalog.batchUpsert({
        idempotencyKey: randomUUID(),
        batches: [
          {
            objects: [
              {
                type: "SUBSCRIPTION_PLAN",
                id: "#plan",
                subscriptionPlanData: {
                  name: planName,
                  phases: [
                    {
                      cadence: "MONTHLY",
                      recurringPriceMoney: { amount: BigInt(data.amountCents), currency: "USD" },
                      ordinal: BigInt(0),
                    },
                  ],
                },
              },
              {
                type: "SUBSCRIPTION_PLAN_VARIATION",
                id: "#variation",
                subscriptionPlanVariationData: {
                  name: planName,
                  subscriptionPlanId: "#plan",
                  phases: [
                    {
                      cadence: "MONTHLY",
                      recurringPriceMoney: { amount: BigInt(data.amountCents), currency: "USD" },
                      ordinal: BigInt(0),
                    },
                  ],
                },
              },
            ],
          },
        ],
      });

      subscriptionPlanVariationId =
        catalogResponse.idMappings?.find((m) => m.clientObjectId === "#variation")?.objectId ??
        undefined;

      if (!subscriptionPlanVariationId) {
        throw new Error("Square did not return a subscription plan variation ID");
      }

      await prisma.donation.update({
        where: { id: donation.id },
        data: { squarePlanVariationId: subscriptionPlanVariationId },
      });
    }

    const order: Order =
      data.frequency === "MONTHLY"
        ? { locationId, referenceId: donation.id }
        : {
            locationId,
            referenceId: donation.id,
            lineItems: [
              {
                name: "Donation to Kemet Foundation Inc",
                quantity: "1",
                basePriceMoney: { amount: BigInt(data.amountCents), currency: "USD" },
              },
            ],
          };

    const checkoutOptions: CheckoutOptions = {
      redirectUrl: `${SITE_URL}/donate/thank-you`,
      acceptedPaymentMethods: { cashAppPay: true, applePay: true, googlePay: true },
      ...(subscriptionPlanVariationId ? { subscriptionPlanId: subscriptionPlanVariationId } : {}),
    };

    const { paymentLink } = await square.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      order,
      checkoutOptions,
      prePopulatedData: { buyerEmail: data.donorEmail },
    });

    if (!paymentLink?.url) {
      throw new Error("Square did not return a payment link URL");
    }

    await prisma.donation.update({
      where: { id: donation.id },
      data: { squarePaymentLinkId: paymentLink.id, squareOrderId: paymentLink.orderId },
    });

    return NextResponse.json({ url: paymentLink.url });
  } catch (err) {
    console.error("[donations/checkout] Square checkout creation failed:", err instanceof Error ? err.message : err);
    await prisma.donation
      .update({ where: { id: donation.id }, data: { status: "FAILED" } })
      .catch(() => {});
    return NextResponse.json(
      { error: "We couldn't start checkout. Please try again in a moment." },
      { status: 502 }
    );
  }
}
