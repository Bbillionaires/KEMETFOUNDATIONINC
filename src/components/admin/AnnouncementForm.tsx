"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { announcementSchema } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Label, ErrorText, Input, Textarea, Select, FieldGroup, Checkbox } from "@/components/ui/Field";

type AnnouncementValues = z.infer<typeof announcementSchema>;

export function AnnouncementForm({
  mode,
  announcementId,
  initialValues,
  onSaved,
  onCancel,
}: {
  mode: "create" | "edit";
  announcementId?: string;
  initialValues?: Partial<AnnouncementValues>;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: "", body: "", audience: "PUBLIC", isActive: true, ...initialValues },
  });

  const idPrefix = `${mode}-${announcementId ?? "new"}`;

  async function onSubmit(values: AnnouncementValues) {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch(
        mode === "create" ? "/api/admin/announcements" : `/api/admin/announcements/${announcementId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      if (mode === "create") {
        reset({ title: "", body: "", audience: "PUBLIC", isActive: true });
      }
      router.refresh();
      onSaved?.();
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <div
          role="alert"
          className="mb-4 rounded-sm border border-kemet-red/40 bg-kemet-red/10 px-4 py-2 text-sm text-kemet-red"
        >
          {serverError}
        </div>
      )}
      <FieldGroup>
        <Label htmlFor={`title-${idPrefix}`} required>
          Title
        </Label>
        <Input id={`title-${idPrefix}`} {...register("title")} />
        <ErrorText>{errors.title?.message}</ErrorText>
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor={`body-${idPrefix}`} required>
          Body
        </Label>
        <Textarea id={`body-${idPrefix}`} rows={4} {...register("body")} />
        <ErrorText>{errors.body?.message}</ErrorText>
      </FieldGroup>
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor={`audience-${idPrefix}`} required>
            Audience
          </Label>
          <Select id={`audience-${idPrefix}`} {...register("audience")}>
            <option value="PUBLIC">Public</option>
            <option value="MEMBERS">Members Only</option>
          </Select>
        </FieldGroup>
        <FieldGroup>
          <Checkbox id={`isActive-${idPrefix}`} label="Active (visible)" {...register("isActive")} />
        </FieldGroup>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? "Saving..." : mode === "create" ? "Post Announcement" : "Save"}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
