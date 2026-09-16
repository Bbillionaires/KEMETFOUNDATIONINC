"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/Field";

const OPTIONS = ["NEW", "READ", "RESOLVED"] as const;

export function ContactStatusSelect({
  submissionId,
  status,
}: {
  submissionId: string;
  status: (typeof OPTIONS)[number];
}) {
  const router = useRouter();
  const [value, setValue] = useState<(typeof OPTIONS)[number]>(status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(next: (typeof OPTIONS)[number]) {
    const previous = value;
    setValue(next);
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/contact/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update status.");
      }
      router.refresh();
    } catch (e) {
      setValue(previous);
      setError(e instanceof Error ? e.message : "Failed to update status.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Select
        value={value}
        disabled={saving}
        onChange={(e) => handleChange(e.target.value as (typeof OPTIONS)[number])}
        className="w-36 py-1.5 text-xs"
      >
        {OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </Select>
      {error && <p className="mt-1 text-xs text-kemet-red">{error}</p>}
    </div>
  );
}
