import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-sm border border-kemet-black/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-gold ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "green" | "red" }) {
  const toneClasses = {
    gold: "bg-kemet-gold/15 text-kemet-gold-deep border-kemet-gold/40",
    green: "bg-kemet-green/10 text-kemet-green border-kemet-green/30",
    red: "bg-kemet-red/10 text-kemet-red border-kemet-red/30",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
