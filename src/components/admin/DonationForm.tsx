"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Label, Input, Textarea, Select, FieldGroup, Checkbox } from "@/components/ui/Field";

type Frequency = "ONE_TIME" | "MONTHLY";
type DonationStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED" | "CANCELLED";

export function DonationForm() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("ONE_TIME");
  const [dedicationMessage, setDedicationMessage] = useState("");
  const [publicRecognition, setPublicRecognition] = useState(false);
  const [status, setStatus] = useState<DonationStatus>("SUCCEEDED");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const dollars = Number(amount);
    if (!Number.isFinite(dollars) || dollars < 5) {
      setError("Enter a valid amount of at least $5.");
      return;
    }
    if (!donorName.trim() || !donorEmail.trim()) {
      setError("Donor name and email are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents: Math.round(dollars * 100),
          donorName,
          donorEmail,
          frequency,
          dedicationMessage,
          publicRecognition,
          status,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      router.push("/admin/donations");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl">
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-sm border border-kemet-red/40 bg-kemet-red/10 px-4 py-3 text-sm text-kemet-red"
        >
          {error}
        </div>
      )}

      <FieldGroup>
        <Label htmlFor="donorName" required>
          Donor Name
        </Label>
        <Input id="donorName" value={donorName} onChange={(e) => setDonorName(e.target.value)} required />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="donorEmail" required>
          Donor Email
        </Label>
        <Input
          id="donorEmail"
          type="email"
          value={donorEmail}
          onChange={(e) => setDonorEmail(e.target.value)}
          required
        />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="amount" required>
          Amount (USD)
        </Label>
        <Input
          id="amount"
          type="number"
          min={5}
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="frequency" required>
          Frequency
        </Label>
        <Select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)}>
          <option value="ONE_TIME">One-Time</option>
          <option value="MONTHLY">Monthly</option>
        </Select>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="status" required>
          Status
        </Label>
        <Select id="status" value={status} onChange={(e) => setStatus(e.target.value as DonationStatus)}>
          <option value="SUCCEEDED">Succeeded</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
          <option value="CANCELLED">Cancelled</option>
        </Select>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="dedicationMessage">Dedication Message</Label>
        <Textarea
          id="dedicationMessage"
          rows={3}
          value={dedicationMessage}
          onChange={(e) => setDedicationMessage(e.target.value)}
        />
      </FieldGroup>

      <FieldGroup>
        <Checkbox
          id="publicRecognition"
          label="Show this donor's name in public recognition"
          checked={publicRecognition}
          onChange={(e) => setPublicRecognition(e.target.checked)}
        />
      </FieldGroup>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Add Donation"}
      </Button>
    </form>
  );
}
