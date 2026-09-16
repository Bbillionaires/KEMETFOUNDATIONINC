import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventForm, toDatetimeLocal } from "@/components/admin/EventForm";

export const metadata: Metadata = {
  title: "Edit Event",
};

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-kemet-black">Edit Event</h1>
      <div className="mt-8">
        <EventForm
          mode="edit"
          eventId={event.id}
          initialValues={{
            title: event.title,
            slug: event.slug,
            description: event.description,
            imageUrl: event.imageUrl ?? "",
            location: event.location,
            startAt: toDatetimeLocal(event.startAt),
            endAt: toDatetimeLocal(event.endAt),
            registrationDeadline: toDatetimeLocal(event.registrationDeadline),
            capacity: event.capacity ?? undefined,
            isFree: event.isFree,
            priceCents: event.priceCents ?? undefined,
            status: event.status,
          }}
        />
      </div>
    </div>
  );
}
