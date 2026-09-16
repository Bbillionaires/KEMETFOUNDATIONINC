import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const statusSchema = z.object({
  membershipStatus: z.enum(["PENDING", "ACTIVE", "INACTIVE", "DECLINED"]),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  const body = await req.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid membership status." }, { status: 400 });
  }

  const existing = await prisma.memberProfile.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  }

  const member = await prisma.memberProfile.update({
    where: { id },
    data: { membershipStatus: parsed.data.membershipStatus, reviewedAt: new Date() },
  });

  return NextResponse.json({ success: true, member });
}
