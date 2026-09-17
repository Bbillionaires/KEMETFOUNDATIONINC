import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { EVENTS, getEventBySlug } from "@/lib/events-data";
import { ORG_EMAIL } from "@/lib/constants";

export function generateStaticParams() {
  return EVENTS.map((event) => ({ slug: event.slug }));
}

function formatPriceCents(cents: number | null): string {
  if (cents == null) return "Paid";
  return `$${(cents / 100).toFixed(2)}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};

  return {
    title: event.title,
    description: event.description.slice(0, 160),
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const startAt = new Date(event.startAt);
  const endAt = new Date(event.endAt);

  return (
    <>
      <section className="pattern-kemet bg-kemet-black py-16 text-kemet-white">
        <Container>
          <Badge tone={event.isFree ? "green" : "gold"}>
            {event.isFree ? "Free" : formatPriceCents(event.priceCents)}
          </Badge>

          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{event.title}</h1>
          <p className="mt-3 text-kemet-ivory/85">
            {format(startAt, "EEEE, MMMM d, yyyy")} &middot; {format(startAt, "h:mm a")}&ndash;
            {format(endAt, "h:mm a")}
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
            <h2 className="font-display text-lg font-bold text-kemet-black">Details</h2>

            <dl className="mt-4 space-y-2 text-sm text-kemet-charcoal/80">
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-kemet-charcoal">Location</dt>
                <dd className="text-right">{event.location}</dd>
              </div>
              {!event.isFree && (
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-kemet-charcoal">Price</dt>
                  <dd className="text-right">{formatPriceCents(event.priceCents)}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6 space-y-3">
              <p className="text-sm text-kemet-charcoal/80">
                Contact us to let us know you&rsquo;re coming or to ask any questions.
              </p>
              <LinkButton href={`/contact?subject=EVENTS`} className="w-full">
                Contact Us
              </LinkButton>
              <a
                href={`mailto:${ORG_EMAIL}`}
                className="block text-center text-sm font-semibold text-kemet-gold-deep hover:underline"
              >
                {ORG_EMAIL}
              </a>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
