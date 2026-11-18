import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// Connection string lives in .env — never hardcode credentials here.
const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("salonbook");

export const auth = betterAuth({
  // SalonBook and hireloop-client are both Better Auth apps served from
  // `localhost`. Cookies are scoped by HOST, not by port, so both apps would
  // share the default `better-auth.session_token` cookie and silently clobber
  // each other's session (whichever app you used last wins, and the other
  // then reads a token that isn't in its own database → session is null).
  // A distinct prefix keeps the two cookies independent.

  //line 18- 25 extra should be delete 
  // advanced: {
  //   cookiePrefix: "salonbook",
  // },
  // // Allow common local dev ports (Next.js shifts ports when 3000 is busy).
  // trustedOrigins: [
  //   process.env.BETTER_AUTH_URL ?? "",
  //   "http://localhost:3000",
  // ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      // NOTE: the sign-up form lets the user pick customer or admin (per
      // project request). On the live site this means anyone can
      // self-register as admin — the assignment brief warns against this.
      role: {
        type: ["customer", "admin"],
        defaultValue: "customer",
        input: true,
      },
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
});
