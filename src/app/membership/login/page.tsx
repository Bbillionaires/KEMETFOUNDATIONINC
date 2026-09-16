import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Kemet Foundation Inc member account.",
};

export default function LoginPage() {
  return (
    <div className="bg-kemet-ivory py-16 sm:py-24">
      <Container className="max-w-md">
        <SectionHeading eyebrow="Membership" title="Sign In" align="left" />
        <LoginForm />
      </Container>
    </div>
  );
}
