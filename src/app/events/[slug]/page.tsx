import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

function formatPriceCents(cents: number | null): string {
  if (cents == null) return "Paid";
  return `$${(cents / 100).toFixed(2)}`;
}

async function getEvent(slug: string) {
  return prisma.event.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event || event.status === "DRAFT") return {};

  return {
    title: event.title,
    description: event.description.slice(0, 160),
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);

  // DRAFT events are not publicly visible; anything else (PUBLISHED,
  // CANCELLED) renders so visitors can see cancellation notices.
  if (!event || event.status === "DRAFT") {
    notFound();
  }

  const now = new Date();
  const deadlinePassed = Boolean(event.registrationDeadline && event.registrationDeadline < now);
  const registrationOpen = event.status === "PUBLISHED" && !deadlinePassed;

  return (
    <>
      <section className="pattern-kemet bg-kemet-black py-16 text-kemet-white">
        <Container>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={event.isFree ? "green" : "gold"}>
              {event.isFree ? "Free" : formatPriceCents(event.priceCents)}
            </Badge>
            {event.status === "CANCELLED" && <Badge tone="red">Cancelled</Badge>}
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{event.title}</h1>
          <p className="mt-3 text-kemet-ivory/85">
            {format(event.startAt, "EEEE, MMMM d, yyyy")} &middot; {format(event.startAt, "h:mm a")}&ndash;
            {format(event.endAt, "h:mm a")}
          </p>
          <p className="mt-1 text-kemet-ivory/85">{event.location}</p>
        </Container>
      </section>

      <section className="bg-kemet-white py-16">
        <Container className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            {event.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.imageUrl}
                alt={`${event.title} event`}
                className="mb-8 h-64 w-full rounded-sm object-cover"
              />
            )}
            <div className="whitespace-pre-line text-base leading-relaxed text-kemet-charcoal/90">
              {event.description}
            </div>
          </div>

          <aside className="h-fit rounded-sm border border-kemet-black/10 bg-kemet-ivory p-6">
            <h2 className="font-display text-lg font-bold text-kemet-black">Event Details</h2>

            <dl className="mt-4 space-y-2 text-sm text-kemet-charcoal/80">
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-kemet-charcoal">Location</dt>
                <dd className="text-right">{event.location}</dd>
              </div>
              {event.registrationDeadline && (
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-kemet-charcoal">Registration Deadline</dt>
                  <dd className="text-right">{format(event.registrationDeadline, "MMM d, yyyy 'at' h:mm a")}</dd>
                </div>
              )}
              {event.capacity != null && (
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-kemet-charcoal">Capacity</dt>
                  <dd className="text-right">{event.capacity} attendees</dd>
                </div>
              )}
              {!event.isFree && (
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-kemet-charcoal">Price</dt>
                  <dd className="text-right">{formatPriceCents(event.priceCents)}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6">
              {event.status === "CANCELLED" ? (
                <p className="rounded-sm border border-kemet-red/30 bg-kemet-red/10 px-4 py-3 text-sm text-kemet-red">
                  This event has been cancelled.
                </p>
              ) : !registrationOpen ? (
                <p className="rounded-sm border border-kemet-black/10 bg-white px-4 py-3 text-sm text-kemet-charcoal/70">
                  {deadlinePassed
                    ? "The registration deadline for this event has passed."
                    : "Registration is not currently open for this event."}
                </p>
              ) : (
                <LinkButton href="/contact" className="w-full">
                  Contact Us to Attend
                </LinkButton>
              )}
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
