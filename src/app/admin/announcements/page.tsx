import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { AnnouncementRow } from "@/components/admin/AnnouncementRow";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Announcements",
};

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-kemet-black">Announcements</h1>

      <Card className="mt-8">
        <h2 className="font-display text-lg font-bold text-kemet-black">New Announcement</h2>
        <div className="mt-4">
          <AnnouncementForm mode="create" />
        </div>
      </Card>

      <div className="mt-8 space-y-4">
        {announcements.length === 0 && (
          <Card>
            <p className="text-sm text-kemet-charcoal/70">No announcements yet.</p>
          </Card>
        )}
        {announcements.map((a) => (
          <AnnouncementRow key={a.id} announcement={a} />
        ))}
      </div>
    </div>
  );
}
