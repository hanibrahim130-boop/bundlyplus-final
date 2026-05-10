# Clerk ↔ Firebase Bridge

The BundlyPlus frontend authenticates customers with **Clerk** but stores
their data (profile, cart, wishlist, orders, subscriptions) in
**Firestore**. Firestore security rules in
[`artifacts/bundlyplus/firestore.rules`](../artifacts/bundlyplus/firestore.rules)
gate ownership on `request.auth.uid == userId`. To satisfy those rules
without rewriting the entire data path through the API server, we mint a
**Firebase custom token** whose UID is the Clerk user id and sign the
browser into Firebase with it.

## How it works

```
┌──────────────┐   Clerk session JWT   ┌──────────────────┐
│  Browser     │ ───────────────────▶  │  API server      │
│  (Clerk)     │                       │  /auth/firebase- │
│              │ ◀───── custom token ──│  token           │
└──────┬───────┘                       └────────┬─────────┘
       │                                        │ Firebase Admin SDK
       │ signInWithCustomToken                  │ createCustomToken
       ▼                                        ▼
┌──────────────┐                       ┌──────────────────┐
│  Firebase    │                       │  Google IAM      │
│  Auth        │                       │  (service acct)  │
└──────┬───────┘                       └──────────────────┘
       │ request.auth.uid = clerkUserId
       ▼
┌──────────────┐
│  Firestore   │   rules match userId
└──────────────┘
```

The bridge is **opt-in**. If the API server does not have the
`FIREBASE_*` secrets, the endpoint returns **503** and the client hook
falls back silently. This keeps local dev working on relaxed Firestore
rules while the production deploy runs on the strict rules.

## Server side

- Route: `POST /api/auth/firebase-token`
  ([`artifacts/api-server/src/routes/firebaseToken.ts`](../artifacts/api-server/src/routes/firebaseToken.ts))
- Auth: Clerk session JWT (`Authorization: Bearer <token>`), verified by
  the `clerkMiddleware` mounted in
  [`app.ts`](../artifacts/api-server/src/app.ts).
- Dependency: [`firebase-admin`](https://www.npmjs.com/package/firebase-admin)
  as an `optionalDependency` of `@workspace/api-server`. It is listed in
  the esbuild `external` list in
  [`build.mjs`](../artifacts/api-server/build.mjs).

### Required secrets (Replit or your host)

| Var | Source | Purpose |
| --- | --- | --- |
| `FIREBASE_PROJECT_ID` | Firebase Console → Project settings | Identifies the Firebase project. |
| `FIREBASE_CLIENT_EMAIL` | Firebase Console → Service accounts → generate new key | The service account email. |
| `FIREBASE_PRIVATE_KEY` | same JSON, the `private_key` field | Raw PEM, or escape newlines as `\n`. |

Generate the service account key:

```
Firebase Console → Project settings → Service accounts →
  Generate new private key → Save as JSON.
```

Only these three fields are required — do **not** commit the JSON file.
The private key already supplies everything `firebase-admin.cert()`
needs.

### Custom claims

The bridge attaches the following claims to every minted token:

| Claim | Value | Notes |
| --- | --- | --- |
| `provider` | `"clerk"` | Marker used by the client hook to recognise bridge-signed sessions. |
| `role` | e.g. `"admin"` | Mirrored from Clerk `sessionClaims.metadata.role`, if present. |
| `admin` | `true` | Only when role is `admin`. Rules can read `request.auth.token.admin`. |

Add `metadata` or `publicMetadata` to the Clerk JWT template so the
claims arrive on the session token. See
[Clerk docs: JWT templates](https://clerk.com/docs/backend-requests/making/jwt-templates).

## Client side

Hook: [`useFirebaseBridge`](../artifacts/bundlyplus/src/hooks/use-firebase-bridge.ts)

- Mounted inside the Clerk-authenticated shell (see `App.tsx` →
  `AnalyticsIdentityBridge`).
- Calls the bridge endpoint whenever Clerk is signed in and Firebase
  Auth is not already holding the matching uid.
- **Preserves admin sessions.** If a non-Clerk Firebase user is active
  (e.g. the admin panel's email/password login), the hook leaves it
  alone. The admin flow owns Firebase in that case.
- Auto-refreshes the custom token 5 minutes before expiry (default
  3600s / Firebase's hard cap on custom tokens).

## Admin panel caveat

Admins today sign in via Firebase email/password in
[`Admin.tsx`](../artifacts/bundlyplus/src/pages/Admin.tsx), with an
`admin` custom claim granted via
`pnpm --filter @workspace/scripts run set-admin-claim`. Going forward
you have two paths, in order of preference:

1. **Unify on Clerk.** Move admin auth to Clerk with `role=admin` in
   metadata. The bridge mints `admin: true` in the custom token, and
   the same Firebase session works for both customer and admin pages.
   Drop the email/password path entirely.
2. **Keep both.** The bridge intentionally does not overwrite a
   non-Clerk Firebase session. Admins continue to use
   `signInWithEmailAndPassword`; customers use Clerk. The risk is that
   an admin who is also a Clerk-signed customer on the same tab will
   see the bridge clobber their admin session after refresh (since
   Firebase persists a single user at a time). Open the admin panel in
   a different profile / incognito window to avoid the collision.

## Activating the bridge

1. Install the optional dep (one-time, only on the API server):

   ```
   pnpm --filter @workspace/api-server install
   ```

   (pnpm will fetch `firebase-admin` now that it is declared.)

2. Set the three `FIREBASE_*` Secrets on Replit (or your host).

3. Deploy the API server.

4. Deploy the strict Firestore rules:

   ```
   firebase deploy --only firestore:rules \
     --project=<FIREBASE_PROJECT_ID>
   ```

5. Verify. Open a Clerk-signed session, check the Application tab
   → IndexedDB → `firebase-heartbeat-database` for a user, and confirm
   reads/writes against `/users/{uid}` succeed.
