import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { teamMemberSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = teamMemberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid team member data." },
      { status: 400 }
    );
  }

  const member = await prisma.teamMember.create({ data: parsed.data });
  return NextResponse.json({ success: true, member }, { status: 201 });
}
