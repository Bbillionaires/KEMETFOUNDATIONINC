"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Field";

export function TaxExemptToggle({ initialValue }: { initialValue: boolean }) {
  const [value, setValue] = useState(initialValue ? "true" : "false");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleChange(next: string) {
    setValue(next);
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "org_tax_exempt", value: next }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="max-w-xs">
      <Select value={value} onChange={(e) => handleChange(e.target.value)} disabled={status === "saving"}>
        <option value="true">Yes — tax-exempt (501(c)(3))</option>
        <option value="false">No</option>
      </Select>
      {status === "saved" && <p className="mt-2 text-xs text-kemet-green">Saved.</p>}
      {status === "error" && <p className="mt-2 text-xs text-kemet-red">Couldn&apos;t save. Try again.</p>}
    </div>
  );
}
