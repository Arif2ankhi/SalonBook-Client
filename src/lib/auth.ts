import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// Connection string lives in .env — never hardcode credentials here.
const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("salonbook");

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
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
      // Everyone signs up as a customer. Role can only be changed by an
      // admin in the database — public sign-up can never set it.
      role: {
        type: "string",
        defaultValue: "customer",
        input: false,
      },
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
});
