"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";

type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: "PUBLIC" | "MEMBERS";
  isActive: boolean;
  publishedAt: string | Date;
};

export function AnnouncementRow({ announcement }: { announcement: Announcement }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this announcement?")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/announcements/${announcement.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <Card>
        <AnnouncementForm
          mode="edit"
          announcementId={announcement.id}
          initialValues={announcement}
          onSaved={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-display text-lg font-bold text-kemet-black">{announcement.title}</h3>
            <Badge tone={announcement.audience === "MEMBERS" ? "gold" : "green"}>{announcement.audience}</Badge>
            <Badge tone={announcement.isActive ? "green" : "red"}>
              {announcement.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl whitespace-pre-wrap text-sm text-kemet-charcoal/85">{announcement.body}</p>
          <p className="mt-2 text-xs text-kemet-charcoal/50">
            {new Date(announcement.publishedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
