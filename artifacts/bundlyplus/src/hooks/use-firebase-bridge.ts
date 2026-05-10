import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/react";
import type { Auth, Unsubscribe, User as FbUser } from "firebase/auth";
import { apiUrl } from "@/lib/api-base";

interface BridgeTokenResponse {
  token: string;
  expiresIn?: number;
}

/**
 * Clerk -> Firebase Auth bridge.
 *
 * When a Clerk session exists, this hook calls
 * `POST /api/auth/firebase-token` to mint a Firebase custom token with
 * `uid === clerkUserId`, then `signInWithCustomToken`s the browser.
 * That makes `request.auth.uid` in Firestore rules match `userId` on
 * `/users`, `/orders`, and `/subscriptions` documents.
 *
 * Performance note: `firebase/auth` adds ~150 KB to the initial bundle.
 * The bridge is only relevant to signed-in users, so the auth SDK is
 * dynamically imported on first activation. The module is shared with
 * the admin panel (which also uses firebase/auth), so once either loads
 * it the other benefits.
 *
 * Design notes:
 *  - The bridge respects an existing Firebase Auth session that did NOT
 *    originate from Clerk (e.g. the admin panel's email/password login).
 *    That session is identified by uid mismatch against the Clerk user id.
 *  - If the API server returns 503 (bridge unconfigured), the hook falls
 *    back silently — the frontend keeps the localStorage-only behaviour
 *    the app uses today. Deploying `FIREBASE_*` secrets on the API
 *    server is the single switch to activate production-grade auth.
 *  - A guarded refresh timer re-mints the token 5 minutes before expiry
 *    as long as the Clerk session is still active.
 */
export function useFirebaseBridge(): void {
  const { isSignedIn, getToken, userId } = useAuth();
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef<Promise<void> | null>(null);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    let cancelled = false;

    function clearTimer() {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    }

    // Signed-out Clerk state needs no Firebase Auth surface at all. Exit
    // early and avoid importing the ~150 KB auth chunk for anonymous
    // visitors — which is most first pageviews.
    if (!isSignedIn || !userId) {
      clearTimer();
      return () => {
        cancelled = true;
        clearTimer();
      };
    }

    (async () => {
      const [
        { onAuthStateChanged, signInWithCustomToken, signOut },
        { auth: firebaseAuth },
      ] = await Promise.all([
        import("firebase/auth"),
        import("@/lib/firebase-auth"),
      ]);
      if (cancelled) return;

      async function mintAndSignIn(auth: Auth): Promise<void> {
        if (!isSignedIn || !userId) return;

        const clerkToken = await getToken().catch(() => null);
        if (!clerkToken) return;

        const response = await fetch(apiUrl("/api/auth/firebase-token"), {
          method: "POST",
          headers: { Authorization: `Bearer ${clerkToken}` },
        });

        // Bridge not configured -> leave Firebase auth untouched.
        if (response.status === 503) return;

        if (!response.ok) {
          throw new Error(`firebase-token: HTTP ${response.status}`);
        }

        const data = (await response.json()) as BridgeTokenResponse;
        if (cancelled) return;

        await signInWithCustomToken(auth, data.token);

        const expiresIn = data.expiresIn ?? 3600;
        const refreshIn = Math.max((expiresIn - 300) * 1000, 60_000);
        clearTimer();
        if (!cancelled) {
          refreshTimerRef.current = setTimeout(() => {
            inFlightRef.current = mintAndSignIn(auth).catch(() => undefined);
          }, refreshIn);
        }
      }

      unsubscribeRef.current = onAuthStateChanged(
        firebaseAuth,
        (fbUser: FbUser | null) => {
          if (!isSignedIn || !userId) {
            // Clerk signed out — sign Firebase out too, but only if the
            // current Firebase user was provisioned by us.
            if (fbUser && fbUser.uid === userId) {
              signOut(firebaseAuth).catch(() => undefined);
            }
            clearTimer();
            return;
          }

          // Already bridged to the same Clerk user — nothing to do.
          if (fbUser && fbUser.uid === userId) return;

          // Another Firebase session is active (e.g. admin email/password).
          // Leave it alone — the admin flow owns the Firebase session.
          if (fbUser && fbUser.uid !== userId) return;

          // Clerk is signed in but Firebase is not — mint a token.
          inFlightRef.current = mintAndSignIn(firebaseAuth).catch(
            () => undefined,
          );
        },
      );
    })();

    return () => {
      cancelled = true;
      clearTimer();
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [isSignedIn, userId, getToken]);
}
