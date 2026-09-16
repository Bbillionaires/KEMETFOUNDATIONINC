"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type RegistrationStatus = "CONFIRMED" | "WAITLISTED";

export function RegisterButton({
  eventId,
  initialRegistration,
}: {
  eventId: string;
  initialRegistration: { status: RegistrationStatus } | null;
}) {
  const [registration, setRegistration] = useState(initialRegistration);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setRegistration({ status: data.status as RegistrationStatus });
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setRegistration(null);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (registration) {
    return (
      <div>
        <p
          role="status"
          className="rounded-sm border border-kemet-green/30 bg-kemet-green/10 px-4 py-3 text-sm font-semibold text-kemet-green"
        >
          {registration.status === "CONFIRMED"
            ? "You're confirmed for this event."
            : "You're on the waitlist for this event. We'll email you if a spot opens up."}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 w-full border-kemet-red/40 text-kemet-red hover:bg-kemet-red/10"
          onClick={handleCancel}
          disabled={loading}
        >
          {loading ? "Cancelling..." : "Cancel my registration"}
        </Button>
        {error && (
          <p role="alert" className="mt-2 text-sm text-kemet-red">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <Button type="button" onClick={handleRegister} disabled={loading} className="w-full">
        {loading ? "Registering..." : "Register for this Event"}
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-kemet-red">
          {error}
        </p>
      )}
    </div>
  );
}
