"use client";

import { useState, type ReactNode } from "react";
import { EventCalendar, type CalendarEvent } from "@/components/events/EventCalendar";

type View = "list" | "calendar";

export function EventsViewToggle({ events, children }: { events: CalendarEvent[]; children: ReactNode }) {
  const [view, setView] = useState<View>("list");

  const buttonClasses = (active: boolean) =>
    `rounded-sm px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
      active ? "bg-kemet-gold text-kemet-black" : "text-kemet-charcoal/70 hover:bg-kemet-gold/10"
    }`;

  return (
    <div>
      <div
        role="group"
        aria-label="Choose events view"
        className="mb-8 inline-flex gap-1 rounded-sm border border-kemet-black/15 bg-white p-1"
      >
        <button type="button" aria-pressed={view === "list"} className={buttonClasses(view === "list")} onClick={() => setView("list")}>
          List View
        </button>
        <button
          type="button"
          aria-pressed={view === "calendar"}
          className={buttonClasses(view === "calendar")}
          onClick={() => setView("calendar")}
        >
          Calendar View
        </button>
      </div>

      {view === "list" ? children : <EventCalendar events={events} />}
    </div>
  );
}
