import type { Metadata } from "next";
import { DonationForm } from "@/components/admin/DonationForm";

export const metadata: Metadata = {
  title: "Add Manual Donation",
};

export default function NewDonationPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-kemet-black">Add Manual Donation</h1>
      <p className="mt-2 max-w-xl text-sm text-kemet-charcoal/70">
        Use this for offline gifts such as checks or cash. Online donations made through the donate page are
        recorded automatically via Stripe.
      </p>
      <div className="mt-8">
        <DonationForm />
      </div>
    </div>
  );
}
