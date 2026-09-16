import type { Metadata } from "next";
import { EventForm } from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Event",
};

export default function NewEventPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-kemet-black">New Event</h1>
      <div className="mt-8">
        <EventForm mode="create" />
      </div>
    </div>
  );
}
