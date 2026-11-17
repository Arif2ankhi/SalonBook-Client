"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    setIsSubmitting(true);
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      // Dashboard renders customer or admin content based on the user role.
      callbackURL: "/dashboard",
    });
    setIsSubmitting(false);

    if (data) {
      toast.success("Signed in successfully");
    }
    if (error) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        Welcome back
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sign in to book appointments and manage your account.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;
