import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const TRACKED_EVENTS = [
  "product_viewed",
  "bundle_viewed",
  "add_to_cart",
  "cart_viewed",
  "whatsapp_checkout_clicked",
  "wishlist_added",
  "discount_popup_shown",
  "discount_popup_dismissed",
  "discount_popup_cta_clicked",
  "currency_toggled",
  "language_toggled",
] as const;

type EventName = (typeof TRACKED_EVENTS)[number];

interface KpiResult {
  configured: boolean;
  windowDays: number;
  counts: Record<EventName, number>;
  conversion: {
    productViewToAddToCart: number | null;
    addToCartToWhatsApp: number | null;
    productViewToWhatsApp: number | null;
  };
  fetchedAt: string;
  error?: string;
}

function emptyCounts(): Record<EventName, number> {
  return TRACKED_EVENTS.reduce(
    (acc, name) => {
      acc[name] = 0;
      return acc;
    },
    {} as Record<EventName, number>,
  );
}

function ratio(numerator: number, denominator: number): number | null {
  if (!denominator) return null;
  return Math.round((numerator / denominator) * 1000) / 10;
}

router.get("/analytics/kpis", async (req, res) => {
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const host = process.env.POSTHOG_HOST || "https://us.posthog.com";
  const windowDays = Math.max(
    1,
    Math.min(90, Number(req.query.days) || 7),
  );

  const base: KpiResult = {
    configured: Boolean(apiKey && projectId),
    windowDays,
    counts: emptyCounts(),
    conversion: {
      productViewToAddToCart: null,
      addToCartToWhatsApp: null,
      productViewToWhatsApp: null,
    },
    fetchedAt: new Date().toISOString(),
  };

  if (!base.configured) {
    res.json(base);
    return;
  }

  try {
    const eventList = TRACKED_EVENTS.map((e) => `'${e}'`).join(", ");
    const hogql = `select event, count() as c from events where timestamp >= now() - interval ${windowDays} day and event in (${eventList}) group by event`;

    const response = await fetch(
      `${host.replace(/\/$/, "")}/api/projects/${projectId}/query/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: { kind: "HogQLQuery", query: hogql },
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      logger.warn(
        { status: response.status, body: text.slice(0, 400) },
        "PostHog query failed",
      );
      res.json({
        ...base,
        error: `PostHog returned ${response.status}`,
      });
      return;
    }

    const data = (await response.json()) as {
      results?: Array<[string, number]>;
    };

    const counts = emptyCounts();
    for (const row of data.results ?? []) {
      const [event, count] = row;
      if ((TRACKED_EVENTS as readonly string[]).includes(event)) {
        counts[event as EventName] = Number(count) || 0;
      }
    }

    res.json({
      ...base,
      counts,
      conversion: {
        productViewToAddToCart: ratio(
          counts.add_to_cart,
          counts.product_viewed,
        ),
        addToCartToWhatsApp: ratio(
          counts.whatsapp_checkout_clicked,
          counts.add_to_cart,
        ),
        productViewToWhatsApp: ratio(
          counts.whatsapp_checkout_clicked,
          counts.product_viewed,
        ),
      },
    } satisfies KpiResult);
  } catch (err) {
    logger.error({ err }, "PostHog KPI fetch failed");
    res.json({
      ...base,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export default router;
