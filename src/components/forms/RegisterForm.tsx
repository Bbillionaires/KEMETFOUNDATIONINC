"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Label, ErrorText, Input, Textarea, FieldGroup, Checkbox } from "@/components/ui/Field";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      newsletterOptIn: false,
    },
  });

  async function onSubmit(values: RegisterInput) {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        // Account was created, but auto sign-in failed. Send them to log in manually.
        router.push("/membership/login");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
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

      <FieldGroup>
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        <ErrorText>{errors.email?.message}</ErrorText>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="password" required>
          Password
        </Label>
        <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
        <ErrorText>{errors.password?.message}</ErrorText>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="phone" required>
          Phone
        </Label>
        <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
        <ErrorText>{errors.phone?.message}</ErrorText>
      </FieldGroup>

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

      <div className="my-8 border-t border-kemet-black/10 pt-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-kemet-charcoal">
          Optional Information
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <FieldGroup>
            <Label htmlFor="businessOrg">Business / Organization</Label>
            <Input id="businessOrg" {...register("businessOrg")} />
            <ErrorText>{errors.businessOrg?.message}</ErrorText>
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="occupation">Occupation</Label>
            <Input id="occupation" {...register("occupation")} />
            <ErrorText>{errors.occupation?.message}</ErrorText>
          </FieldGroup>
        </div>

        <FieldGroup>
          <Label htmlFor="skills">Skills</Label>
          <Textarea id="skills" rows={3} {...register("skills")} />
          <ErrorText>{errors.skills?.message}</ErrorText>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="volunteerSkills">Volunteer Skills</Label>
          <Textarea id="volunteerSkills" rows={3} {...register("volunteerSkills")} />
          <ErrorText>{errors.volunteerSkills?.message}</ErrorText>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="areasOfInterest">Areas of Interest</Label>
          <Textarea id="areasOfInterest" rows={3} {...register("areasOfInterest")} />
          <ErrorText>{errors.areasOfInterest?.message}</ErrorText>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="contributionInterest">How would you like to contribute?</Label>
          <Textarea id="contributionInterest" rows={3} {...register("contributionInterest")} />
          <ErrorText>{errors.contributionInterest?.message}</ErrorText>
        </FieldGroup>
      </div>

      <FieldGroup>
        <Checkbox
          id="newsletterOptIn"
          label="Send me newsletter updates from Kemet Foundation Inc."
          {...register("newsletterOptIn")}
        />
      </FieldGroup>

      <FieldGroup>
        <Checkbox
          id="acceptTerms"
          label={
            <>
              I have read and agree to the{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-kemet-gold-deep underline"
              >
                Terms of Service
              </a>
              . <span className="text-kemet-red">*</span>
            </>
          }
          {...register("acceptTerms")}
        />
        <ErrorText>{errors.acceptTerms?.message}</ErrorText>
      </FieldGroup>

      <FieldGroup>
        <Checkbox
          id="acceptPrivacy"
          label={
            <>
              I have read and agree to the{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-kemet-gold-deep underline"
              >
                Privacy Policy
              </a>
              . <span className="text-kemet-red">*</span>
            </>
          }
          {...register("acceptPrivacy")}
        />
        <ErrorText>{errors.acceptPrivacy?.message}</ErrorText>
      </FieldGroup>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
        {submitting ? "Creating Account..." : "Become a Member"}
      </Button>
    </form>
  );
}
