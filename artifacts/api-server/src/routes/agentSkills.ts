import { Router, type IRouter } from "express";
import crypto from "crypto";

const router: IRouter = Router();

function sha256(content: string): string {
  return crypto.createHash("sha256").update(content, "utf-8").digest("hex");
}

router.get("/.well-known/agent-skills/index.json", (_req, res) => {
  const skills = [
    {
      name: "api-catalog",
      type: "discovery",
      description:
        "RFC 9727 API catalog for automated API discovery. Returns application/linkset+json describing all available API endpoints with their link relations.",
      url: "https://bundlyplus.com/.well-known/api-catalog",
      sha256: sha256("api-catalog-v1"),
    },
    {
      name: "oauth-authorization-server",
      type: "authentication",
      description:
        "RFC 8414 OAuth 2.0 Authorization Server Metadata. Returns issuer, authorization_endpoint, token_endpoint, jwks_uri, and supported grant types.",
      url: "https://bundlyplus.com/.well-known/oauth-authorization-server",
      sha256: sha256("oauth-authorization-server-v1"),
    },
    {
      name: "oauth-protected-resource",
      type: "authentication",
      description:
        "RFC 9728 OAuth Protected Resource Metadata. Tells agents how to obtain access tokens for protected BundlyPlus APIs.",
      url: "https://bundlyplus.com/.well-known/oauth-protected-resource",
      sha256: sha256("oauth-protected-resource-v1"),
    },
    {
      name: "openid-configuration",
      type: "authentication",
      description:
        "OpenID Connect Discovery 1.0. Returns issuer, endpoints, supported scopes, claims, and signing algorithms.",
      url: "https://bundlyplus.com/.well-known/openid-configuration",
      sha256: sha256("openid-configuration-v1"),
    },
    {
      name: "mcp-server-card",
      type: "protocol",
      description:
        "MCP Server Card (SEP-1649). Declares available tools (products, orders, settings), resources, and prompts that AI agents can use.",
      url: "https://bundlyplus.com/.well-known/mcp/server-card.json",
      sha256: sha256("mcp-server-card-v1"),
    },
    {
      name: "link-headers",
      type: "discovery",
      description:
        "RFC 8288 Link response headers on all responses pointing agents to sitemap, API docs, API catalog, OAuth metadata, and MCP server card.",
      url: "https://bundlyplus.com/",
      sha256: sha256("link-headers-v1"),
    },
    {
      name: "markdown-negotiation",
      type: "content",
      description:
        "Content negotiation support for AI agents. Returns text/markdown with x-markdown-tokens when agents request Accept: text/markdown.",
      url: "https://bundlyplus.com/",
      sha256: sha256("markdown-negotiation-v1"),
    },
    {
      name: "content-signals",
      type: "governance",
      description:
        "Content-Signal directives in robots.txt declaring AI content usage preferences: ai-train=no, search=yes, ai-input=yes.",
      url: "https://bundlyplus.com/robots.txt",
      sha256: sha256("content-signals-v1"),
    },
  ];

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    $schema:
      "https://github.com/cloudflare/agent-skills-discovery-rfc/blob/main/schemas/index.json",
    skills,
  });
});

export default router;
