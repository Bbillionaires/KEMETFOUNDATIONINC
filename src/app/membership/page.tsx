import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { MembershipInterestForm } from "@/components/forms/MembershipInterestForm";

export const metadata: Metadata = {
  title: "Membership",
  description: "Learn about membership with Kemet Foundation Inc.",
};

const highlights = [
  {
    title: "Community",
    body: "Membership connects you with others who share a commitment to African heritage, cultural education, and community advancement.",
  },
  {
    title: "Stay Informed",
    body: "Members receive updates on foundation news, announcements, and upcoming events so you can stay connected to our work.",
  },
  {
    title: "Get Involved",
    body: "As a member, you can let us know how you'd like to volunteer or contribute to the foundation's mission.",
  },
];

export default function MembershipPage() {
  return (
    <div>
      <section className="bg-kemet-black py-20 text-kemet-white">
        <Container>
          <SectionHeading
            eyebrow="Membership"
            title="Join Kemet Foundation Inc"
            description="Membership is our way of welcoming individuals who want to stand alongside the foundation as we work toward African heritage and cultural education, community development, family strengthening, and economic empowerment."
            light
          />
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            {highlights.map((item) => (
              <Card key={item.title}>
                <h3 className="font-display text-xl font-bold text-kemet-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-kemet-charcoal/80">{item.body}</p>
              </Card>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-3xl rounded-sm border border-kemet-black/10 bg-kemet-ivory p-8 sm:p-12">
            <h2 className="text-center font-display text-2xl font-bold text-kemet-black sm:text-3xl">
              Become a Member
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-kemet-charcoal/80">
              Fill out the form below to let us know you&rsquo;re interested. A member of our team
              will follow up with you directly.
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
