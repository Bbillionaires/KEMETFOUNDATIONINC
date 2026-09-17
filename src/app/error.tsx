"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button, LinkButton } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] items-center bg-kemet-white py-20">
      <Container className="max-w-lg text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-kemet-gold-deep">
          Something went wrong
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-kemet-black">
          We hit a snag loading this page
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-kemet-charcoal/70">
          Please try again in a moment. If the problem continues, contact us and we&apos;ll help
          right away.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => reset()} size="lg">
            Try Again
          </Button>
          <LinkButton href="/" variant="outline" size="lg">
            Back to Home
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
