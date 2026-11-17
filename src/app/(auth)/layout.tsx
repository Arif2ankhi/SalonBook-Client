import type { ReactNode } from "react";

import { Logo } from "@/components/layout/logo";

// Shared centered layout for the sign-in / sign-up pages.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        {children}
      </div>
    </section>
  );
}
