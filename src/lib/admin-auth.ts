import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

/**
 * Belt-and-suspenders re-check for every /api/admin/** route handler.
 *
 * `src/middleware.ts` already blocks non-admin access to /api/admin/:path*,
 * but each route handler must independently verify the session + role since
 * middleware can be misconfigured, bypassed in tests, or changed later.
 *
 * Usage:
 *   const { session, response } = await requireAdmin();
 *   if (response) return response;
 *   // session.user is guaranteed to be an ADMIN or SUPERADMIN here
 */
export async function requireAdmin(): Promise<
  { session: Session; response: null } | { session: null; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!session?.user || (role !== "ADMIN" && role !== "SUPERADMIN")) {
    return {
      session: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { session, response: null };
}
