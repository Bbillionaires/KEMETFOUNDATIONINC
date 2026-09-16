import type { Metadata } from "next";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteContent } from "@/lib/site-content";
import { Card, Badge } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { NewsletterToggle } from "@/components/dashboard/NewsletterToggle";

export const metadata: Metadata = {
  title: "Dashboard",
};

const STATUS_TONE = {
  PENDING: "gold",
  ACTIVE: "green",
  INACTIVE: "red",
  DECLINED: "red",
} as const;

const STATUS_LABEL = {
  PENDING: "Pending Review",
  ACTIVE: "Active Member",
  INACTIVE: "Inactive",
  DECLINED: "Declined",
} as const;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <Card>
        <p className="text-sm text-kemet-charcoal/80">
          You must be signed in to view your dashboard.
        </p>
      </Card>
    );
  }

  const userId = session.user.id;

  const [profile, registrations, announcements, donations, resourcesHtml] = await Promise.all([
    prisma.memberProfile.findUnique({ where: { userId } }),
    prisma.eventRegistration.findMany({
      where: { userId, status: { not: "CANCELLED" }, event: { startAt: { gte: new Date() } } },
      include: { event: true },
      orderBy: { event: { startAt: "asc" } },
    }),
    prisma.announcement.findMany({
      where: {
        isActive: true,
        audience: { in: ["PUBLIC", "MEMBERS"] },
        publishedAt: { lte: new Date() },
      },
      orderBy: { publishedAt: "desc" },
      take: 5,
    }),
    prisma.donation.findMany({
      where: { userId, status: "SUCCEEDED" },
      orderBy: { createdAt: "desc" },
    }),
    getSiteContent(
      "member_resources_html",
      "Member resources will appear here as they are added by the foundation."
    ),
  ]);

  const status = profile?.membershipStatus ?? "PENDING";
  const sanitizedResources = DOMPurify.sanitize(resourcesHtml);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-kemet-black">Membership Status</h2>
              <p className="mt-1 text-sm text-kemet-charcoal/70">
                {status === "PENDING" &&
                  "Your application is being reviewed by the foundation. We'll be in touch soon."}
                {status === "ACTIVE" && "Your membership is active. Thank you for being part of our community."}
                {status === "INACTIVE" && "Your membership is currently inactive."}
                {status === "DECLINED" && "Your membership application was not approved."}
              </p>
            </div>
            <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-kemet-black">Upcoming Events</h2>
            <Link href="/events" className="text-sm font-semibold text-kemet-gold-deep underline">
              Browse events
            </Link>
          </div>
          {registrations.length === 0 ? (
            <p className="mt-4 text-sm text-kemet-charcoal/70">
              You aren&apos;t registered for any upcoming events yet.{" "}
              <Link href="/events" className="font-semibold text-kemet-gold-deep underline">
                Find an event
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-kemet-black/10">
              {registrations.map((reg) => (
                <li key={reg.id} className="py-3">
                  <p className="font-semibold text-kemet-black">{reg.event.title}</p>
                  <p className="text-sm text-kemet-charcoal/70">
                    {new Date(reg.event.startAt).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}{" "}
                    · {reg.event.location}
                  </p>
                  <Badge tone={reg.status === "CONFIRMED" ? "green" : "gold"}>
                    {reg.status === "CONFIRMED" ? "Confirmed" : "Waitlisted"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="font-display text-xl font-bold text-kemet-black">Donation History</h2>
          {donations.length === 0 ? (
            <p className="mt-4 text-sm text-kemet-charcoal/70">
              No donations yet.{" "}
              <Link href="/donate" className="font-semibold text-kemet-gold-deep underline">
                Make a donation
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-kemet-black/10">
              {donations.map((donation) => (
                <li key={donation.id} className="flex items-center justify-between py-3">
                  <span className="text-sm text-kemet-charcoal/80">
                    {new Date(donation.createdAt).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </span>
                  <span className="font-semibold text-kemet-black">
                    ${(donation.amountCents / 100).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="font-display text-xl font-bold text-kemet-black">Member Resources</h2>
          <div
            className="prose prose-sm mt-4 max-w-none text-sm leading-relaxed text-kemet-charcoal/90"
            dangerouslySetInnerHTML={{ __html: sanitizedResources }}
          />
        </Card>
      </div>

      <div className="space-y-8">
        <Card>
          <h2 className="font-display text-lg font-bold text-kemet-black">Announcements</h2>
          {announcements.length === 0 ? (
            <p className="mt-4 text-sm text-kemet-charcoal/70">No announcements at this time.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {announcements.map((a) => (
                <li key={a.id} className="border-b border-kemet-black/10 pb-4 last:border-0 last:pb-0">
                  <p className="font-semibold text-kemet-black">{a.title}</p>
                  <p className="mt-1 text-sm text-kemet-charcoal/70">{a.body}</p>
                  <p className="mt-1 text-xs text-kemet-charcoal/50">
                    {new Date(a.publishedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold text-kemet-black">Preferences</h2>
          <div className="mt-4">
            <NewsletterToggle initialValue={profile?.newsletterOptIn ?? false} />
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold text-kemet-black">Your Profile</h2>
          <p className="mt-2 text-sm text-kemet-charcoal/70">
            Keep your contact information up to date.
          </p>
          <LinkButton href="/dashboard/profile" variant="secondary" size="sm" className="mt-4">
            Edit Profile
          </LinkButton>
        </Card>
      </div>
    </div>
  );
}
