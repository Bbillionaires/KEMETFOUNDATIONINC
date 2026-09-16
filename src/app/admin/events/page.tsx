import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, Badge } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { EventQuickActions } from "@/components/admin/EventQuickActions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
};

const STATUS_TONE = { DRAFT: "gold", PUBLISHED: "green", CANCELLED: "red" } as const;

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startAt: "desc" },
    include: { _count: { select: { registrations: true } } },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-kemet-black">Events</h1>
        <LinkButton href="/admin/events/new" size="sm">
          + New Event
        </LinkButton>
      </div>

      <div className="mt-8 space-y-4">
        {events.length === 0 && (
          <Card>
            <p className="text-sm text-kemet-charcoal/70">No events yet.</p>
          </Card>
        )}
        {events.map((event) => (
          <Card key={event.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-lg font-bold text-kemet-black">{event.title}</h2>
                  <Badge tone={STATUS_TONE[event.status]}>{event.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-kemet-charcoal/70">
                  {new Date(event.startAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}{" "}
                  · {event.location}
                </p>
                <p className="mt-1 text-xs text-kemet-charcoal/50">
                  {event._count.registrations} registration{event._count.registrations === 1 ? "" : "s"} · /events/
                  {event.slug}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex flex-wrap justify-end gap-3">
                  <Link
                    href={`/admin/events/${event.id}/registrations`}
                    className="text-sm font-semibold text-kemet-gold-deep underline"
                  >
                    Registrations
                  </Link>
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="text-sm font-semibold text-kemet-gold-deep underline"
                  >
                    Edit
                  </Link>
                </div>
                <EventQuickActions
                  eventId={event.id}
                  status={event.status}
                  hasRegistrations={event._count.registrations > 0}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
