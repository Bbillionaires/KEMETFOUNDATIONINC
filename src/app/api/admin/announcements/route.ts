import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { announcementSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = announcementSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid announcement data." },
      { status: 400 }
    );
  }

  const announcement = await prisma.announcement.create({ data: parsed.data });
  return NextResponse.json({ success: true, announcement }, { status: 201 });
}
