import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { MissionTeaser } from "@/components/home/MissionTeaser";
import { MembershipTeaser } from "@/components/home/MembershipTeaser";
import { Pillars } from "@/components/home/Pillars";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { GetInvolved } from "@/components/home/GetInvolved";
import { DonateBanner } from "@/components/home/DonateBanner";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { SITE_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Building Community. Preserving Legacy.`,
  description:
    "Kemet Foundation Inc is a Florida nonprofit dedicated to African heritage and cultural education, community development, economic empowerment, and youth development. Learn about our mission, upcoming events, and how to get involved.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <MissionTeaser />
      <MembershipTeaser />
      <Pillars />
      <UpcomingEvents />
      <GetInvolved />
      <DonateBanner />
      <NewsletterSection />
    </>
  );
}
