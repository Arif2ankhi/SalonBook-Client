import Link from "next/link";
import { ArrowRight, CalendarCheck, Scissors, Search, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: Search,
    step: "Step 1",
    title: "Find your treatment",
    description:
      "Browse the salon menu by category, price or duration and pick the service that fits your day.",
  },
  {
    icon: CalendarCheck,
    step: "Step 2",
    title: "Pick a date & time",
    description:
      "Choose an available slot and send a booking request — we confirm it with the salon right away.",
  },
  {
    icon: Scissors,
    step: "Step 3",
    title: "Show up & get pampered",
    description:
      "Track your appointment status from your dashboard and enjoy the treatment. It is that simple.",
  },
];

/**
 * Home — "How it works" (static extra section).
 * A classic booking-site explainer: book in three simple steps.
 */
export function HowItWorks() {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl space-y-2 text-center">
          <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
            How it works
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Book your salon visit in 3 simple steps
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            No phone calls, no waiting — from browsing to booked in under a
            minute.
          </p>
        </div>

        {/* Steps */}
        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map(({ icon: Icon, step, title, description }) => (
            <li
              key={step}
              className="relative rounded-3xl border bg-card p-6 text-center shadow-xs sm:p-8"
            >
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <p className="mt-4 text-[11px] font-semibold tracking-widest text-primary uppercase">
                {step}
              </p>
              <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </li>
          ))}
        </ol>

        {/* Closing CTA */}
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-[#3D1D2B] px-6 py-10 text-center sm:px-10">
          <Sparkles className="size-6 text-[#D9A760]" aria-hidden="true" />
          <div className="space-y-1.5">
            <h3 className="font-heading text-2xl font-semibold text-white">
              Ready for your next treatment?
            </h3>
            <p className="mx-auto max-w-lg text-sm text-white/70">
              Explore active services from our salon specialists and reserve
              your favourite slot today.
            </p>
          </div>
          <Link
            href="/services"
            className={cn(
              buttonVariants(),
              "mt-2 rounded-full bg-white px-6 text-[#3D1D2B] hover:bg-white/90"
            )}
          >
            Browse services
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
