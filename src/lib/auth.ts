import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// Connection string lives in .env — never hardcode credentials here.
const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("salonbook");

export const auth = betterAuth({
  // Allow common local dev ports (Next.js shifts ports when 3000 is busy).
  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? "",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ],
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
