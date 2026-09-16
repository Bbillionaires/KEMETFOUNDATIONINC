"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donationSchema, type DonationInput } from "@/lib/validations";
import { DONATION_PRESETS_CENTS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Label, ErrorText, Input, Textarea, FieldGroup, Checkbox } from "@/components/ui/Field";

const FREQUENCIES = [
  { value: "ONE_TIME", label: "One-Time" },
  { value: "MONTHLY", label: "Monthly" },
] as const;

function formatDollars(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function DonateForm() {
  const [customSelected, setCustomSelected] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "unavailable">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DonationInput>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amountCents: DONATION_PRESETS_CENTS[1],
      frequency: "ONE_TIME",
      donorName: "",
      donorEmail: "",
      dedicationMessage: "",
      publicRecognition: false,
    },
  });

  const frequency = watch("frequency");
  const amountCents = watch("amountCents");

  function selectPreset(value: number) {
    setCustomSelected(false);
    setCustomAmount("");
    setValue("amountCents", value, { shouldValidate: true });
  }

  function onCustomChange(raw: string) {
    setCustomAmount(raw);
    const dollars = parseFloat(raw);
    if (!Number.isNaN(dollars) && dollars > 0) {
      setValue("amountCents", Math.round(dollars * 100), { shouldValidate: true });
    } else {
      setValue("amountCents", 0, { shouldValidate: true });
    }
  }

  async function onSubmit(data: DonationInput) {
    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/donations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 503) {
        setStatus("unavailable");
        return;
      }

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }

      if (!body.url) {
        throw new Error("Something went wrong starting checkout. Please try again.");
      }

      window.location.href = body.url;
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "unavailable") {
    return (
      <div
        role="alert"
        className="rounded-sm border border-kemet-gold/40 bg-kemet-gold/10 p-6 text-sm leading-relaxed text-kemet-charcoal"
      >
        Online giving is being finalized. Please contact us at the email in our footer to make a
        donation in the meantime.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Label htmlFor="frequency-one-time">Frequency</Label>
        <div className="flex gap-3" role="radiogroup" aria-label="Donation frequency">
          {FREQUENCIES.map((f) => (
            <button
              key={f.value}
              type="button"
              id={`frequency-${f.value === "ONE_TIME" ? "one-time" : "monthly"}`}
              role="radio"
              aria-checked={frequency === f.value}
              onClick={() => setValue("frequency", f.value, { shouldValidate: true })}
              className={`flex-1 rounded-sm border px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors ${
                frequency === f.value
                  ? "border-kemet-gold-deep bg-kemet-gold text-kemet-black"
                  : "border-kemet-black/20 bg-white text-kemet-charcoal hover:border-kemet-gold"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="amount-custom">Amount</Label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {DONATION_PRESETS_CENTS.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-pressed={!customSelected && amountCents === preset}
              onClick={() => selectPreset(preset)}
              className={`rounded-sm border px-3 py-2.5 text-sm font-semibold transition-colors ${
                !customSelected && amountCents === preset
                  ? "border-kemet-gold-deep bg-kemet-gold text-kemet-black"
                  : "border-kemet-black/20 bg-white text-kemet-charcoal hover:border-kemet-gold"
              }`}
            >
              {formatDollars(preset)}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            aria-pressed={customSelected}
            onClick={() => setCustomSelected(true)}
            className={`shrink-0 rounded-sm border px-3 py-2.5 text-sm font-semibold transition-colors ${
              customSelected
                ? "border-kemet-gold-deep bg-kemet-gold text-kemet-black"
                : "border-kemet-black/20 bg-white text-kemet-charcoal hover:border-kemet-gold"
            }`}
          >
            Custom
          </button>
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-kemet-charcoal/60">
              $
            </span>
            <Input
              id="amount-custom"
              type="number"
              inputMode="decimal"
              min={5}
              step="1"
              placeholder="Custom amount"
              value={customAmount}
              onFocus={() => setCustomSelected(true)}
              onChange={(e) => onCustomChange(e.target.value)}
              className="pl-7"
            />
          </div>
        </div>
        <ErrorText>{errors.amountCents?.message}</ErrorText>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="donorName" required>
          Your Name
        </Label>
        <Input id="donorName" autoComplete="name" {...register("donorName")} />
        <ErrorText>{errors.donorName?.message}</ErrorText>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="donorEmail" required>
          Your Email
        </Label>
        <Input id="donorEmail" type="email" autoComplete="email" {...register("donorEmail")} />
        <ErrorText>{errors.donorEmail?.message}</ErrorText>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="dedicationMessage">Dedication / Message (optional)</Label>
        <Textarea
          id="dedicationMessage"
          rows={3}
          placeholder="In honor of..."
          {...register("dedicationMessage")}
        />
        <ErrorText>{errors.dedicationMessage?.message}</ErrorText>
      </FieldGroup>

      <FieldGroup>
        <Checkbox
          id="publicRecognition"
          label="Allow my name to be publicly recognized on our donor wall."
          {...register("publicRecognition")}
        />
      </FieldGroup>

      {status === "error" && (
        <p role="alert" className="mb-4 text-sm text-kemet-red">
          {errorMessage}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting"
          ? "Redirecting to Checkout..."
          : `Donate ${formatDollars(amountCents || 0)}${frequency === "MONTHLY" ? "/mo" : ""}`}
      </Button>
    </form>
  );
}
