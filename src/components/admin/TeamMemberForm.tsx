"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { teamMemberSchema } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Label, ErrorText, Input, FieldGroup, Checkbox } from "@/components/ui/Field";

type TeamMemberValues = z.infer<typeof teamMemberSchema>;

export function TeamMemberForm({
  mode,
  memberId,
  initialValues,
  onSaved,
  onCancel,
}: {
  mode: "create" | "edit";
  memberId?: string;
  initialValues?: Partial<TeamMemberValues>;
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
  } = useForm<TeamMemberValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: { name: "", title: "", sortOrder: 0, isActive: true, ...initialValues },
  });

  const idPrefix = `${mode}-${memberId ?? "new"}`;

  async function onSubmit(values: TeamMemberValues) {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch(mode === "create" ? "/api/admin/team" : `/api/admin/team/${memberId}`, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      if (mode === "create") {
        reset({ name: "", title: "", sortOrder: 0, isActive: true });
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
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_110px]">
        <FieldGroup>
          <Label htmlFor={`name-${idPrefix}`} required>
            Name
          </Label>
          <Input id={`name-${idPrefix}`} {...register("name")} />
          <ErrorText>{errors.name?.message}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor={`title-${idPrefix}`} required>
            Title
          </Label>
          <Input id={`title-${idPrefix}`} {...register("title")} />
          <ErrorText>{errors.title?.message}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor={`sortOrder-${idPrefix}`}>Order</Label>
          <Input
            id={`sortOrder-${idPrefix}`}
            type="number"
            {...register("sortOrder", { setValueAs: (v) => (v === "" ? 0 : Number(v)) })}
          />
        </FieldGroup>
      </div>
      <FieldGroup>
        <Checkbox id={`isActive-${idPrefix}`} label="Visible on public team page" {...register("isActive")} />
      </FieldGroup>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? "Saving..." : mode === "create" ? "Add Team Member" : "Save"}
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
