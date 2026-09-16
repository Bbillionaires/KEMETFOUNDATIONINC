import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { donationSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/admin-auth";

// Manual (offline) donation entry: extends the public donation schema with an
// admin-settable status, since these gifts don't flow through Square.
const manualDonationSchema = donationSchema.extend({
  status: z.enum(["PENDING", "SUCCEEDED", "FAILED", "REFUNDED", "CANCELLED"]).default("SUCCEEDED"),
});

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = manualDonationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid donation data." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const donation = await prisma.donation.create({
    data: {
      donorName: data.donorName,
      donorEmail: data.donorEmail,
      amountCents: data.amountCents,
      frequency: data.frequency,
      dedicationMessage: data.dedicationMessage || null,
      publicRecognition: data.publicRecognition,
      status: data.status,
    },
  });

  return NextResponse.json({ success: true, donation }, { status: 201 });
}
