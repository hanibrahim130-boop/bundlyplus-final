import type { Request, Response, NextFunction } from "express";

/**
 * RFC 8288 Link response headers for AI agent discovery.
 * Advertises sitemap, API docs, and API catalog to bots and agents.
 */
export function linkHeaders(_req: Request, res: Response, next: NextFunction) {
  const links = [
    '</sitemap.xml>; rel="sitemap"',
    '</api>; rel="service-doc"',
    '</.well-known/api-catalog>; rel="api-catalog"',
    '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
    '</.well-known/agent-skills/index.json>; rel="agent-skills"',
    '</.well-known/oauth-authorization-server>; rel="oauth-server-metadata"',
    '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"',
    '</.well-known/openid-configuration>; rel="openid-configuration"',
  ];
  res.setHeader("Link", links.join(", "));
  next();
}
