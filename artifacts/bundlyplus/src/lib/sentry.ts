import * as Sentry from "@sentry/react";

/**
 * Sentry frontend wiring.
 *
 * Opt-in via `VITE_SENTRY_DSN`. When unset the module is a no-op so dev
 * and preview builds stay silent. Intentional privacy posture:
 *   - `sendDefaultPii: false` — no IP, cookies, or headers attached.
 *   - `beforeSend` strips Clerk email addresses and user objects from
 *     the event envelope, keeping only the Clerk user id if it was
 *     attached via `setUser` (see `App.tsx` → `AnalyticsIdentityBridge`).
 *   - 10% trace sampling is enough for regression detection without
 *     blowing the free-tier quota.
 */

const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;
const ENV = (import.meta.env.VITE_SENTRY_ENVIRONMENT as string | undefined) ??
  (import.meta.env.DEV ? "dev" : "production");
const RELEASE = import.meta.env.VITE_SENTRY_RELEASE as string | undefined;

let initialized = false;

export function initSentry(): void {
  if (initialized || typeof window === "undefined") return;
  if (!DSN) {
    if (import.meta.env.DEV) {
      console.info(
        "[sentry] VITE_SENTRY_DSN not set — error monitoring disabled.",
      );
    }
    return;
  }

  initialized = true;

  Sentry.init({
    dsn: DSN,
    environment: ENV,
    release: RELEASE,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    sendDefaultPii: false,
    beforeSend(event) {
      // Drop user emails / usernames. Keep the anonymous id if Clerk set one.
      if (event.user) {
        event.user = event.user.id
          ? { id: event.user.id }
          : undefined;
      }
      return event;
    },
    // Ignore noisy third-party errors we can't act on.
    ignoreErrors: [
      /ResizeObserver loop/i,
      /Non-Error promise rejection captured/i,
      // Clerk sometimes throws when the key is missing in preview builds.
      /publishableKey/i,
      // PostHog/Firebase network blips when the browser is offline.
      /Failed to fetch/i,
      /NetworkError/i,
    ],
  });
}

export function setSentryUser(userId: string | null): void {
  if (!initialized) return;
  if (userId) {
    Sentry.setUser({ id: userId });
  } else {
    Sentry.setUser(null);
  }
}

export const SentryErrorBoundary = Sentry.ErrorBoundary;
