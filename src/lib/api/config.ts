export const API_BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/**
 * Error that carries the HTTP status of a failed API response so callers can
 * react differently to unauthorized (401/403), not-found (404), conflict
 * (409) and server (5xx) failures instead of only seeing a generic message.
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Parses an API response as JSON and, when `!res.ok`, throws an `ApiError`
 * with the server's `message` when available (falling back to
 * `fallbackMessage`) plus the HTTP status.
 *
 * Safe against non-JSON bodies (e.g. an HTML error page from a down or
 * restarting backend), which previously surfaced as a confusing SyntaxError.
 */
export async function readJsonResponse<T = unknown>(
  res: Response,
  fallbackMessage: string
): Promise<T> {
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON body — keep `data` null and use the fallback message.
  }

  if (!res.ok) {
    const serverMessage =
      data !== null &&
      typeof data === "object" &&
      typeof (data as { message?: unknown }).message === "string"
        ? (data as { message: string }).message
        : undefined;
    throw new ApiError(serverMessage || fallbackMessage, res.status);
  }

  return data as T;
}
