"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/Field";

export function NewsletterToggle({ initialValue }: { initialValue: boolean }) {
  const [checked, setChecked] = useState(initialValue);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function toggle() {
    const next = !checked;
    setChecked(next);
    setStatus("saving");
    try {
      const res = await fetch("/api/member/newsletter", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsletterOptIn: next }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
    } catch {
      setChecked(!next);
      setStatus("error");
    }
  }

  return (
    <div>
      <Checkbox
        id="newsletterOptIn"
        label="Receive newsletter updates from Kemet Foundation Inc."
        checked={checked}
        onChange={toggle}
      />
      {status === "saved" && <p className="mt-2 text-xs text-kemet-green">Preference saved.</p>}
      {status === "error" && (
        <p className="mt-2 text-xs text-kemet-red">Couldn&apos;t save. Please try again.</p>
      )}
    </div>
  );
}
