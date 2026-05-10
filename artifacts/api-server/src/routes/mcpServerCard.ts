import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/.well-known/mcp/server-card.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    schemaVersion: "1.0",
    serverInfo: {
      name: "BundlyPlus API",
      version: "1.0.0",
      description:
        "Digital subscriptions marketplace API — browse products, manage orders, and access account data for the BundlyPlus platform serving Lebanon & MENA.",
      homepage: "https://bundlyplus.com",
      documentation: "https://bundlyplus.com/api",
    },
    transport: {
      type: "http",
      endpoint: "https://bundlyplus.com/api",
      headers: {
        Authorization: "Bearer <clerk-session-token>",
      },
    },
    capabilities: {
      tools: {
        products: {
          description: "Browse and search the digital subscriptions catalog",
          endpoints: [
            {
              method: "GET",
              path: "/api/products",
              description: "List all products with optional filters",
            },
            {
              method: "GET",
              path: "/api/products/:id",
              description: "Get product details by ID",
            },
          ],
        },
        settings: {
          description: "Site configuration and pricing",
          endpoints: [
            {
              method: "GET",
              path: "/api/settings",
              description: "Get site settings and pricing tiers",
            },
          ],
        },
      },
      resources: {
        products: {
          uri: "https://bundlyplus.com/api/products",
          mimeType: "application/json",
          description: "Full product catalog",
        },
        health: {
          uri: "https://bundlyplus.com/api/healthz",
          mimeType: "application/json",
          description: "API health status",
        },
        catalog: {
          uri: "https://bundlyplus.com/.well-known/api-catalog",
          mimeType: "application/linkset+json",
          description: "API catalog per RFC 9727",
        },
        oauth: {
          uri: "https://bundlyplus.com/.well-known/oauth-authorization-server",
          mimeType: "application/json",
          description: "OAuth 2.0 authorization server metadata",
        },
      },
      prompts: {
        checkout: {
          description:
            "Guide the user through selecting products and completing checkout via WhatsApp",
        },
        support: {
          description:
            "Help the user with order status, renewals, or general inquiries",
        },
        browse: {
          description:
            "Help the user find and compare digital subscriptions based on their needs",
        },
      },
    },
  });
});

export default router;
