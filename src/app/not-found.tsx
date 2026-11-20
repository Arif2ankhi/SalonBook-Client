import Link from "next/link";
import { Compass, LayoutDashboard, SearchX } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Styled 404 page — handles invalid routes (dead bookmarks, removed pages,
 * mistyped URLs) and `notFound()` calls such as a missing service detail.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] w-full items-center justify-center px-4">
      <div className="w-full max-w-md space-y-5 rounded-2xl border bg-card p-8 text-center shadow-xs">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary">
          <SearchX className="size-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Error 404
          </p>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground">
            The page you are looking for doesn&apos;t exist, was moved, or the
            link is no longer available.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Link href="/" className={cn(buttonVariants())}>
            <Compass className="size-4" aria-hidden="true" />
            Home
          </Link>
          <Link
            href="/services"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Browse services
          </Link>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LayoutDashboard className="size-4" aria-hidden="true" />
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
