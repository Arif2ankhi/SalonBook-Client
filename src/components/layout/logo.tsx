import Link from "next/link";
import { Scissors } from "lucide-react";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

/** Shared SalonBook brand logo used by the navbar and footer. */
export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 transition-opacity hover:opacity-80",
        className
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Scissors className="size-5" aria-hidden="true" />
      </span>
      <span className="font-heading text-xl font-semibold tracking-tight text-foreground">
        Salon<span className="text-primary">Book</span>
      </span>
    </Link>
  );
}
