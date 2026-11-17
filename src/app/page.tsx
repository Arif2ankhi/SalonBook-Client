import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

// Placeholder home page. The full home page (banner, featured services,
// categories, extra section) is built in Phase 7 once the services API is ready.
export default function HomePage() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center sm:px-6 lg:px-8">
      <span className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
        <Sparkles className="size-7" aria-hidden="true" />
      </span>
      <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        Welcome to SalonBook
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Layout foundation is in place — the banner, featured services, and
        categories sections will appear here in the next phase.
      </p>
      <Button render={<Link href="/services" />} size="lg" className="mt-2">
        Explore Salon Services
      </Button>
    </section>
  );
}
