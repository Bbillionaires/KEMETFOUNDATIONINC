import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { EventCard, type EventCardData } from "@/components/events/EventCard";
import { EventsViewToggle } from "@/components/events/EventsViewToggle";
import type { CalendarEvent } from "@/components/events/EventCalendar";
import type { Event } from "@prisma/client";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming and past events hosted by Kemet Foundation Inc — community gatherings, cultural education, and family-strengthening programs.",
};

// Registration counts and the upcoming/past cutoff change constantly, so this
// page is always rendered fresh rather than statically cached.
export const dynamic = "force-dynamic";

type EventWithCount = Event & {
  _count: { registrations: number };
};

async function getEvents() {
  const now = new Date();

  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({
      where: { status: "PUBLISHED", startAt: { gte: now } },
      orderBy: { startAt: "asc" },
      include: { _count: { select: { registrations: { where: { status: "CONFIRMED" } } } } },
    }),
    prisma.event.findMany({
      where: { status: "PUBLISHED", startAt: { lt: now } },
      orderBy: { startAt: "desc" },
      take: 12,
      include: { _count: { select: { registrations: { where: { status: "CONFIRMED" } } } } },
    }),
  ]);

  return { upcoming, past };
}

function toCardData(event: EventWithCount): EventCardData {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    imageUrl: event.imageUrl,
    location: event.location,
    startAt: event.startAt,
    endAt: event.endAt,
    isFree: event.isFree,
    priceCents: event.priceCents,
    capacity: event.capacity,
    confirmedCount: event._count.registrations,
  };
}

function toCalendarEvent(event: EventWithCount): CalendarEvent {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    startAt: event.startAt.toISOString(),
  };
}

export default async function EventsPage() {
  const { upcoming, past } = await getEvents();
  const upcomingCards = upcoming.map(toCardData);
  const pastCards = past.map(toCardData);
  const calendarEvents = upcoming.map(toCalendarEvent);

  return (
    <>
      <section className="pattern-kemet bg-kemet-black py-20 text-kemet-white">
        <Container>
          <SectionHeading
            eyebrow="Community"
            title="Events"
            description="Join us for gatherings that celebrate African heritage, strengthen families, and build community across Florida."
            light
          />
        </Container>
      </section>

      <section className="bg-kemet-white py-16 sm:py-20">
        <Container>
          <h2 className="font-display text-2xl font-bold text-kemet-black sm:text-3xl">Upcoming Events</h2>
          <div className="kemet-divider my-6 max-w-xs" />

          {upcomingCards.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-sm border border-kemet-gold/30 bg-kemet-ivory p-10 text-center">
              <p className="text-base leading-relaxed text-kemet-charcoal/80">
                New events are announced regularly &mdash; check back soon.
              </p>
            </div>
          ) : (
            <EventsViewToggle events={calendarEvents}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingCards.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </EventsViewToggle>
          )}
        </Container>
      </section>

      <section className="bg-kemet-ivory py-16 sm:py-20">
        <Container>
          <h2 className="font-display text-2xl font-bold text-kemet-black sm:text-3xl">Past Events</h2>
          <div className="kemet-divider my-6 max-w-xs" />

          {pastCards.length === 0 ? (
            <p className="text-base leading-relaxed text-kemet-charcoal/70">
              We haven&rsquo;t held any events yet &mdash; our first gathering is coming soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pastCards.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <LinkButton href="/contact" variant="outline" size="md" className="border-kemet-gold-deep text-kemet-black hover:bg-kemet-gold/10">
              Suggest an Event
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}
