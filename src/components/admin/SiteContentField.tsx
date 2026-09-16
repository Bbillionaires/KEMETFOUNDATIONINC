"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label, Textarea } from "@/components/ui/Field";

export function SiteContentField({
  fieldKey,
  label,
  description,
  initialValue,
  rows = 4,
}: {
  fieldKey: string;
  label: string;
  description?: string;
  initialValue: string;
  rows?: number;
}) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSave() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: fieldKey, value }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mb-8 border-b border-kemet-black/10 pb-8 last:mb-0 last:border-0 last:pb-0">
      <Label htmlFor={fieldKey}>{label}</Label>
      {description && <p className="mb-2 text-xs text-kemet-charcoal/60">{description}</p>}
      <Textarea
        id={fieldKey}
        rows={rows}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setStatus("idle");
        }}
      />
      <div className="mt-3 flex items-center gap-3">
        <Button type="button" size="sm" onClick={handleSave} disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : "Save"}
        </Button>
        {status === "saved" && <span className="text-xs text-kemet-green">Saved.</span>}
        {status === "error" && <span className="text-xs text-kemet-red">Couldn&apos;t save. Try again.</span>}
      </div>
    </div>
  );
}
