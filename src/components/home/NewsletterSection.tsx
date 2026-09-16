import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function NewsletterSection() {
  return (
    <section className="bg-kemet-ivory py-20">
      <Container className="flex flex-col items-center text-center">
        <SectionHeading
          eyebrow="Stay Connected"
          title="Join Our Newsletter"
          description="Get updates on upcoming events, announcements, and ways to get involved with Kemet Foundation Inc."
        />
        <div className="mt-8 w-full max-w-md">
          <NewsletterForm />
        </div>
      </Container>
    </section>
  );
}
