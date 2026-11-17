"use client";

// TODO (Phase 1 - Auth): Replace this placeholder with Better Auth's client
// hook once the server-side Better Auth setup is complete, e.g.:
//   import { authClient } from "@/lib/auth-client";
//   const { data, isPending } = authClient.useSession();
// The navbar/dashboard already consume the same interface below, so swapping
// the implementation should not require UI changes.

export type UserRole = "customer" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  /** True while the session is being fetched. */
  isPending: boolean;
}

export function useAuth(): AuthState {
  // Placeholder: no session until Better Auth is wired up.
  return { user: null, isPending: false };
}
