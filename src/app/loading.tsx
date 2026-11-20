import { Loader2 } from "lucide-react";

/**
 * Global route-loading fallback. Shows while any route below the root
 * layout is server-rendering (services detail, dashboard role resolver, ...)
 * until a segment-level `loading.tsx` or the page's own loader takes over.
 */
export default function RootLoading() {
  return (
    <div
      className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">Loading page...</p>
    </div>
  );
}
