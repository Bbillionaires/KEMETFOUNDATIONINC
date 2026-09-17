"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { membershipInterestSchema, type MembershipInterestInput } from "@/lib/validations";
import { Label, ErrorText, Input, Textarea, FieldGroup, Checkbox } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function MembershipInterestForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MembershipInterestInput>({
    resolver: zodResolver(membershipInterestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      zip: "",
      businessOrg: "",
      occupation: "",
      skills: "",
      volunteerSkills: "",
      areasOfInterest: "",
      contributionInterest: "",
      newsletterOptIn: false,
      website: "",
    },
  });

  async function onSubmit(data: MembershipInterestInput) {
    setStatus("idle");
    setErrorMessage("");
    try {
      const res = await fetch("/api/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 429) {
        throw new Error("You've submitted this recently. Please try again later.");
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="py-6 text-center">
        <p className="font-display text-xl font-bold text-kemet-black">Thank You</p>
        <p className="mt-2 text-sm leading-relaxed text-kemet-charcoal/80">
          We&rsquo;ve received your membership interest and will follow up with you soon.
        </p>
        <Button className="mt-6" variant="outline" onClick={() => setStatus("idle")}>
          Submit Another Response
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative">
      {/* Honeypot field — hidden from real users, left empty by them. Bots often fill it. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="firstName" required>
            First Name
          </Label>
          <Input id="firstName" autoComplete="given-name" {...register("firstName")} />
          <ErrorText>{errors.firstName?.message}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="lastName" required>
            Last Name
          </Label>
          <Input id="lastName" autoComplete="family-name" {...register("lastName")} />
          <ErrorText>{errors.lastName?.message}</ErrorText>
        </FieldGroup>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          <ErrorText>{errors.email?.message}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="phone" required>
            Phone
          </Label>
          <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
          <ErrorText>{errors.phone?.message}</ErrorText>
        </FieldGroup>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <FieldGroup>
          <Label htmlFor="city" required>
            City
          </Label>
          <Input id="city" autoComplete="address-level2" {...register("city")} />
          <ErrorText>{errors.city?.message}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="state" required>
            State
          </Label>
          <Input id="state" autoComplete="address-level1" {...register("state")} />
          <ErrorText>{errors.state?.message}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="zip" required>
            ZIP Code
          </Label>
          <Input id="zip" autoComplete="postal-code" {...register("zip")} />
          <ErrorText>{errors.zip?.message}</ErrorText>
        </FieldGroup>
      </div>

      <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-kemet-charcoal/60">
        Optional Information
      </p>

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
        <Textarea id="skills" rows={2} {...register("skills")} />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="volunteerSkills">Volunteer Skills</Label>
        <Textarea id="volunteerSkills" rows={2} {...register("volunteerSkills")} />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="areasOfInterest">Areas of Interest</Label>
        <Textarea id="areasOfInterest" rows={2} {...register("areasOfInterest")} />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="contributionInterest">How would you like to contribute?</Label>
        <Textarea id="contributionInterest" rows={2} {...register("contributionInterest")} />
      </FieldGroup>

      <FieldGroup>
        <Checkbox
          id="newsletterOptIn"
          label="Send me newsletter updates from Kemet Foundation Inc."
          {...register("newsletterOptIn")}
        />
      </FieldGroup>

      {status === "error" && (
        <p role="alert" className="mb-4 text-sm text-kemet-red">
          {errorMessage}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Interest"}
      </Button>
    </form>
  );
}
