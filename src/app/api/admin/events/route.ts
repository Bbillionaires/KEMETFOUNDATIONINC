import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventInputSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { session, response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = eventInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid event data." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const existing = await prisma.event.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return NextResponse.json({ error: "An event with this slug already exists." }, { status: 409 });
  }

  const event = await prisma.event.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      imageUrl: data.imageUrl || null,
      location: data.location,
      startAt: new Date(data.startAt),
      endAt: new Date(data.endAt),
      registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : null,
      capacity: data.capacity ?? null,
      isFree: data.isFree,
      priceCents: data.isFree ? null : data.priceCents ?? null,
      status: data.status,
      createdByUserId: session.user.id,
    },
  });

  return NextResponse.json({ success: true, event }, { status: 201 });
}
