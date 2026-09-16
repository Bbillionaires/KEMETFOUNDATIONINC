import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { teamMemberSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  const body = await req.json().catch(() => null);
  const parsed = teamMemberSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid team member data." },
      { status: 400 }
    );
  }

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Team member not found." }, { status: 404 });
  }

  const member = await prisma.teamMember.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ success: true, member });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Team member not found." }, { status: 404 });
  }

  await prisma.teamMember.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
