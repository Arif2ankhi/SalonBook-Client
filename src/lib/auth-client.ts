import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
  // Mirror the server-side user fields so session.user.role is typed.
  user: {
    additionalFields: {
      role: {
        type: "string" as const,
        defaultValue: "customer",
        input: false,
      },
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
