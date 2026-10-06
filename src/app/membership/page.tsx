import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { MembershipInterestForm } from "@/components/forms/MembershipInterestForm";
import { MEMBERSHIP_PAGE_CONTENT } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Membership",
  description: "Learn about membership with Kemet Foundation Inc.",
};

export default function MembershipPage() {
  const content = MEMBERSHIP_PAGE_CONTENT;

  return (
    <div>
      <section className="bg-kemet-black py-20 text-kemet-white">
        <Container>
          <SectionHeading
            eyebrow="Membership"
            title={content.heroTitle}
            description={content.heroDescription}
            light
          />
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            {content.highlights.map((item) => (
              <Card key={item.title}>
                <h3 className="font-display text-xl font-bold text-kemet-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-kemet-charcoal/80">{item.body}</p>
              </Card>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-3xl rounded-sm border border-kemet-black/10 bg-kemet-ivory p-8 sm:p-12">
            <h2 className="text-center font-display text-2xl font-bold text-kemet-black sm:text-3xl">
              {content.formIntroTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-kemet-charcoal/80">
              {content.formIntroBody}
            </p>
            <div className="mt-10">
              <MembershipInterestForm />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
