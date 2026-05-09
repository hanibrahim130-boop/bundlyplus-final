import { Router, type IRouter } from "express";

const router: IRouter = Router();

function getClerkIssuer(): string {
  // Clerk proxy URL is the issuer for this site
  const proxyUrl = process.env.CLERK_PROXY_URL || process.env.VITE_CLERK_PROXY_URL;
  if (proxyUrl) {
    // Strip trailing slash and /__clerk path
    const url = new URL(proxyUrl);
    return `${url.protocol}//${url.host}`;
  }
  // Fallback: derive from publishable key
  const pk = process.env.CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY || "";
  if (pk.startsWith("pk_live_")) {
    return "https://clerk.bundlyplus.com";
  }
  return "https://clerk.bundlyplus.com";
}

function getIssuer(): string {
  return getClerkIssuer();
}

router.get("/.well-known/oauth-authorization-server", (_req, res) => {
  const issuer = getIssuer();

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    issuer,
    authorization_endpoint: `${issuer}/oauth/authorize`,
    token_endpoint: `${issuer}/oauth/token`,
    jwks_uri: `${issuer}/.well-known/jwks.json`,
    registration_endpoint: `${issuer}/oauth/register`,
    scopes_supported: [
      "openid",
      "profile",
      "email",
      "offline_access",
    ],
    response_types_supported: [
      "code",
      "token",
      "id_token",
      "code token",
      "code id_token",
      "token id_token",
      "code token id_token",
    ],
    grant_types_supported: [
      "authorization_code",
      "implicit",
      "refresh_token",
      "client_credentials",
    ],
    token_endpoint_auth_methods_supported: [
      "client_secret_basic",
      "client_secret_post",
      "private_key_jwt",
    ],
    code_challenge_methods_supported: ["S256"],
    service_documentation: "https://bundlyplus.com/api",
  });
});

router.get("/.well-known/oauth-protected-resource", (_req, res) => {
  const issuer = getIssuer();

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    resource: "https://bundlyplus.com",
    authorization_servers: [issuer],
    scopes_supported: [
      "openid",
      "profile",
      "email",
      "offline_access",
    ],
    bearer_methods_supported: ["header"],
    resource_scopes: [
      {
        scope: "profile",
        resource: "Account profile and preferences",
      },
      {
        scope: "email",
        resource: "User email address",
      },
      {
        scope: "openid",
        resource: "User identity",
      },
      {
        scope: "offline_access",
        resource: "Refresh token for long-lived sessions",
      },
    ],
    service_documentation: "https://bundlyplus.com/api",
  });
});

router.get("/.well-known/openid-configuration", (_req, res) => {
  const issuer = getIssuer();

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    issuer,
    authorization_endpoint: `${issuer}/oauth/authorize`,
    token_endpoint: `${issuer}/oauth/token`,
    userinfo_endpoint: `${issuer}/oauth/userinfo`,
    jwks_uri: `${issuer}/.well-known/jwks.json`,
    registration_endpoint: `${issuer}/oauth/register`,
    scopes_supported: [
      "openid",
      "profile",
      "email",
      "offline_access",
    ],
    response_types_supported: [
      "code",
      "token",
      "id_token",
      "code token",
      "code id_token",
      "token id_token",
      "code token id_token",
    ],
    grant_types_supported: [
      "authorization_code",
      "implicit",
      "refresh_token",
      "client_credentials",
    ],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    token_endpoint_auth_methods_supported: [
      "client_secret_basic",
      "client_secret_post",
      "private_key_jwt",
    ],
    claims_supported: [
      "sub",
      "iss",
      "aud",
      "exp",
      "iat",
      "email",
      "email_verified",
      "name",
      "picture",
    ],
    code_challenge_methods_supported: ["S256"],
    service_documentation: "https://bundlyplus.com/api",
  });
});

export default router;
