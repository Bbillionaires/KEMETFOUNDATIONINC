"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Label, ErrorText, Input, Textarea, FieldGroup } from "@/components/ui/Field";

const profileFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(50),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  businessOrg: z.string().trim().max(200).optional().or(z.literal("")),
  occupation: z.string().trim().max(150).optional().or(z.literal("")),
  skills: z.string().trim().max(1000).optional().or(z.literal("")),
  volunteerSkills: z.string().trim().max(1000).optional().or(z.literal("")),
  areasOfInterest: z.string().trim().max(1000).optional().or(z.literal("")),
  contributionInterest: z.string().trim().max(1000).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ initialValues }: { initialValues: ProfileFormValues }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: ProfileFormValues) {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/member/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setSavedAt(Date.now());
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
          className="mb-6 rounded-sm border border-kemet-red/40 bg-kemet-red/10 px-4 py-3 text-sm text-kemet-red"
        >
          {serverError}
        </div>
      )}
      {savedAt && !serverError && (
        <div
          role="status"
          className="mb-6 rounded-sm border border-kemet-green/40 bg-kemet-green/10 px-4 py-3 text-sm text-kemet-green"
        >
          Profile updated.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="firstName" required>
            First Name
          </Label>
          <Input id="firstName" {...register("firstName")} />
          <ErrorText>{errors.firstName?.message}</ErrorText>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="lastName" required>
            Last Name
          </Label>
          <Input id="lastName" {...register("lastName")} />
          <ErrorText>{errors.lastName?.message}</ErrorText>
        </FieldGroup>
      </div>

      <FieldGroup>
        <Label htmlFor="phone" required>
          Phone
        </Label>
        <Input id="phone" type="tel" {...register("phone")} />
        <ErrorText>{errors.phone?.message}</ErrorText>
      </FieldGroup>

      <div className="grid gap-5 sm:grid-cols-3">
        <FieldGroup>
          <Label htmlFor="city" required>
            City
          </Label>
          <Input id="city" {...register("city")} />
          <ErrorText>{errors.city?.message}</ErrorText>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="state" required>
            State
          </Label>
          <Input id="state" {...register("state")} />
          <ErrorText>{errors.state?.message}</ErrorText>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="zip" required>
            ZIP Code
          </Label>
          <Input id="zip" {...register("zip")} />
          <ErrorText>{errors.zip?.message}</ErrorText>
        </FieldGroup>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="businessOrg">Business / Organization</Label>
          <Input id="businessOrg" {...register("businessOrg")} />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="occupation">Occupation</Label>
          <Input id="occupation" {...register("occupation")} />
        </FieldGroup>
      </div>

      <FieldGroup>
        <Label htmlFor="skills">Skills</Label>
        <Textarea id="skills" rows={3} {...register("skills")} />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="volunteerSkills">Volunteer Skills</Label>
        <Textarea id="volunteerSkills" rows={3} {...register("volunteerSkills")} />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="areasOfInterest">Areas of Interest</Label>
        <Textarea id="areasOfInterest" rows={3} {...register("areasOfInterest")} />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="contributionInterest">How would you like to contribute?</Label>
        <Textarea id="contributionInterest" rows={3} {...register("contributionInterest")} />
      </FieldGroup>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
