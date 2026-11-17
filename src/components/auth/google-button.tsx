"use client";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

/** Shared Google social sign-in button used on the sign-in and sign-up pages. */
export function GoogleButton({ label = "Continue with Google" }: { label?: string }) {
  const signInWithGoogle = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });

    if (error) {
      toast.error("Google sign-in is not available right now. Please try again later.");
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      onClick={signInWithGoogle}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
        <path
          fill="currentColor"
          d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
        />
      </svg>
      {label}
    </Button>
  );
}
