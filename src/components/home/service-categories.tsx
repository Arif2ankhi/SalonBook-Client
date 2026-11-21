"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Brush,
  Droplets,
  Flower2,
  Hand,
  Palette,
  Scissors,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { getServiceCategories } from "@/lib/actions/services";

/** Default salon menu — used when the API returns nothing or is unreachable. */
const FALLBACK_CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
] as const;

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Haircut & Styling": Scissors,
  "Hair Coloring": Palette,
  "Hair Treatment": Sparkles,
  "Facial & Skincare": Droplets,
  Makeup: Brush,
  "Manicure & Pedicure": Hand,
  "Spa & Massage": Flower2,
};

/**
 * Home — Salon Service Categories (dynamic).
 * Loads distinct categories of active services; each tile deep-links to
 * /services?category=… so users can explore services by category.
 */
export function ServiceCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getServiceCategories()
      .then((data) => {
        const list = Array.isArray(data)
          ? data.filter(
              (item): item is string =>
                typeof item === "string" && item.trim().length > 0
            )
          : [];
        // De-duplicate, fall back to the default menu when the DB has none.
        setCategories(
          list.length > 0 ? Array.from(new Set(list)) : [...FALLBACK_CATEGORIES]
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching service categories:", err);
        // Degrade gracefully: the default menu still links somewhere useful.
        setCategories([...FALLBACK_CATEGORIES]);
        setIsLoading(false);
        toast.error("Failed to load service categories from the server.");
      });
  }, []);

  return (
    <section className="w-full bg-muted/40">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-2 text-center">
          <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
            Browse the menu
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Salon service categories
          </h2>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
            Jump straight to the treatments you are in the mood for — every
            category opens a pre-filtered service list.
          </p>
        </div>

        {/* Category Tiles */}
        {isLoading ? (
          <div
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            role="status"
            aria-live="polite"
          >
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="h-32 animate-pulse rounded-3xl border bg-card shadow-xs"
              />
            ))}
            <span className="sr-only">Loading service categories...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = CATEGORY_ICONS[category] ?? Sparkles;
              return (
                <Link
                  key={category}
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="group flex flex-col items-center justify-center gap-3 rounded-3xl border bg-card p-5 text-center shadow-xs transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {category}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                    Explore →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
