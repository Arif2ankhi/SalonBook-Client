"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Loader2, LockKeyhole, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AllowedRole = "customer" | "admin";

interface RoleGateProps {
  /** Role required to view this area. */
  role: AllowedRole;
  children: React.ReactNode;
}

/**
 * Client-side access gate for dashboard areas (UI-level protection, per the
 * project setup there is no middleware/server session check).
 *
 * - Session still loading → spinner (no flicker of the wrong UI)
 * - Signed out            → "Sign in required" card + error toast
 * - Wrong role            → "Unauthorized access" card + error toast
 * - Matching role         → renders children (children only mount when
 *                           access is granted, so gated pages never fetch
 *                           data they shouldn't see)
 *
 * Feedback goes through sonner toasts — never browser alert().
 */
export default function RoleGate({ role, children }: RoleGateProps) {
  const { user, isPending } = useAuth();

  const needsSignIn = !isPending && !user;
  const wrongRole = !isPending && user !== null && user.role !== role;

  useEffect(() => {
    if (needsSignIn) {
      toast.error("Please sign in to access this page.");
    } else if (wrongRole) {
      toast.error("You are not authorized to view this page.");
    }
  }, [needsSignIn, wrongRole]);

  if (isPending) {
    return (
      <div
        className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-8 w-8 animate-spin text-[#4A2535]" aria-hidden="true" />
        <p className="text-sm text-neutral-500">Checking your access...</p>
      </div>
    );
  }

  if (needsSignIn) {
    return (
      <AccessCard
        icon={<LockKeyhole className="size-6" aria-hidden="true" />}
        title="Sign in required"
        description={`You need to sign in to access the ${role} dashboard.`}
        actions={
          <>
            <Link href="/sign-in" className={cn(buttonVariants())}>
              Sign In
            </Link>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Go home
            </Link>
          </>
        }
      />
    );
  }

  if (wrongRole) {
    return (
      <AccessCard
        icon={<ShieldAlert className="size-6" aria-hidden="true" />}
        title="Unauthorized access"
        description={`This page is only available to ${role} accounts. Your account is signed in as "${user?.role}".`}
        actions={
          <>
            <Link
              href={`/dashboard/${user?.role || "customer"}`}
              className={cn(buttonVariants())}
            >
              Go to my dashboard
            </Link>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Go home
            </Link>
          </>
        }
      />
    );
  }

  return <>{children}</>;
}

function AccessCard({
  icon,
  title,
  description,
  actions,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actions: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[60vh] w-full items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-8 text-center shadow-xs">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          {icon}
        </div>
        <div className="space-y-1.5">
          <h1 className="font-heading text-xl font-semibold text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {actions}
        </div>
      </div>
    </main>
  );
}
