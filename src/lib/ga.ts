export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

/**
 * Send a page_view to GA4.
 */
export function pageview(url: string) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  window.gtag?.("config", GA_MEASUREMENT_ID, { page_path: url });
}

/**
 * Send a custom event to GA4.
 * Example: event("sign_up", { method: "Google" })
 */
export function event(action: string, params?: Record<string, unknown>) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  window.gtag?.("event", action, params);
}
