import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

/**
 * `/dashboard` — role resolver.
 *
 * Both navbar "Dashboard" links point here when the session is unknown/signed
 * out, so the link can stay visible without a sign-in. From here we bounce to
 * the right dashboard:
 *
 * - signed in as admin    → /dashboard/admin
 * - signed in as customer → /dashboard/customer
 * - signed out            → /dashboard/customer (per project requirement)
 *
 * The redirect lives on the server so it works before any client JS hydrates.
 */
export default async function DashboardIndexPage() {
  // If the session lookup itself fails (DB hiccup, Better Auth outage),
  // fall back to the signed-out behaviour instead of crashing into the
  // error boundary: the customer dashboard is publicly reachable anyway.
  let session: Awaited<ReturnType<typeof auth.api.getSession>> = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    session = null;
  }

  const role =
    (session?.user as { role?: "customer" | "admin" } | undefined)?.role ??
    "customer";

  redirect(`/dashboard/${role}`);
}
