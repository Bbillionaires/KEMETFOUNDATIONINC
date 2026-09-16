import { prisma } from "@/lib/prisma";

/**
 * Simple admin-editable key/value content store, backed by SiteContent.
 * Used for homepage/mission copy blocks that haven't been finalized by the
 * organization yet. Falls back to the provided default when no row exists
 * (or the database is unreachable during local/dev setup).
 */
export async function getSiteContent(key: string, fallback: string): Promise<string> {
  try {
    const row = await prisma.siteContent.findUnique({ where: { key } });
    return row?.value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getSiteContentMap(
  entries: Record<string, string>
): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteContent.findMany({
      where: { key: { in: Object.keys(entries) } },
    });
    const map = new Map(rows.map((r) => [r.key, r.value]));
    const result: Record<string, string> = {};
    for (const [key, fallback] of Object.entries(entries)) {
      result[key] = map.get(key) ?? fallback;
    }
    return result;
  } catch {
    return entries;
  }
}

export async function setSiteContent(key: string, value: string): Promise<void> {
  await prisma.siteContent.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
