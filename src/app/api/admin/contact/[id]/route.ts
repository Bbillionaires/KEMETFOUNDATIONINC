import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const statusSchema = z.object({
  status: z.enum(["NEW", "READ", "RESOLVED"]),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  const body = await req.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const existing = await prisma.contactSubmission.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  const submission = await prisma.contactSubmission.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ success: true, submission });
}
