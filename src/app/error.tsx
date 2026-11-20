"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Root error boundary (Next 16 convention: `retry`, not `reset`).
 *
 * Catches unexpected render/data errors from any route below the root
 * layout — failed API requests in Server Components, broken session lookups,
 * etc. — and shows a recoverable fallback instead of the bare dev overlay.
 */
export default function RouteError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  const message =
    error instanceof Error && error.message
      ? error.message
      : "An unexpected error occurred while loading this page.";

  return (
    <main className="flex min-h-[70vh] w-full items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-8 text-center shadow-xs">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="size-6 text-destructive" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <h1 className="font-heading text-xl font-semibold text-foreground">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Button onClick={() => retry()}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </Button>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            <Home className="size-4" aria-hidden="true" />
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
