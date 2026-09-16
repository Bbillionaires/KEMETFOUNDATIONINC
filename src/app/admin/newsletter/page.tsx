import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Label, Input, Select } from "@/components/ui/Field";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Newsletter",
};

export default async function AdminNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; active?: string }>;
}) {
  const { q, active } = await searchParams;
  const activeFilter = active === "true" ? true : active === "false" ? false : undefined;

  const where: Prisma.NewsletterSubscriberWhereInput = {
    ...(activeFilter !== undefined && { active: activeFilter }),
    ...(q && { email: { contains: q, mode: "insensitive" } }),
  };

  const [subscribers, activeCount] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ where, orderBy: { subscribedAt: "desc" } }),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-kemet-black">Newsletter Subscribers</h1>
        <p className="text-sm text-kemet-charcoal/70">{activeCount} active subscribers</p>
      </div>

      <form className="mt-6 flex flex-wrap items-end gap-4" method="get">
        <div>
          <Label htmlFor="q">Search email</Label>
          <Input id="q" name="q" defaultValue={q ?? ""} placeholder="name@example.com" className="w-64" />
        </div>
        <div>
          <Label htmlFor="active">Status</Label>
          <Select id="active" name="active" defaultValue={active ?? ""} className="w-40">
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Unsubscribed</option>
          </Select>
        </div>
        <Button type="submit" size="sm">
          Filter
        </Button>
      </form>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-kemet-black/10 text-xs uppercase tracking-wide text-kemet-charcoal/60">
              <th className="py-3 pr-4">Email</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Source</th>
              <th className="py-3 pr-4">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id} className="border-b border-kemet-black/5">
                <td className="py-3 pr-4 font-medium text-kemet-black">{s.email}</td>
                <td className="py-3 pr-4">
                  <Badge tone={s.active ? "green" : "red"}>{s.active ? "Active" : "Unsubscribed"}</Badge>
                </td>
                <td className="py-3 pr-4 text-kemet-charcoal/70">{s.source ?? "—"}</td>
                <td className="py-3 pr-4 text-kemet-charcoal/70">
                  {new Date(s.subscribedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-kemet-charcoal/60">
                  No subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
