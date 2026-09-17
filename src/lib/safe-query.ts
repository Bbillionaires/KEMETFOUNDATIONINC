/**
 * Runs a database read for a public page and falls back to a safe default
 * instead of throwing, so a transient database outage degrades to an empty
 * state (matching src/lib/site-content.ts's fallback behavior) rather than
 * crashing the entire page with a generic "server-side exception" screen.
 */
export async function safeQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (err) {
    console.error("[safeQuery] Database read failed, using fallback:", err instanceof Error ? err.message : err);
    return fallback;
  }
}
