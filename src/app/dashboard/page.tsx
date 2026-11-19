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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role =
    (session?.user as { role?: "customer" | "admin" } | undefined)?.role ??
    "customer";

  redirect(`/dashboard/${role}`);
}
