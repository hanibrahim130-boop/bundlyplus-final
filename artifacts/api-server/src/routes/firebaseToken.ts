import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { logger } from "../lib/logger";

/**
 * Clerk -> Firebase custom token bridge.
 *
 * Returns a short-lived Firebase custom token whose UID is the Clerk
 * user id. When the browser calls `signInWithCustomToken` with it,
 * `request.auth.uid` in Firestore rules will match the user's Clerk id —
 * which is what the production rules in `artifacts/bundlyplus/firestore.rules`
 * expect for owner-scoped reads/writes on `/users`, `/orders`, and
 * `/subscriptions`.
 *
 * Configuration:
 *   - `FIREBASE_PROJECT_ID`
 *   - `FIREBASE_CLIENT_EMAIL`
 *   - `FIREBASE_PRIVATE_KEY` (escape newlines as `\n` or paste raw PEM)
 *
 * If any Firebase secret is missing, the endpoint returns 503 so callers
 * fall back to localStorage-only behaviour in dev. This keeps the feature
 * opt-in — deploying the bridge is the *only* switch needed to activate
 * the production Firestore rules.
 *
 * The custom token claims mirror Clerk's role so that you can optionally
 * reuse them in Firestore rules (e.g. `request.auth.token.admin == true`).
 */

const router: IRouter = Router();

// `firebase-admin` is an optional peer — the bridge only activates when
// secrets are provided. We type through a loose surface to avoid a hard
// TS dependency on the package until `pnpm add firebase-admin` has run
// in `artifacts/api-server`.
interface FirebaseAdminLike {
  apps: readonly unknown[];
  initializeApp: (opts: unknown) => unknown;
  credential: { cert: (opts: unknown) => unknown };
  auth: () => {
    createCustomToken: (
      uid: string,
      developerClaims?: Record<string, unknown>,
    ) => Promise<string>;
  };
}

let cachedAdmin: Promise<FirebaseAdminLike | null> | null = null;

async function loadFirebaseAdmin(): Promise<FirebaseAdminLike | null> {
  if (cachedAdmin) return cachedAdmin;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawKey) {
    cachedAdmin = Promise.resolve(null);
    return cachedAdmin;
  }

  cachedAdmin = (async () => {
    // Dynamic import so the dependency is optional until the bridge is
    // actually deployed. `firebase-admin` is also listed in the
    // externals block of `build.mjs`, so this still works after esbuild
    // bundling.
    const mod = (await import("firebase-admin" as string)) as {
      default?: FirebaseAdminLike;
    } & FirebaseAdminLike;
    const admin: FirebaseAdminLike = mod.default ?? mod;

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: rawKey.replace(/\\n/g, "\n"),
        }),
      });
    }

    return admin;
  })().catch((err) => {
    logger.error({ err }, "Failed to initialize firebase-admin");
    cachedAdmin = null;
    return null;
  });

  return cachedAdmin;
}

router.post("/auth/firebase-token", async (req, res) => {
  const auth = getAuth(req);

  if (!auth.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const admin = await loadFirebaseAdmin();
  if (!admin) {
    res.status(503).json({
      error:
        "Firebase bridge not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.",
    });
    return;
  }

  const claims = (auth.sessionClaims ?? {}) as {
    metadata?: { role?: string };
    publicMetadata?: { role?: string };
    role?: string;
    email?: string;
    email_address?: string;
  };
  const role =
    claims.metadata?.role ?? claims.publicMetadata?.role ?? claims.role ?? null;

  try {
    const additionalClaims: Record<string, unknown> = { provider: "clerk" };
    if (role) additionalClaims.role = role;
    if (role === "admin") additionalClaims.admin = true;

    const token = await admin.auth().createCustomToken(auth.userId, additionalClaims);

    res.json({ token, expiresIn: 3600 });
  } catch (err) {
    logger.error({ err }, "createCustomToken failed");
    res.status(500).json({ error: "Failed to mint Firebase token" });
  }
});

export default router;
