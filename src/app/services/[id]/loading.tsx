/**
 * Skeleton shown while the service detail page fetches from the API.
 * Mirrors the two-column layout (image + info card | sticky booking card)
 * so the page doesn't render blank or jump when data arrives.
 */
export default function ServiceDetailsLoading() {
  return (
    <main className="min-h-screen bg-base-200/40 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl animate-pulse" role="status" aria-live="polite">
        {/* Back link placeholder */}
        <div className="mb-6 h-4 w-40 rounded bg-base-300" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left column: image + info */}
          <div className="space-y-6 lg:col-span-7">
            <div className="aspect-[16/10] w-full rounded-2xl bg-base-300" />
            <div className="space-y-4 rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8">
              <div className="h-7 w-2/3 rounded bg-base-300" />
              <div className="h-4 w-1/2 rounded bg-base-200" />
              <div className="space-y-2 border-y border-base-200 py-4">
                <div className="h-4 w-full rounded bg-base-200" />
                <div className="h-4 w-4/5 rounded bg-base-200" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-1/3 rounded bg-base-300" />
                <div className="h-4 w-full rounded bg-base-200" />
                <div className="h-4 w-11/12 rounded bg-base-200" />
              </div>
            </div>
          </div>

          {/* Right column: booking card */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-md">
              <div className="h-9 w-32 rounded bg-base-300" />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-9 rounded-lg bg-base-200" />
                ))}
              </div>
              <div className="h-10 w-full rounded-xl bg-base-300" />
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-base-content/60">
          Loading service details...
        </p>
      </div>
    </main>
  );
}
