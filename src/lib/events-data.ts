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

export const EVENTS: EventRecord[] = [
  {
    slug: "remember-the-works-of-marcus-garvey",
    title: "Remember the Works of Marcus M. Garvey",
    description: `Kemet Foundation Inc presents "Remember the Works of Marcus M. Garvey" — a family affair celebrating the history and legacy of Marcus Mosiah Garvey, who gave us the Red, Black & Green flag ("The Universal Africa Flag") and taught us: "Up ye mighty race, accomplish what ye will" and "A race that knows not its history is like a tree without roots."

The day includes history, live music performance, poets, art & craft, and food. Bring peace, harmony, respect — and chairs.

Starts 10 AM until evening.

For more info: (904) 888-0094 / KemetFoundationInINC@gmail.com`,
    imageUrl: "/events/marcus-garvey-remembrance.jpg",
    location: "Rainhaver Park, 5198 118th St, Jacksonville, FL 32244",
    startAt: "2026-11-15T10:00:00-05:00",
    endAt: "2026-11-15T18:00:00-05:00",
    isFree: true,
    priceCents: null,
  },
];

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
