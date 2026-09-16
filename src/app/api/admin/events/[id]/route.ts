import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventInputSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = eventInputSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid event data." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  if (data.slug && data.slug !== existing.slug) {
    const slugConflict = await prisma.event.findUnique({ where: { slug: data.slug } });
    if (slugConflict) {
      return NextResponse.json({ error: "An event with this slug already exists." }, { status: 409 });
    }
  }

  const isFree = data.isFree ?? existing.isFree;

  const event = await prisma.event.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.startAt !== undefined && { startAt: new Date(data.startAt) }),
      ...(data.endAt !== undefined && { endAt: new Date(data.endAt) }),
      ...(data.registrationDeadline !== undefined && {
        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : null,
      }),
      ...(data.capacity !== undefined && { capacity: data.capacity }),
      ...(data.isFree !== undefined && { isFree: data.isFree }),
      priceCents: isFree ? null : data.priceCents !== undefined ? data.priceCents : existing.priceCents,
      ...(data.status !== undefined && { status: data.status }),
    },
  });

  return NextResponse.json({ success: true, event });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  const registrationCount = await prisma.eventRegistration.count({ where: { eventId: id } });
  if (registrationCount > 0) {
    return NextResponse.json(
      {
        error:
          "This event has registrations and cannot be deleted. Cancel the event instead to keep the registration history.",
      },
      { status: 409 }
    );
  }

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
