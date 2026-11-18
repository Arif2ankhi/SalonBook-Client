"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { GoogleButton } from "@/components/auth/google-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Simple password rule: minimum 6 characters.
const validatePassword = (password: string) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  return null;
};

const SignUpPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name"));
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const role = String(form.get("role")) === "admin" ? "admin" : "customer";
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

    console.log("Sign up form values:", { name, email, role, image: image || "(none)" });

    setIsSubmitting(true);
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      role,
      ...(image ? { image } : {}),
      // Redirect to home for now; switch to /dashboard once it is built.
      callbackURL: "/",
    } as Parameters<typeof authClient.signUp.email>[0]);
    setIsSubmitting(false);

    if (data) {
        console.log(data);
      toast.success("Account created successfully. Welcome to SalonBook!");
      console.log("Signed up user:", data);
    }
    if (error) {
        console.log(error);
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

      <form onSubmit={handleSignUp} className="mt-6 space-y-4">
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
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Minimum 6 characters.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role">Account Type</Label>
          <select
            id="role"
            name="role"
            defaultValue="customer"
            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-lg border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-3"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
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
        {/* Native button so the form submit event fires (Base UI Button
            forces type="button", which would block onSubmit). */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(buttonVariants(), "w-full")}
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>
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
        Note: Admin accounts have full dashboard access. Choose Admin only for
        the salon owner account.
      </p>
    </div>
  );
};

export default SignUpPage;
