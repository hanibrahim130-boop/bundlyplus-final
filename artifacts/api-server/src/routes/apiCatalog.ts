import { Router, type IRouter } from "express";

const router: IRouter = Router();

const BASE = "https://bundlyplus.com";

router.get("/.well-known/api-catalog", (_req, res) => {
  const linkset = [
    {
      anchor: `${BASE}/api`,
      "service-desc": [
        {
          href: `${BASE}/api/openapi.json`,
          type: "application/openapi+json",
          title: "BundlyPlus API — OpenAPI 3.1",
        },
      ],
      "service-doc": [
        {
          href: `${BASE}/api`,
          type: "text/html",
          title: "BundlyPlus API Documentation",
        },
      ],
      status: [
        {
          href: `${BASE}/api/healthz`,
          type: "application/json",
          title: "API Health Check",
        },
      ],
    },
    {
      anchor: `${BASE}/api/products`,
      "item-rdf": [
        {
          href: `${BASE}/api/products`,
          type: "application/json",
          title: "Product Catalog",
        },
      ],
      "collection-rdf": [
        {
          href: `${BASE}/api/products`,
          type: "application/json",
          title: "All Products",
        },
      ],
    },
    {
      anchor: `${BASE}/api/settings`,
      "about-rdf": [
        {
          href: `${BASE}/api/settings`,
          type: "application/json",
          title: "Site Settings",
        },
      ],
    },
    {
      anchor: `${BASE}/api/analytics/kpis`,
      "about-rdf": [
        {
          href: `${BASE}/api/analytics/kpis`,
          type: "application/json",
          title: "Analytics KPIs",
        },
      ],
    },
  ];

  res.setHeader("Content-Type", "application/linkset+json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({ linkset });
});

export default router;
