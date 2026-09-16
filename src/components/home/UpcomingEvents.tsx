import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

export async function UpcomingEvents() {
  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED", startAt: { gte: new Date() } },
    orderBy: { startAt: "asc" },
    take: 3,
  });

  return (
    <section className="bg-kemet-white py-20">
      <Container>
        <SectionHeading eyebrow="Upcoming Events" title="Join Us at an Upcoming Event" />

        {events.length === 0 ? (
          <div className="mx-auto mt-12 max-w-xl rounded-sm border border-kemet-gold/30 bg-kemet-ivory p-10 text-center">
            <p className="text-base leading-relaxed text-kemet-charcoal/80">
              New events are announced regularly &mdash; check back soon.
            </p>
            <LinkButton href="/events" variant="outline" size="sm" className="mt-6 border-kemet-gold-deep text-kemet-black hover:bg-kemet-gold/10">
              View All Events
            </LinkButton>
          </div>
        ) : (
          <>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id} className="flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-kemet-gold-deep">
                    {dateFormatter.format(event.startAt)}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold text-kemet-black">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm text-kemet-charcoal/70">
                    {timeFormatter.format(event.startAt)} &middot; {event.location}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-kemet-charcoal/80">
                    {event.description.length > 140
                      ? `${event.description.slice(0, 140).trim()}...`
                      : event.description}
                  </p>
                  <Link
                    href={`/events/${event.slug}`}
                    className="mt-4 text-sm font-semibold uppercase tracking-wide text-kemet-gold-deep hover:text-kemet-gold"
                  >
                    Learn More &rarr;
                  </Link>
                </Card>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <LinkButton href="/events" variant="outline" size="md" className="border-kemet-gold-deep text-kemet-black hover:bg-kemet-gold/10">
                View All Events
              </LinkButton>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
