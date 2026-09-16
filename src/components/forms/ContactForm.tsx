"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { CONTACT_SUBJECT_OPTIONS } from "@/lib/constants";
import { Label, ErrorText, Input, Textarea, Select, FieldGroup } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "GENERAL",
      message: "",
      website: "",
    },
  });

  async function onSubmit(data: ContactInput) {
    setStatus("idle");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 429) {
        throw new Error("You've sent several messages recently. Please try again later.");
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
        <p className="font-display text-xl font-bold text-kemet-black">Message Sent</p>
        <p className="mt-2 text-sm leading-relaxed text-kemet-charcoal/80">
          Thank you for reaching out. We&rsquo;ll get back to you as soon as we can.
        </p>
        <Button className="mt-6" variant="outline" onClick={() => setStatus("idle")}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative">
      {/* Honeypot field — hidden from real users, left empty by them. Bots often fill it. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="name" required>
            Name
          </Label>
          <Input id="name" type="text" autoComplete="name" {...register("name")} />
          <ErrorText>{errors.name?.message}</ErrorText>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          <ErrorText>{errors.email?.message}</ErrorText>
        </FieldGroup>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
          <ErrorText>{errors.phone?.message}</ErrorText>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="subject" required>
            Subject
          </Label>
          <Select id="subject" {...register("subject")}>
            {CONTACT_SUBJECT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <ErrorText>{errors.subject?.message}</ErrorText>
        </FieldGroup>
      </div>

      <FieldGroup>
        <Label htmlFor="message" required>
          Message
        </Label>
        <Textarea id="message" rows={5} {...register("message")} />
        <ErrorText>{errors.message?.message}</ErrorText>
      </FieldGroup>

      {status === "error" && (
        <p role="alert" className="mb-4 text-sm text-kemet-red">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
