"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Simple password rules: minimum 6 characters, one uppercase, one lowercase.
const validatePassword = (password: string) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  return null;
};

const SignUpPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name"));
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const image = String(form.get("image") ?? "").trim();

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }
    if (image && !image.startsWith("http")) {
      toast.error("Profile image URL must start with http");
      return;
    }

    console.log("Sign up form values:", { name, email, image: image || "(none)" });

    setIsSubmitting(true);
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      ...(image ? { image } : {}),
      // Redirect to home for now; switch to /dashboard once it is built.
      callbackURL: "/",
    });
    setIsSubmitting(false);

    if (data) {
      toast.success("Account created successfully. Welcome to SalonBook!");
      console.log("Signed up user:", data);
    }
    if (error) {
      toast.error(error.message ?? "Could not create your account. Try again.");
      console.error("Sign up error:", error);
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Join SalonBook to book your favorite salon services.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Jane Doe"
            required
          />
        </div>
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
          <p className="text-xs text-muted-foreground">
            Minimum 6 characters, with at least one uppercase and one lowercase
            letter.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="image">Profile Image URL (optional)</Label>
          <Input
            id="image"
            name="image"
            type="url"
            placeholder="https://example.com/me.jpg"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton label="Sign up with Google" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>

      <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
        Note: Admin accounts are assigned securely by the salon owner and cannot
        be created through this form.
      </p>
    </div>
  );
};

export default SignUpPage;
