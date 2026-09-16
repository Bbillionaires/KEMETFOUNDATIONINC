import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { announcementSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  const body = await req.json().catch(() => null);
  const parsed = announcementSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid announcement data." },
      { status: 400 }
    );
  }

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Announcement not found." }, { status: 404 });
  }

  const announcement = await prisma.announcement.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ success: true, announcement });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Announcement not found." }, { status: 404 });
  }

  await prisma.announcement.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
