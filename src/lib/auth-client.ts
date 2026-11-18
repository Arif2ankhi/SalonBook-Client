import { createAuthClient } from "better-auth/react";

// No baseURL needed — the client talks to the same domain it runs on,
// so it keeps working on any dev port and on the deployed domain.
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
