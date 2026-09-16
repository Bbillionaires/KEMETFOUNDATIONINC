import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Container } from "@/components/ui/Container";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/donations", label: "Donations" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/content", label: "Site Content" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  // Defense in depth: src/middleware.ts already blocks this route for
  // non-admins, but a server-side re-check keeps this layout safe on its own.
  if (!session?.user || (role !== "ADMIN" && role !== "SUPERADMIN")) {
    redirect("/membership/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-kemet-ivory lg:flex-row">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-kemet-gold/20 bg-kemet-black text-kemet-white lg:flex">
        <div className="border-b border-kemet-white/10 px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-kemet-gold">Admin</p>
          <p className="mt-1 font-display text-lg font-bold">Kemet Foundation</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-sm px-3 py-2 text-sm font-medium text-kemet-ivory/80 transition-colors hover:bg-kemet-white/5 hover:text-kemet-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-kemet-white/10 px-6 py-4 text-xs text-kemet-ivory/60">
          <p className="truncate" title={session.user.email ?? undefined}>
            {session.user.email}
          </p>
          <Link href="/" className="mt-2 inline-block font-semibold text-kemet-gold hover:underline">
            ← Back to site
          </Link>
        </div>
      </aside>

      <div className="border-b border-kemet-gold/20 bg-kemet-black text-kemet-white lg:hidden">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4">
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-kemet-gold">Admin</span>
              <span className="block font-display text-base font-bold">Kemet Foundation</span>
            </span>
            <span aria-hidden="true" className="text-kemet-gold group-open:rotate-180 transition-transform">
              ▾
            </span>
          </summary>
          <nav className="space-y-1 border-t border-kemet-white/10 px-3 py-3" aria-label="Admin">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-sm px-3 py-2 text-sm font-medium text-kemet-ivory/80 transition-colors hover:bg-kemet-white/5 hover:text-kemet-gold"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-kemet-white/10 px-3 pt-3 text-xs text-kemet-ivory/60">
              <p className="truncate">{session.user.email}</p>
              <Link href="/" className="mt-2 inline-block font-semibold text-kemet-gold hover:underline">
                ← Back to site
              </Link>
            </div>
          </nav>
        </details>
      </div>

      <div className="flex-1">
        <section className="py-10">
          <Container>{children}</Container>
        </section>
      </div>
    </div>
  );
}
