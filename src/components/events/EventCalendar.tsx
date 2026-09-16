"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

export type CalendarEvent = {
  id: string;
  slug: string;
  title: string;
  /** ISO date string */
  startAt: string;
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function EventCalendar({ events }: { events: CalendarEvent[] }) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const headingId = useId();

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const key = format(new Date(event.startAt), "yyyy-MM-dd");
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [events]);

  return (
    <div className="rounded-sm border border-kemet-black/10 bg-white p-4 sm:p-6" aria-labelledby={headingId}>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCursor((c) => subMonths(c, 1))}
          aria-label="Previous month"
          className="rounded-sm p-2 text-kemet-black hover:bg-kemet-gold/10"
        >
          &larr;
        </button>
        <h3 id={headingId} className="font-display text-lg font-bold text-kemet-black">
          {format(cursor, "MMMM yyyy")}
        </h3>
        <button
          type="button"
          onClick={() => setCursor((c) => addMonths(c, 1))}
          aria-label="Next month"
          className="rounded-sm p-2 text-kemet-black hover:bg-kemet-gold/10"
        >
          &rarr;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-kemet-charcoal/50">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} aria-hidden="true">
            {label}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, cursor);
          const hasEvents = dayEvents.length > 0;
          const dayLabel = format(day, "MMMM d, yyyy");

          if (!hasEvents) {
            return (
              <div
                key={key}
                className={`flex h-14 flex-col items-center justify-start rounded-sm p-1 text-sm sm:h-16 ${
                  inMonth ? "text-kemet-charcoal" : "text-kemet-charcoal/30"
                } ${isToday(day) ? "border border-kemet-gold/50" : ""}`}
              >
                <span aria-hidden="true">{format(day, "d")}</span>
                <span className="sr-only">{dayLabel}, no events</span>
              </div>
            );
          }

          const first = dayEvents[0]!;
          const label =
            dayEvents.length > 1
              ? `${dayEvents.length} events on ${dayLabel}: ${dayEvents.map((e) => e.title).join(", ")}`
              : `${first.title} on ${dayLabel}`;

          return (
            <Link
              key={key}
              href={`/events/${first.slug}`}
              aria-label={label}
              className={`flex h-14 flex-col items-center justify-start gap-0.5 rounded-sm border border-kemet-gold/50 bg-kemet-gold/10 p-1 text-sm hover:bg-kemet-gold/20 sm:h-16 ${
                inMonth ? "text-kemet-black" : "text-kemet-black/50"
              }`}
            >
              <span aria-hidden="true">{format(day, "d")}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-kemet-gold-deep" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
