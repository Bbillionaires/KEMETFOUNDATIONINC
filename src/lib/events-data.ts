/**
 * Static event listing. This site has no database or admin panel, so
 * events are managed directly in code: to add, edit, or remove an event,
 * edit this file and redeploy the site.
 *
 * `startAt`/`endAt` use ISO 8601 strings (parsed to Date at read time).
 * Leave `imageUrl` null to fall back to a brand-styled placeholder graphic.
 */
export type EventRecord = {
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  location: string;
  startAt: string;
  endAt: string;
  isFree: boolean;
  priceCents: number | null;
};

// No events have been added yet — this array is intentionally empty rather
// than seeded with placeholder events. Add real events here as they're
// scheduled.
export const EVENTS: EventRecord[] = [];

export function getUpcomingEvents(limit?: number): EventRecord[] {
  const now = new Date();
  const upcoming = EVENTS.filter((e) => new Date(e.startAt) >= now).sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getPastEvents(): EventRecord[] {
  const now = new Date();
  return EVENTS.filter((e) => new Date(e.startAt) < now).sort(
    (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
  );
}

export function getEventBySlug(slug: string): EventRecord | undefined {
  return EVENTS.find((e) => e.slug === slug);
}
