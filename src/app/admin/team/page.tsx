import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { TeamMemberRow } from "@/components/admin/TeamMemberRow";

export const metadata: Metadata = {
  title: "Team",
};

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-kemet-black">Team</h1>
      <p className="mt-2 max-w-2xl text-sm text-kemet-charcoal/70">
        Only name, title, display order, and visibility are stored for team members. No contact details,
        photos, or bios are collected, per our privacy policy.
      </p>

      <Card className="mt-8">
        <h2 className="font-display text-lg font-bold text-kemet-black">Add Team Member</h2>
        <div className="mt-4">
          <TeamMemberForm mode="create" />
        </div>
      </Card>

      <div className="mt-8 space-y-4">
        {members.length === 0 && (
          <Card>
            <p className="text-sm text-kemet-charcoal/70">No team members yet.</p>
          </Card>
        )}
        {members.map((member) => (
          <TeamMemberRow key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
