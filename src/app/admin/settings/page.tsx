import type { Metadata } from "next";
import { getSiteContentMap } from "@/lib/site-content";
import { Card } from "@/components/ui/Card";
import { TaxExemptToggle } from "@/components/admin/TaxExemptToggle";
import { SiteContentField } from "@/components/admin/SiteContentField";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function AdminSettingsPage() {
  const content = await getSiteContentMap({ org_tax_exempt: "true", org_tax_disclaimer: "" });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-kemet-black">Settings</h1>

      <Card className="mt-8">
        <h2 className="font-display text-lg font-bold text-kemet-black">Tax-Exempt Status</h2>
        <p className="mt-1 text-sm text-kemet-charcoal/70">
          Controls whether the donate page displays 501(c)(3) tax-deductible language.
        </p>
        <div className="mt-4">
          <TaxExemptToggle initialValue={content.org_tax_exempt === "true"} />
        </div>

        <div className="mt-8 border-t border-kemet-black/10 pt-8">
          <SiteContentField
            fieldKey="org_tax_disclaimer"
            label="Tax Disclaimer Override (optional)"
            description="Free-text override shown on the donate page. Leave blank to use the default disclaimer language."
            initialValue={content.org_tax_disclaimer ?? ""}
            rows={4}
          />
        </div>
      </Card>

      <Card className="mt-8">
        <h2 className="font-display text-lg font-bold text-kemet-black">Administrator Roles</h2>
        <p className="mt-2 text-sm text-kemet-charcoal/70">
          Assigning ADMIN or SUPERADMIN roles is done directly in the database by a super-administrator.
          Role management is not yet exposed in this interface.
        </p>
      </Card>
    </div>
  );
}
