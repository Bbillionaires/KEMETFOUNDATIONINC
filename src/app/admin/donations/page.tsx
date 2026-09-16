import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { DonationStatusSelect } from "@/components/admin/DonationStatusSelect";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Donations",
};

function formatCurrency(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase() || "USD",
  }).format(cents / 100);
}

export default async function AdminDonationsPage() {
  const [donations, totals] = await Promise.all([
    prisma.donation.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.donation.aggregate({
      where: { status: "SUCCEEDED" },
      _sum: { amountCents: true },
      _count: true,
    }),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-kemet-black">Donations</h1>
        <LinkButton href="/admin/donations/new" size="sm">
          + Add Manual Donation
        </LinkButton>
      </div>

      <Card className="mt-8">
        <div className="flex flex-wrap gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-kemet-charcoal/60">
              Total Raised (Succeeded)
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-kemet-black">
              {formatCurrency(totals._sum.amountCents ?? 0, "usd")}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-kemet-charcoal/60">
              Successful Donations
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-kemet-black">{totals._count}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-kemet-charcoal/60">All Records</p>
            <p className="mt-1 font-display text-2xl font-bold text-kemet-black">{donations.length}</p>
          </div>
        </div>
      </Card>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-kemet-black/10 text-xs uppercase tracking-wide text-kemet-charcoal/60">
              <th className="py-3 pr-4">Donor</th>
              <th className="py-3 pr-4">Amount</th>
              <th className="py-3 pr-4">Frequency</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Dedication</th>
              <th className="py-3 pr-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d.id} className="border-b border-kemet-black/5 align-top">
                <td className="py-3 pr-4">
                  <p className="font-medium text-kemet-black">{d.donorName}</p>
                  <p className="text-xs text-kemet-charcoal/60">{d.donorEmail}</p>
                  {d.publicRecognition && (
                    <p className="mt-0.5 text-xs text-kemet-gold-deep">Public recognition</p>
                  )}
                </td>
                <td className="py-3 pr-4 font-semibold text-kemet-black">
                  {formatCurrency(d.amountCents, d.currency)}
                </td>
                <td className="py-3 pr-4 text-kemet-charcoal/80">
                  {d.frequency === "MONTHLY" ? "Monthly" : "One-Time"}
                </td>
                <td className="py-3 pr-4">
                  <DonationStatusSelect donationId={d.id} status={d.status} />
                </td>
                <td className="max-w-[220px] py-3 pr-4 text-kemet-charcoal/70">{d.dedicationMessage || "—"}</td>
                <td className="py-3 pr-4 text-kemet-charcoal/70">
                  {new Date(d.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                </td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-kemet-charcoal/60">
                  No donations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
