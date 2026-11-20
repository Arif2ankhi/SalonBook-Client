import { Loader2 } from "lucide-react";

/** Route-level loader shown while the services list page is rendering. */
export default function ServicesLoading() {
  return (
    <div
      className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-7 w-7 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">Fetching salon services...</p>
    </div>
  );
}
