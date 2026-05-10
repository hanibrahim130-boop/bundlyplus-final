import * as Sentry from "@sentry/node";
import { logger } from "./logger";

/**
 * Sentry api-server wiring.
 *
 * Opt-in via `SENTRY_DSN`. Must be called as early as possible in
 * `index.ts` — before the Express app is instantiated — so the SDK's
 * global error handler beats any framework-level one to uncaught
 * rejections and exceptions.
 *
 * Privacy posture:
 *   - `sendDefaultPii: false` — no IP, headers, or body attached.
 *   - `beforeSend` strips Authorization / Cookie headers if any made it
 *     onto the event (defence in depth on top of pino's redact config).
 *   - Captures Clerk `userId` from the request context if present, but
 *     no email or name.
 *
 * Traces are sampled at 10% to match the frontend.
 */

const DSN = process.env.SENTRY_DSN;
const ENV =
  process.env.SENTRY_ENVIRONMENT ??
  (process.env.NODE_ENV === "production" ? "production" : "dev");
const RELEASE = process.env.SENTRY_RELEASE;

let initialized = false;

export function initSentry(): void {
  if (initialized) return;

  if (!DSN) {
    if (process.env.NODE_ENV !== "production") {
      logger.info("SENTRY_DSN not set — Sentry disabled for api-server");
    }
    return;
  }

  Sentry.init({
    dsn: DSN,
    environment: ENV,
    release: RELEASE,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    beforeSend(event) {
      // Defence in depth: scrub Authorization + Cookie if the sdk ever
      // attaches them despite sendDefaultPii: false.
      if (event.request?.headers) {
        const h = event.request.headers as Record<string, string>;
        delete h.authorization;
        delete h.Authorization;
        delete h.cookie;
        delete h.Cookie;
        event.request.headers = h;
      }
      return event;
    },
  });

  initialized = true;
  logger.info({ environment: ENV, release: RELEASE }, "Sentry initialized");
}

export { Sentry };
