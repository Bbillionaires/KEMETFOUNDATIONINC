import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { NEWSLETTER_SECTION_CONTENT } from "@/lib/site-content";

export function NewsletterSection() {
  return (
    <section className="bg-kemet-ivory py-20">
      <Container className="flex flex-col items-center text-center">
        <SectionHeading
          eyebrow={NEWSLETTER_SECTION_CONTENT.eyebrow}
          title={NEWSLETTER_SECTION_CONTENT.title}
          description={NEWSLETTER_SECTION_CONTENT.description}
        />
        <div className="mt-8 w-full max-w-md">
          <NewsletterForm />
        </div>
      </Container>
    </section>
  );
}
