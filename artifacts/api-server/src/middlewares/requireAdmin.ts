import type { RequestHandler } from "express";
import { getAuth } from "@clerk/express";

/**
 * Guards an endpoint so that only signed-in Clerk users with an `admin`
 * role (public metadata `role === "admin"` **or** session claim
 * `metadata.role === "admin"`) can reach it.
 *
 * Usage:
 *   router.get("/analytics/kpis", requireAdmin, handler);
 *
 * The check intentionally accepts two shapes:
 *   1. `sessionClaims.metadata.role === "admin"` — default Clerk template.
 *   2. `sessionClaims.publicMetadata.role === "admin"` — used when
 *      `publicMetadata` is added to the JWT template.
 *
 * If neither shape is present the request is rejected with 401/403.
 */
export const requireAdmin: RequestHandler = (req, res, next) => {
  const auth = getAuth(req);

  if (!auth.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const claims = (auth.sessionClaims ?? {}) as {
    metadata?: { role?: string };
    publicMetadata?: { role?: string };
    role?: string;
  };

  const role =
    claims.metadata?.role ??
    claims.publicMetadata?.role ??
    claims.role;

  if (role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  next();
};
