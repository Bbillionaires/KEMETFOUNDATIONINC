"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

type TeamMember = {
  id: string;
  name: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
};

export function TeamMemberRow({ member }: { member: TeamMember }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  async function toggleActive() {
    setBusy(true);
    try {
      await fetch(`/api/admin/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !member.isActive }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Remove ${member.name} from the team list?`)) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/team/${member.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <Card>
        <TeamMemberForm
          mode="edit"
          memberId={member.id}
          initialValues={member}
          onSaved={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-display text-lg font-bold text-kemet-black">{member.name}</h3>
            <Badge tone={member.isActive ? "green" : "red"}>{member.isActive ? "Visible" : "Hidden"}</Badge>
          </div>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-kemet-gold-deep">{member.title}</p>
          <p className="mt-1 text-xs text-kemet-charcoal/50">Sort order: {member.sortOrder}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button type="button" size="sm" variant="secondary" disabled={busy} onClick={toggleActive}>
            {member.isActive ? "Hide" : "Show"}
          </Button>
          <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
