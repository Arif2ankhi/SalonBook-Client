"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { GoogleButton } from "@/components/auth/google-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignInPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    setIsSubmitting(true);
    // NOTE: deliberately no `callbackURL` here. When one is sent, Better Auth
    // answers with `redirect: true` and its redirect plugin hard-navigates
    // via `window.location.href` — a full page load that wipes the <Toaster>
    // before the success toast can be read. We navigate client-side instead.
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });
    setIsSubmitting(false);

    if (data) {
      toast.success("Signed in successfully");
      // Redirect to home for now; switch to /dashboard once it is built.
      // Client-side navigation keeps the toast alive on the next page.
      router.push("/");
    }
    if (error) {
    
      toast.error("Invalid email or password");
      console.error("Sign in error:", error);
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

      <form onSubmit={handleSignIn} className="mt-6 space-y-4">
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
        </div>
        {/* Native button so the form submit event fires (Base UI Button
            forces type="button", which would block onSubmit). */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(buttonVariants(), "w-full")}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
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
