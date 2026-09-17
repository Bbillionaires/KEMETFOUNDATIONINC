import Link from "next/link";
import { format } from "date-fns";
import { Card, Badge } from "@/components/ui/Card";

export type EventCardData = {
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  location: string;
  startAt: Date;
  endAt: Date;
  isFree: boolean;
  priceCents: number | null;
};

function formatPriceCents(cents: number | null): string {
  if (cents == null) return "Paid";
  return `$${(cents / 100).toFixed(2)}`;
}

export function EventCard({ event }: { event: EventCardData }) {
  const truncatedDescription =
    event.description.length > 140 ? `${event.description.slice(0, 140).trim()}...` : event.description;

  return (
    <Card className="flex flex-col">
      <div className="-mx-6 -mt-6 mb-4 h-40 overflow-hidden rounded-t-sm">
        {event.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.imageUrl} alt={`${event.title} event`} className="h-full w-full object-cover" />
        ) : (
          <div
            className="pattern-kemet flex h-full w-full items-center justify-center bg-gold-gradient"
            role="img"
            aria-label={`${event.title} — event graphic`}
          >
            <span className="px-4 text-center font-display text-sm font-semibold uppercase tracking-[0.3em] text-kemet-black/70">
              Kemet Foundation
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <Badge tone={event.isFree ? "green" : "gold"}>
          {event.isFree ? "Free" : formatPriceCents(event.priceCents)}
        </Badge>

        <h3 className="mt-3 font-display text-lg font-bold text-kemet-black">{event.title}</h3>

        <p className="mt-1 text-sm font-semibold text-kemet-gold-deep">
          {format(event.startAt, "EEEE, MMMM d, yyyy")}
        </p>
        <p className="text-sm text-kemet-charcoal/70">
          {format(event.startAt, "h:mm a")}&ndash;{format(event.endAt, "h:mm a")} &middot; {event.location}
        </p>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-kemet-charcoal/80">{truncatedDescription}</p>

        <Link
          href={`/events/${event.slug}`}
          className="mt-4 text-sm font-semibold uppercase tracking-wide text-kemet-gold-deep hover:text-kemet-gold"
        >
          View Details &rarr;
        </Link>
      </div>
    </Card>
  );
}
