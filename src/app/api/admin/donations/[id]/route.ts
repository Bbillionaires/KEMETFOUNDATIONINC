import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const statusSchema = z.object({
  status: z.enum(["PENDING", "SUCCEEDED", "FAILED", "REFUNDED", "CANCELLED"]),
});

// Manual status override for edge cases (e.g. marking a check/cash donation as
// SUCCEEDED). Stripe-originated donations are otherwise kept in sync by the
// webhook handler owned by the donations/payments teammate.
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  const body = await req.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const existing = await prisma.donation.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Donation not found." }, { status: 404 });
  }

  const donation = await prisma.donation.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ success: true, donation });
}
