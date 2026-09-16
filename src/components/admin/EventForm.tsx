"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { eventInputSchema } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Label, ErrorText, Input, Textarea, Select, FieldGroup, Checkbox } from "@/components/ui/Field";

type EventFormValues = z.infer<typeof eventInputSchema>;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Converts a Date (or ISO string) to the value shape <input type="datetime-local"> expects. */
export function toDatetimeLocal(value?: string | Date | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

export function EventForm({
  mode,
  eventId,
  initialValues,
}: {
  mode: "create" | "edit";
  eventId?: string;
  initialValues?: Partial<EventFormValues>;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventInputSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      imageUrl: "",
      location: "",
      startAt: "",
      endAt: "",
      registrationDeadline: "",
      capacity: undefined,
      isFree: true,
      priceCents: undefined,
      status: "DRAFT",
      ...initialValues,
    },
  });

  const isFree = watch("isFree");
  const title = watch("title");

  async function onSubmit(values: EventFormValues) {
    setServerError(null);
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        imageUrl: values.imageUrl || "",
        registrationDeadline: values.registrationDeadline || "",
        capacity: values.capacity ?? null,
        priceCents: values.isFree ? null : values.priceCents ?? null,
      };

      const res = await fetch(mode === "create" ? "/api/admin/events" : `/api/admin/events/${eventId}`, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push("/admin/events");
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-3xl">
      {serverError && (
        <div
          role="alert"
          className="mb-6 rounded-sm border border-kemet-red/40 bg-kemet-red/10 px-4 py-3 text-sm text-kemet-red"
        >
          {serverError}
        </div>
      )}

      <FieldGroup>
        <Label htmlFor="title" required>
          Title
        </Label>
        <Input id="title" {...register("title")} />
        <ErrorText>{errors.title?.message}</ErrorText>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="slug" required>
          Slug
        </Label>
        <div className="flex gap-2">
          <Input id="slug" {...register("slug")} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setValue("slug", slugify(title || ""), { shouldValidate: true })}
            className="!text-kemet-black !border-kemet-black/20 hover:!bg-kemet-black/5"
          >
            Generate
          </Button>
        </div>
        <ErrorText>{errors.slug?.message}</ErrorText>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="description" required>
          Description
        </Label>
        <Textarea id="description" rows={5} {...register("description")} />
        <ErrorText>{errors.description?.message}</ErrorText>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" placeholder="https://..." {...register("imageUrl")} />
        <ErrorText>{errors.imageUrl?.message}</ErrorText>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="location" required>
          Location
        </Label>
        <Input id="location" {...register("location")} />
        <ErrorText>{errors.location?.message}</ErrorText>
      </FieldGroup>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="startAt" required>
            Start
          </Label>
          <Input id="startAt" type="datetime-local" {...register("startAt")} />
          <ErrorText>{errors.startAt?.message}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="endAt" required>
            End
          </Label>
          <Input id="endAt" type="datetime-local" {...register("endAt")} />
          <ErrorText>{errors.endAt?.message}</ErrorText>
        </FieldGroup>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="registrationDeadline">Registration Deadline</Label>
          <Input id="registrationDeadline" type="datetime-local" {...register("registrationDeadline")} />
          <ErrorText>{errors.registrationDeadline?.message}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            min={1}
            {...register("capacity", {
              setValueAs: (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
            })}
          />
          <ErrorText>{errors.capacity?.message}</ErrorText>
        </FieldGroup>
      </div>

      <FieldGroup>
        <Checkbox id="isFree" label="This is a free event" {...register("isFree")} />
      </FieldGroup>

      {!isFree && (
        <FieldGroup>
          <Label htmlFor="priceCents">Price (in cents)</Label>
          <Input
            id="priceCents"
            type="number"
            min={0}
            {...register("priceCents", {
              setValueAs: (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
            })}
          />
          <ErrorText>{errors.priceCents?.message}</ErrorText>
        </FieldGroup>
      )}

      <FieldGroup>
        <Label htmlFor="status" required>
          Status
        </Label>
        <Select id="status" {...register("status")}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="CANCELLED">Cancelled</option>
        </Select>
      </FieldGroup>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : mode === "create" ? "Create Event" : "Save Changes"}
      </Button>
    </form>
  );
}
