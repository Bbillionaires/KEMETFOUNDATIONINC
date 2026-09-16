import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, Badge } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Overview",
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(cents / 100);
}

export default async function AdminOverviewPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalMembers,
    newApplications,
    pendingReview,
    upcomingPublishedEvents,
    totalRegistrations,
    donationTotals,
    recentSubmissions,
  ] = await Promise.all([
    prisma.memberProfile.count(),
    prisma.memberProfile.count({ where: { appliedAt: { gte: thirtyDaysAgo } } }),
    prisma.memberProfile.count({ where: { membershipStatus: "PENDING" } }),
    prisma.event.count({ where: { status: "PUBLISHED", startAt: { gte: new Date() } } }),
    prisma.eventRegistration.count(),
    prisma.donation.aggregate({
      where: { status: "SUCCEEDED" },
      _sum: { amountCents: true },
      _count: true,
    }),
    prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats: { label: string; value: string | number; href: string }[] = [
    { label: "Total Members", value: totalMembers, href: "/admin/members" },
    // Defined as MemberProfile.appliedAt within the last 30 days, regardless of status.
    { label: "New Applications (Last 30 Days)", value: newApplications, href: "/admin/members" },
    { label: "Pending Review", value: pendingReview, href: "/admin/members?status=PENDING" },
    { label: "Upcoming Published Events", value: upcomingPublishedEvents, href: "/admin/events" },
    { label: "Total Event Registrations", value: totalRegistrations, href: "/admin/events" },
    {
      label: "Total Raised (Succeeded)",
      value: formatCurrency(donationTotals._sum.amountCents ?? 0),
      href: "/admin/donations",
    },
    { label: "Successful Donations", value: donationTotals._count, href: "/admin/donations" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-kemet-black">Overview</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="h-full">
              <p className="text-xs font-semibold uppercase tracking-wide text-kemet-charcoal/60">{stat.label}</p>
              <p className="mt-2 font-display text-3xl font-bold text-kemet-black">{stat.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-kemet-black">Recent Contact Submissions</h2>
          <Link href="/admin/contact" className="text-sm font-semibold text-kemet-gold-deep underline">
            View all
          </Link>
        </div>
        <Card className="mt-4">
          {recentSubmissions.length === 0 ? (
            <p className="text-sm text-kemet-charcoal/70">No contact submissions yet.</p>
          ) : (
            <ul className="divide-y divide-kemet-black/10">
              {recentSubmissions.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="font-semibold text-kemet-black">{s.name}</p>
                    <p className="text-xs uppercase tracking-wide text-kemet-charcoal/50">{s.subject}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={s.status === "NEW" ? "gold" : "green"}>{s.status}</Badge>
                    <span className="text-xs text-kemet-charcoal/50">
                      {new Date(s.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
