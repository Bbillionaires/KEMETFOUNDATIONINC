"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { KemetLogo } from "@/components/brand/KemetLogo";
import { LinkButton } from "@/components/ui/Button";
import { NAV_LINKS } from "@/lib/constants";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-kemet-gold/20 bg-kemet-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Kemet Foundation Inc home">
          <KemetLogo className="h-14 w-auto" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold uppercase tracking-wide transition-colors hover:text-kemet-gold-deep ${
                pathname === link.href ? "text-kemet-gold-deep" : "text-kemet-black"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LinkButton href="/donate" variant="secondary" size="sm">
            Donate
          </LinkButton>
          <LinkButton href="/membership" variant="primary" size="sm">
            Become a Member
          </LinkButton>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-sm border border-kemet-black/20 p-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-kemet-gold/20 bg-kemet-white px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-base font-semibold uppercase tracking-wide text-kemet-black"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <LinkButton href="/donate" variant="secondary" className="w-full">
              Donate
            </LinkButton>
            <LinkButton href="/membership" variant="primary" className="w-full">
              Become a Member
            </LinkButton>
          </div>
        </nav>
      )}
    </header>
  );
}
