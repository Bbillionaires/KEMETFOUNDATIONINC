import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { ProfileForm } from "@/components/forms/ProfileForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <Card>
        <p className="text-sm text-kemet-charcoal/80">
          You must be signed in to view your profile.
        </p>
      </Card>
    );
  }

  const profile = await prisma.memberProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return (
      <Card>
        <p className="text-sm text-kemet-charcoal/80">
          We couldn&apos;t find a profile for your account. Please contact the foundation for
          assistance.
        </p>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl font-bold text-kemet-black">My Profile</h2>
      <p className="mt-2 text-sm text-kemet-charcoal/70">
        Update your contact information below. Your membership status is managed by the
        foundation.
      </p>

      <div className="mt-8 rounded-sm border border-kemet-black/10 bg-white p-6 shadow-sm sm:p-8">
        <ProfileForm
          initialValues={{
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
            city: profile.city,
            state: profile.state,
            zip: profile.zip,
            businessOrg: profile.businessOrg ?? "",
            occupation: profile.occupation ?? "",
            skills: profile.skills ?? "",
            volunteerSkills: profile.volunteerSkills ?? "",
            areasOfInterest: profile.areasOfInterest ?? "",
            contributionInterest: profile.contributionInterest ?? "",
          }}
        />
      </div>
    </div>
  );
}
