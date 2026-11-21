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
import ImageUploadField from "@/app/components/shared/ImageUploadField";

const validatePassword = (password: string) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  return null;
};

const SignUpPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name"));
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const image = profileImage.trim();

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }
    if (image && !image.startsWith("http")) {
      toast.error("Profile image URL must start with http");
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      role: "customer",
      ...(image ? { image } : {}),
    } as Parameters<typeof authClient.signUp.email>[0]);
    setIsSubmitting(false);

    if (data) {
      toast.success("Account created successfully. Welcome to SalonBook!");
      router.push("/");
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

        {/* Profile Photo Upload via ImgBB (Optional) */}
        <ImageUploadField
          id="image"
          label="Profile Photo (optional)"
          value={profileImage}
          onChange={setProfileImage}
          allowUrlInput={false}
        />

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
    </div>
  );
};

export default SignUpPage;