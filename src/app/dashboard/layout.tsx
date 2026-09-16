import type { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";

const TABS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/profile", label: "Profile" },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  let firstName: string | null = null;
  if (session?.user?.id) {
    const profile = await prisma.memberProfile.findUnique({
      where: { userId: session.user.id },
      select: { firstName: true },
    });
    firstName = profile?.firstName ?? null;
  }

  return (
    <div className="bg-kemet-ivory">
      <section className="border-b border-kemet-black/10 bg-kemet-black py-10 text-kemet-white">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-kemet-gold">
            Member Dashboard
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
            {firstName ? `Welcome, ${firstName}` : "Welcome"}
          </h1>
        </Container>
      </section>

      <section className="border-b border-kemet-black/10 bg-white">
        <Container>
          <nav className="flex gap-6" aria-label="Dashboard">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="border-b-2 border-transparent py-4 text-sm font-semibold uppercase tracking-wide text-kemet-charcoal transition-colors hover:border-kemet-gold hover:text-kemet-gold-deep"
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </Container>
      </section>

      <section className="py-12">
        <Container>{children}</Container>
      </section>
    </div>
  );
}
