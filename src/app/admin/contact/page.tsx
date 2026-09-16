import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { ContactStatus } from "@prisma/client";
import { Card, Badge } from "@/components/ui/Card";
import { ContactStatusSelect } from "@/components/admin/ContactStatusSelect";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Submissions",
};

const STATUS_OPTIONS: ContactStatus[] = ["NEW", "READ", "RESOLVED"];
const STATUS_TONE: Record<ContactStatus, "gold" | "green" | "red"> = {
  NEW: "gold",
  READ: "green",
  RESOLVED: "green",
};

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = STATUS_OPTIONS.includes(status as ContactStatus) ? (status as ContactStatus) : undefined;

  const submissions = await prisma.contactSubmission.findMany({
    where: filter ? { status: filter } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-kemet-black">Contact Submissions</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterLink label="All" href="/admin/contact" active={!filter} />
        {STATUS_OPTIONS.map((s) => (
          <FilterLink key={s} label={s} href={`/admin/contact?status=${s}`} active={filter === s} />
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {submissions.length === 0 && (
          <Card>
            <p className="text-sm text-kemet-charcoal/70">No submissions found.</p>
          </Card>
        )}
        {submissions.map((s) => (
          <Card key={s.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-lg font-bold text-kemet-black">{s.name}</h2>
                  <Badge tone={STATUS_TONE[s.status]}>{s.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-kemet-charcoal/70">
                  <a href={`mailto:${s.email}`} className="font-semibold text-kemet-gold-deep underline">
                    {s.email}
                  </a>
                  {s.phone && ` · ${s.phone}`}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-kemet-charcoal/50">{s.subject}</p>
                <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm text-kemet-charcoal/85">{s.message}</p>
                <p className="mt-2 text-xs text-kemet-charcoal/50">
                  {new Date(s.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              <ContactStatusSelect submissionId={s.id} status={s.status} />
            </div>
          </Card>
        ))}
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
