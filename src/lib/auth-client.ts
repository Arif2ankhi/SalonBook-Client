import { createAuthClient } from "better-auth/react";
import {inferAdditionalFields, jwtClient} from "better-auth/client/plugins"
import { auth } from "./auth";

// No baseURL needed — the client talks to the same domain it runs on,
// so it keeps working on any dev port and on the deployed domain.
export const authClient = createAuthClient({
      baseURL: process.env.BETTER_AUTH_URL,
  plugins:[inferAdditionalFields<typeof auth>(), jwtClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
