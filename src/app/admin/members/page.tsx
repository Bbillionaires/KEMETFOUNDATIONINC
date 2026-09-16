import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { MembershipStatus } from "@prisma/client";
import { MemberStatusSelect } from "@/components/admin/MemberStatusSelect";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Members",
};

const STATUS_OPTIONS: MembershipStatus[] = ["PENDING", "ACTIVE", "INACTIVE", "DECLINED"];

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = STATUS_OPTIONS.includes(status as MembershipStatus)
    ? (status as MembershipStatus)
    : undefined;

  const members = await prisma.memberProfile.findMany({
    where: filter ? { membershipStatus: filter } : undefined,
    include: { user: { select: { email: true } } },
    orderBy: { appliedAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-kemet-black">Members</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterLink label="All" href="/admin/members" active={!filter} />
        {STATUS_OPTIONS.map((s) => (
          <FilterLink key={s} label={s} href={`/admin/members?status=${s}`} active={filter === s} />
        ))}
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-kemet-black/10 text-xs uppercase tracking-wide text-kemet-charcoal/60">
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Email</th>
              <th className="py-3 pr-4">Location</th>
              <th className="py-3 pr-4">Applied</th>
              <th className="py-3 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-kemet-black/5 align-top">
                <td className="py-3 pr-4 font-medium text-kemet-black">
                  {m.firstName} {m.lastName}
                </td>
                <td className="py-3 pr-4 text-kemet-charcoal/80">{m.user.email}</td>
                <td className="py-3 pr-4 text-kemet-charcoal/70">
                  {m.city}, {m.state}
                </td>
                <td className="py-3 pr-4 text-kemet-charcoal/70">
                  {new Date(m.appliedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                </td>
                <td className="py-3 pr-4">
                  <MemberStatusSelect memberId={m.id} status={m.membershipStatus} />
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-kemet-charcoal/60">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
        active
          ? "border-kemet-gold bg-kemet-gold/15 text-kemet-gold-deep"
          : "border-kemet-black/15 text-kemet-charcoal/70 hover:border-kemet-gold/40"
      }`}
    >
      {label}
    </Link>
  );
}
