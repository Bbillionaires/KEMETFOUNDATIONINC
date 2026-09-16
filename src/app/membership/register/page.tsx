import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Become a Member",
  description: "Register for membership with Kemet Foundation Inc.",
};

export default function RegisterPage() {
  return (
    <div className="bg-kemet-ivory py-16 sm:py-20">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Membership"
          title="Become a Member"
          description="Fill out the form below to apply for membership with Kemet Foundation Inc. A member of our team will follow up as your application is reviewed."
          align="left"
        />

        <div className="mt-10 rounded-sm border border-kemet-black/10 bg-white p-6 shadow-sm sm:p-10">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-kemet-charcoal/80">
          Already a member?{" "}
          <Link href="/membership/login" className="font-semibold text-kemet-gold-deep underline">
            Sign in
          </Link>
        </p>
      </Container>
    </div>
  );
}
