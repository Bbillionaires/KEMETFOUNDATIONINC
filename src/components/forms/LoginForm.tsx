"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Label, Input, FieldGroup } from "@/components/ui/Field";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(
        "Invalid email or password, or too many attempts — please try again shortly."
      );
      setSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-10 rounded-sm border border-kemet-black/10 bg-white p-6 shadow-sm sm:p-8"
      >
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-sm border border-kemet-red/40 bg-kemet-red/10 px-4 py-3 text-sm text-kemet-red"
          >
            {error}
          </div>
        )}

        <FieldGroup>
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="password" required>
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FieldGroup>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-kemet-charcoal/80">
        Not a member yet?{" "}
        <Link href="/membership/register" className="font-semibold text-kemet-gold-deep underline">
          Become a member
        </Link>
      </p>
    </>
  );
}
