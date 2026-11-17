"use client";

import { authClient } from "@/lib/auth-client";

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

/** Thin wrapper around Better Auth's useSession so the UI stays simple. */
export function useAuth(): AuthState {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return { user: null, isPending: true };
  }

  return {
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          role: ((user as { role?: string }).role ?? "customer") as UserRole,
        }
      : null,
    isPending: false,
  };
}
