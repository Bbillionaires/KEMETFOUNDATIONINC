import { ORG_TIMEZONE } from "@/lib/constants";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: ORG_TIMEZONE,
});

const monthDayYearFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: ORG_TIMEZONE,
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: ORG_TIMEZONE,
});

/** e.g. "Sunday, November 15, 2026" */
export function formatEventDate(date: Date): string {
  return dateFormatter.format(date);
}

/** e.g. "November 15, 2026" */
export function formatEventMonthDayYear(date: Date): string {
  return monthDayYearFormatter.format(date);
}

/** e.g. "10:00 AM" */
export function formatEventTime(date: Date): string {
  return timeFormatter.format(date);
}
