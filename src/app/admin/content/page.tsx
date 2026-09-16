import type { Metadata } from "next";
import { getSiteContentMap } from "@/lib/site-content";
import { Card } from "@/components/ui/Card";
import { SiteContentField } from "@/components/admin/SiteContentField";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site Content",
};

const FIELDS: { key: string; label: string; description?: string; rows?: number }[] = [
  {
    key: "home_intro_paragraph",
    label: "Homepage Hero Subheading",
    description: "Shown as the introductory paragraph under the homepage hero headline.",
  },
  { key: "mission_statement", label: "Mission Statement", description: "Mission page — Our Mission section." },
  { key: "vision_statement", label: "Vision Statement", description: "Mission page — Our Vision section." },
  {
    key: "core_principles",
    label: "Core Principles",
    description: "Mission page. One principle per line, e.g. \"Title — short description\".",
    rows: 6,
  },
  { key: "why_kemet", label: "Why Kemet", description: "Mission page — Why Kemet section." },
  { key: "our_approach", label: "Our Approach", description: "Mission page — Our Approach section." },
  { key: "community_impact", label: "Community Impact", description: "Mission page — Community Impact section." },
  {
    key: "member_resources_html",
    label: "Member Resources",
    description: "Shown in the member dashboard's \"Member Resources\" block. Plain text or simple HTML.",
    rows: 6,
  },
];

const FALLBACKS = Object.fromEntries(FIELDS.map((f) => [f.key, ""]));

export default async function AdminContentPage() {
  const content = await getSiteContentMap(FALLBACKS);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-kemet-black">Site Content</h1>
      <p className="mt-2 max-w-2xl text-sm text-kemet-charcoal/70">
        Edit the copy blocks shown across the public site and member dashboard. Each field saves independently
        and takes effect on the next page load.
      </p>

      <Card className="mt-8">
        {FIELDS.map((field) => (
          <SiteContentField
            key={field.key}
            fieldKey={field.key}
            label={field.label}
            description={field.description}
            initialValue={content[field.key] ?? ""}
            rows={field.rows}
          />
        ))}
      </Card>
    </div>
  );
}
