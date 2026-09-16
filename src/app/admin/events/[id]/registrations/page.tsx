import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Event Registrations",
};

const STATUS_TONE = { CONFIRMED: "green", WAITLISTED: "gold", CANCELLED: "red" } as const;

export default async function EventRegistrationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      registrations: {
        include: { user: { include: { profile: true } } },
        orderBy: { registeredAt: "desc" },
      },
    },
  });
  if (!event) notFound();

  return (
    <div>
      <Link href="/admin/events" className="text-sm font-semibold text-kemet-gold-deep underline">
        ← Back to Events
      </Link>
      <h1 className="mt-4 font-display text-2xl font-bold text-kemet-black">{event.title} — Registrations</h1>
      <p className="mt-1 text-sm text-kemet-charcoal/70">{event.registrations.length} total</p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-kemet-black/10 text-xs uppercase tracking-wide text-kemet-charcoal/60">
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Email</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Registered</th>
            </tr>
          </thead>
          <tbody>
            {event.registrations.map((reg) => (
              <tr key={reg.id} className="border-b border-kemet-black/5">
                <td className="py-3 pr-4 font-medium text-kemet-black">
                  {reg.user.profile ? `${reg.user.profile.firstName} ${reg.user.profile.lastName}` : "—"}
                </td>
                <td className="py-3 pr-4 text-kemet-charcoal/80">{reg.user.email}</td>
                <td className="py-3 pr-4">
                  <Badge tone={STATUS_TONE[reg.status]}>{reg.status}</Badge>
                </td>
                <td className="py-3 pr-4 text-kemet-charcoal/70">
                  {new Date(reg.registeredAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                </td>
              </tr>
            ))}
            {event.registrations.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-kemet-charcoal/60">
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
