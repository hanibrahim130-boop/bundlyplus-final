import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/react";
import {
  onAuthStateChanged,
  signInWithCustomToken,
  signOut,
} from "firebase/auth";
import { auth as firebaseAuth } from "@/lib/firebase-auth";
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
 * Design notes:
 *  - The bridge respects an existing Firebase Auth session that did NOT
 *    originate from Clerk (e.g. the admin panel's email/password login).
 *    That session is identified by the absence of the `provider: "clerk"`
 *    custom claim.
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

  useEffect(() => {
    let cancelled = false;

    function clearTimer() {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    }

    async function mintAndSignIn(): Promise<void> {
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

      await signInWithCustomToken(firebaseAuth, data.token);

      const expiresIn = data.expiresIn ?? 3600;
      const refreshIn = Math.max((expiresIn - 300) * 1000, 60_000);
      clearTimer();
      if (!cancelled) {
        refreshTimerRef.current = setTimeout(() => {
          inFlightRef.current = mintAndSignIn().catch(() => undefined);
        }, refreshIn);
      }
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (fbUser) => {
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
      inFlightRef.current = mintAndSignIn().catch(() => undefined);
    });

    return () => {
      cancelled = true;
      clearTimer();
      unsubscribe();
    };
  }, [isSignedIn, userId, getToken]);
}
