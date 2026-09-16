import { NextResponse } from "next/server";
import { z } from "zod";
import { setSiteContent } from "@/lib/site-content";
import { requireAdmin } from "@/lib/admin-auth";

// Explicit allow-list: teammates' pages read these exact SiteContent keys, so
// arbitrary key injection must be rejected here.
const ALLOWED_KEYS = [
  "home_intro_paragraph",
  "mission_statement",
  "vision_statement",
  "core_principles",
  "why_kemet",
  "our_approach",
  "community_impact",
  "member_resources_html",
  "org_tax_exempt",
  "org_tax_disclaimer",
] as const;

const contentPatchSchema = z.object({
  key: z.enum(ALLOWED_KEYS),
  value: z.string().max(20000),
});

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = contentPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid content key or value." }, { status: 400 });
  }

  let value = parsed.data.value;
  if (parsed.data.key === "org_tax_exempt") {
    // Render as a toggle, but defensively coerce to the exact literal string.
    value = value === "true" ? "true" : "false";
  }

  await setSiteContent(parsed.data.key, value);
  return NextResponse.json({ success: true });
}
