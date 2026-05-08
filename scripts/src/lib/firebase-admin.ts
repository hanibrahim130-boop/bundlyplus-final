import admin from "firebase-admin";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

type ServiceAccountLike = Record<string, unknown>;

/**
 * Load the Firebase Admin service-account credential.
 *
 * `FIREBASE_SERVICE_ACCOUNT_JSON` may be either:
 *   - The full JSON contents (preferred — works on Vercel / CI / Fly etc. where
 *     filesystem secrets aren't available), OR
 *   - A path to a JSON file on disk (handy for local development).
 *
 * If the env var is unset, we fall back to a single canonical local path
 * so contributors who drop the key at `secrets/firebase-service-account.json`
 * (gitignored) can run scripts without exporting any env var.
 */
export function loadServiceAccount(): ServiceAccountLike {
  const fromEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (fromEnv) {
    // If it starts with `{`, treat as JSON content; otherwise treat as a path.
    if (fromEnv.startsWith("{")) {
      return JSON.parse(fromEnv) as ServiceAccountLike;
    }
    return JSON.parse(readFileSync(resolve(fromEnv), "utf-8")) as ServiceAccountLike;
  }

  const localFallback = resolve(
    import.meta.dirname,
    "../../../secrets/firebase-service-account.json",
  );
  if (existsSync(localFallback)) {
    return JSON.parse(readFileSync(localFallback, "utf-8")) as ServiceAccountLike;
  }

  throw new Error(
    "No Firebase service account found.\n" +
      "  Set FIREBASE_SERVICE_ACCOUNT_JSON to either the JSON contents or a file path,\n" +
      "  or drop the key at scripts/../secrets/firebase-service-account.json (gitignored).\n" +
      "  Generate a new key at https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk",
  );
}

/**
 * Initialise the Firebase Admin SDK exactly once and return the singleton app.
 * Safe to call from multiple scripts that share a process.
 */
export function getAdminApp(): admin.app.App {
  if (admin.apps.length > 0 && admin.apps[0]) return admin.apps[0];
  return admin.initializeApp({
    credential: admin.credential.cert(loadServiceAccount() as admin.ServiceAccount),
  });
}
