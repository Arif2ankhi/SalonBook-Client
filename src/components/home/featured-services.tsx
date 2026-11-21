"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
  getFeaturedServices,
  type SalonService,
} from "@/lib/actions/services";
import { ServiceCard } from "@/app/components/service-card";

/**
 * Home — Featured Salon Services (dynamic).
 * Loads up to 6 active services from the API with a skeleton loader and a
 * toast + inline banner on failure (same pattern as the services page).
 */
export function FeaturedServices() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // isLoading already starts as true, so no need to set it here.
    getFeaturedServices(6)
      .then((data) => {
        const activeOnly = Array.isArray(data)
          ? data.filter(
              (item) => item.status !== "Inactive" && item.isActive !== false
            )
          : [];
        setServices(activeOnly.slice(0, 6));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching featured services:", err);
        setErrorMessage("Could not load featured services.");
        setIsLoading(false);
        toast.error("Failed to load featured services from the server.");
      });
  }, []);

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
              Handpicked for you
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Featured salon services
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              Our most-loved treatments, freshly updated from the salon menu —
              book one in a couple of taps.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Browse all services
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="status"
            aria-live="polite"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="animate-pulse overflow-hidden rounded-3xl border bg-card shadow-xs"
              >
                <div className="h-60 w-full bg-muted" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-9 w-full rounded-full bg-muted" />
                </div>
              </div>
            ))}
            <span className="sr-only">Loading featured services...</span>
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
            <p className="font-medium text-destructive">{errorMessage}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please make sure the backend server is running, then refresh the
              page.
            </p>
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-3xl border bg-card p-12 text-center shadow-xs">
            <Sparkles
              className="mx-auto size-6 text-primary"
              aria-hidden="true"
            />
            <p className="mt-3 font-heading text-xl font-semibold text-foreground">
              No services to feature yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              New treatments will appear here as soon as they are added to the
              salon menu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
