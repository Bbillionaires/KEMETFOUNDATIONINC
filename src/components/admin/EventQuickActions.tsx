"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";

export function EventQuickActions({
  eventId,
  status,
  hasRegistrations,
}: {
  eventId: string;
  status: EventStatus;
  hasRegistrations: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(next: EventStatus) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update event.");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this event permanently? This cannot be undone.")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to delete event.");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap justify-end gap-2">
        {status !== "PUBLISHED" && (
          <Button type="button" size="sm" variant="secondary" disabled={busy} onClick={() => setStatus("PUBLISHED")}>
            Publish
          </Button>
        )}
        {status === "PUBLISHED" && (
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => setStatus("DRAFT")}>
            Unpublish
          </Button>
        )}
        {status !== "CANCELLED" && (
          <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={() => setStatus("CANCELLED")}>
            Cancel
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={busy || hasRegistrations}
          onClick={handleDelete}
          title={hasRegistrations ? "This event has registrations. Cancel it instead of deleting." : undefined}
        >
          Delete
        </Button>
      </div>
      {error && <p className="text-xs text-kemet-red">{error}</p>}
    </div>
  );
}
