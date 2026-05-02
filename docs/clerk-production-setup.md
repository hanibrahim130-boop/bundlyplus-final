# Clerk Production Setup for bundlyplus.com

This is a step-by-step walkthrough to move the live site from Clerk **test** keys
(`pk_test_*`, with the yellow "development" banner) to Clerk **production** keys
(`pk_live_*`).

The codebase itself does not need any changes — `artifacts/bundlyplus/src/App.tsx`
already sources `VITE_CLERK_PUBLISHABLE_KEY` from env (via Clerk's
`publishableKeyFromHost(hostname, envKey)` helper) and passes the result to
`<ClerkProvider>`, so the swap is purely operational (Clerk dashboard →
Google/Apple consoles → DNS → Vercel).

> Total time: ~30–60 minutes if Apple Developer is already set up; +1 day if you
> have to wait on Apple OAuth approval or DNS propagation.

---

## 0. What you'll need before you start

- Owner/admin access to the Clerk account that owns the current `bundlyplus`
  application
- Access to the Google Cloud Console project you want to use for Sign in with
  Google (or permission to create a new one)
- An Apple Developer account ($99/yr) with admin rights — only required if you
  want to keep Apple sign-in
- DNS access for `bundlyplus.com` (the registrar/DNS provider, e.g. Cloudflare,
  Route53, GoDaddy)
- Owner/admin access to the Vercel project that hosts bundlyplus.com

---

## 1. Create the Clerk production instance

1. Open the Clerk dashboard → select the `bundlyplus` application.
2. In the top-left **environment switcher**, click **Development** → **Create
   production instance**.
3. Clerk will copy your dev settings (sign-in methods, branding, etc.) as a
   starting point. Confirm.
4. Once created, switch the environment dropdown to **Production**. From here on,
   everything you configure applies to the prod instance.
5. Go to **API Keys** and copy the **Publishable key** — it starts with
   `pk_live_`. Save it somewhere safe; you'll paste it into Vercel in step 5.

> ⚠️ Do not copy the Secret Key into the frontend. Only `pk_live_*` belongs in
> `VITE_CLERK_PUBLISHABLE_KEY`.

---

## 2. Add and verify the bundlyplus.com domain

In the Clerk dashboard (Production instance):

1. Go to **Domains** → **Add domain** → enter `bundlyplus.com`.
2. Clerk will show a list of DNS records to add. There are typically 5 CNAMEs:
   - `clerk.bundlyplus.com`
   - `clk._domainkey.bundlyplus.com`
   - `clk2._domainkey.bundlyplus.com`
   - `clkmail.bundlyplus.com`
   - `accounts.bundlyplus.com`
3. Open your DNS provider (Cloudflare/Route53/etc.) and add each CNAME exactly as
   shown by Clerk. **For Cloudflare specifically, set the proxy status to "DNS
   only" (grey cloud) for all five.**
4. Back in Clerk, click **Verify**. Verification can take anywhere from 1 minute
   to a few hours depending on your DNS TTL.
5. Once all five turn green, the domain is live. Clerk's Frontend API will be
   served from `clerk.bundlyplus.com`, and email-based flows (magic links,
   verification codes) will come from `clkmail.bundlyplus.com`.

---

## 3. Configure Google OAuth (production credentials)

In **dev**, Clerk lets you use Google sign-in with their shared OAuth app. In
**prod**, Google will block that and you must supply your own OAuth client.

1. Go to https://console.cloud.google.com → pick (or create) the project you
   want to use for BundlyPlus.
2. **APIs & Services → OAuth consent screen**:
   - User type: **External**.
   - App name: `BundlyPlus`.
   - User support email: your support email.
   - Authorized domains: add `bundlyplus.com` and `clerk.bundlyplus.com`.
   - Scopes: leave the default `openid email profile`.
   - Publish the app (move it from "Testing" to "In production"). This is what
     allows real customers to sign in.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**.
   - Name: `BundlyPlus Production`.
   - Authorized JavaScript origins: `https://bundlyplus.com`,
     `https://clerk.bundlyplus.com`.
   - Authorized redirect URIs: paste the exact callback URL Clerk shows you on
     the Google provider page (it looks like
     `https://clerk.bundlyplus.com/v1/oauth_callback`). **Use the value Clerk
     gives you — don't guess.**
4. Copy the **Client ID** and **Client Secret**.
5. In the Clerk dashboard (Production) → **User & Authentication → Social
   Connections → Google** → toggle "Use custom credentials" → paste the Client
   ID and Secret → save.

Test it: go to `https://bundlyplus.com/sign-in` (after step 5 below) and sign in
with Google. The dev banner should be gone and the consent screen should show
your app name.

---

## 4. Configure Apple OAuth (optional, only if keeping Apple sign-in)

If you don't want Apple sign-in in production, skip this section and disable
Apple under **Social Connections** in Clerk Production.

If you do want it:

1. https://developer.apple.com/account → **Certificates, Identifiers & Profiles**.
2. **Identifiers → +**:
   - Type: **Services IDs**.
   - Description: `BundlyPlus Sign In`.
   - Identifier: `com.bundlyplus.signin` (this is your Apple "Service ID").
   - Enable **Sign In with Apple**, then click **Configure**:
     - Primary App ID: pick or create your App ID.
     - Domains and Subdomains: `bundlyplus.com`, `clerk.bundlyplus.com`.
     - Return URLs: paste the callback URL Clerk shows on the Apple provider
       page.
3. **Keys → +**:
   - Key Name: `BundlyPlus Sign In Key`.
   - Enable **Sign In with Apple** → Configure → pick the Primary App ID.
   - Register, then **download the `.p8` file** (one chance only — save it).
   - Note the **Key ID** (10-char string) and your **Team ID** (top-right of the
     Apple Developer dashboard).
4. In the Clerk dashboard (Production) → **Social Connections → Apple** → toggle
   "Use custom credentials":
   - Service ID: `com.bundlyplus.signin`
   - Apple Team ID: from step 3
   - Apple Key ID: from step 3
   - Apple Private Key: paste the contents of the `.p8` file (including the
     `BEGIN PRIVATE KEY` / `END PRIVATE KEY` lines)
   - Save.

---

## 5. Update the Vercel environment variable

1. Open Vercel → BundlyPlus project → **Settings → Environment Variables**.
2. Find `VITE_CLERK_PUBLISHABLE_KEY`.
3. For the **Production** environment specifically, edit the value to the
   `pk_live_*` key from step 1. Leave Preview/Development pointed at the
   `pk_test_*` key so internal preview deploys still work.
4. Save.
5. Trigger a redeploy of the Production deployment (Deployments → latest prod
   deploy → ⋯ → **Redeploy**, with "Use existing Build Cache" unchecked to be
   safe).

> The frontend code at `artifacts/bundlyplus/src/App.tsx` already consumes this
> env var (through `publishableKeyFromHost`), so no code change or rebuild
> config is required.

---

## 6. End-to-end verification on bundlyplus.com

After the redeploy finishes:

1. Open `https://bundlyplus.com` in an incognito window.
2. The yellow Clerk **"development mode"** banner should be **gone**.
3. Click **Sign in** → **Continue with Google**:
   - Consent screen says **BundlyPlus** (not Clerk's shared dev app).
   - After consent you land back on `https://bundlyplus.com/account`.
4. Sign out, then click **Sign in** → **Continue with Apple** (if enabled):
   - Apple shows the BundlyPlus name.
   - After consent you land back on `/account`.
5. Sign out, then sign up with email + verification code. The verification email
   should arrive from `noreply@bundlyplus.com` (or `clkmail.bundlyplus.com`),
   not from `accounts.dev`.
6. Open the Clerk dashboard → Production → **Users** and confirm the new user
   appears.

If any step fails, see Troubleshooting below.

---

## 7. Update the Replit dev preview (optional)

The Replit dev preview at the `*.replit.dev` URL can keep using the `pk_test_*`
key — that's intentional, so the dev environment doesn't pollute your real user
table. No action needed unless you want the dev preview to also point at prod.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Yellow "development" banner still showing | Vercel still serving the old build, or env var was set on the wrong environment | Hard-refresh; confirm `VITE_CLERK_PUBLISHABLE_KEY` is set on **Production** (not Preview) and redeploy |
| "Invalid host" / Clerk Frontend API 4xx | DNS not yet propagated, or CNAME proxied through Cloudflare | Wait for DNS, set Cloudflare records to "DNS only" |
| Google: `Error 400: redirect_uri_mismatch` | Redirect URI in Google Cloud doesn't match Clerk's exact callback | Copy the redirect URI from Clerk's Google provider page **verbatim** into Google Cloud |
| Google: `Error 403: access_denied` for non-test users | OAuth consent screen still in "Testing" mode | Publish the app in Google Cloud → OAuth consent screen |
| Apple: `invalid_client` | Wrong Service ID, Team ID, Key ID, or `.p8` body | Re-paste each value; the `.p8` must include the BEGIN/END lines |
| Verification emails come from `accounts.dev` | Domain not yet verified in Clerk | Finish DNS verification in Clerk → Domains |

---

## Rollback plan

If something is broken after the swap, you can roll back in under 2 minutes:

1. Vercel → Settings → Environment Variables → set
   `VITE_CLERK_PUBLISHABLE_KEY` (Production) back to the previous `pk_test_*`
   value.
2. Redeploy.
3. The site reverts to the dev instance and the yellow banner reappears, but
   sign-in works again while you debug the prod instance.

User accounts created against the dev instance and the prod instance are
separate, so customers who signed up after the cutover will need to sign up
again on whichever instance you settle on. Plan the cutover for a low-traffic
window.
