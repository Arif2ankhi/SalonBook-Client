import { Loader2 } from "lucide-react";

/**
 * Shows inside the dashboard shell (sidebar stays visible) while the
 * `/dashboard` role resolver and any dashboard page transition load.
 */
export default function DashboardLoading() {
  return (
    <div
      className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-[#4A2535]" aria-hidden="true" />
      <p className="text-sm text-neutral-500">Loading dashboard...</p>
    </div>
  );
}
