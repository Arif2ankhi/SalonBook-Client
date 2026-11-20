"use client"; // Error boundaries must be Client Components

/**
 * Last-resort error UI for failures inside the root layout itself.
 * Replaces the whole document, so it defines its own <html>/<body> and uses
 * inline styles (global CSS is not guaranteed to be loaded here).
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const message =
    error instanceof Error && error.message
      ? error.message
      : "An unexpected application error occurred.";

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          backgroundColor: "#faf7f5",
          color: "#2D1A22",
        }}
      >
        <div
          style={{
            maxWidth: "28rem",
            width: "100%",
            textAlign: "center",
            padding: "2rem",
            borderRadius: "1rem",
            backgroundColor: "#ffffff",
            border: "1px solid #EAE2DC",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.25rem" }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "#6b7280" }}>
            {message}
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: "1.5rem",
              padding: "0.625rem 1.5rem",
              borderRadius: "9999px",
              border: "none",
              backgroundColor: "#4A2535",
              color: "#ffffff",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
