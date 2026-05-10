import { test, expect } from "@playwright/test";

/**
 * Smoke suite — guards the public, unauthenticated surface of bundlyplus.
 *
 * Design rules:
 *  - No live Firestore or Clerk required. Firestore network failures degrade
 *    to skeleton/empty UI which we assert against.
 *  - `vite preview` serves the SPA fallback (index.html) for every unknown
 *    path, so we assert what the React shell renders after hydration rather
 *    than per-route prerendered HTML (that's a Vercel-rewrite concern).
 *  - Selectors prefer structural landmarks (role=navigation, footer) over
 *    copy because the app is bilingual EN/AR.
 */

test.describe("app shell", () => {
  test("home renders navbar and footer", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status(), "home must return 2xx").toBeLessThan(400);

    // Navbar + Footer ship on every route. If either is missing the shell
    // crashed during hydration. The home route is prerendered, which means
    // the built HTML already contains a <footer> before React mounts — the
    // SPA footer appears after hydration. Use .first() to avoid strict-mode
    // violations while still asserting *something* rendered.
    await expect(page.getByRole("navigation").first()).toBeVisible();
    await expect(page.locator("footer").first()).toBeVisible();
  });

  test("home hydrates without pageerror", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Give React a moment to hydrate without waiting on long-polling
    // Firebase/PostHog requests that never go idle.
    await page.waitForTimeout(1_500);

    // Third-party SDKs (Clerk, PostHog, Firebase) log warnings in dev
    // without a real key — those are acceptable. App-level errors are not.
    const appErrors = pageErrors.filter(
      (m) => !/clerk|posthog|firebase|network|fetch/i.test(m),
    );
    expect(appErrors).toEqual([]);
  });
});

test.describe("products", () => {
  test("page loads and resolves to a grid or an empty state", async ({
    page,
  }) => {
    await page.goto("/products");

    // Either a product card link appears, or the EmptyState heading does.
    // We poll because Firestore may take a beat before giving up.
    await expect
      .poll(
        async () => {
          const hasCards = await page
            .locator('article, [role="article"]')
            .count();
          const emptyStateVisible = await page
            .locator("main")
            .getByRole("heading")
            .first()
            .isVisible()
            .catch(() => false);
          return hasCards > 0 || emptyStateVisible;
        },
        { timeout: 15_000, intervals: [250, 500, 1_000] },
      )
      .toBeTruthy();
  });
});

test.describe("cart", () => {
  test("empty cart shows a browse-products CTA, no checkout button", async ({
    page,
  }) => {
    await page.goto("/cart");

    // EmptyState renders a link to /products. Match by href inside <main>
    // so we pick the visible CTA rather than the hidden desktop nav link
    // (mobile viewport hides the nav link but keeps the empty-state CTA).
    const browseCta = page
      .locator("main")
      .locator('a[href="/products"]')
      .first();
    await expect(browseCta).toBeVisible();

    // Empty cart must not show the primary "Checkout" CTA inside <main>.
    // (The mobile viewport also renders a sticky bottom-nav checkout shortcut
    // that the cart page hides; we only care about the summary button.)
    await expect(
      page.locator("main").getByRole("button", { name: /checkout/i }),
    ).toHaveCount(0);
  });
});

test.describe("wishlist", () => {
  test("empty wishlist renders shell without crashing", async ({ page }) => {
    await page.goto("/wishlist");
    await expect(page.locator("footer").first()).toBeVisible();
    await expect(page.getByRole("navigation").first()).toBeVisible();
  });
});

test.describe("static pages", () => {
  const staticPaths = [
    "/coming-soon",
    "/terms",
    "/privacy",
    "/refund-policy",
    "/contact",
  ];
  for (const path of staticPaths) {
    test(`${path} loads via SPA fallback`, async ({ page }) => {
      const response = await page.goto(path);
      // vite preview responds with the SPA index.html for unknown paths. The
      // prerendered per-route HTML files exist in dist but aren't served by
      // vite preview (that's Vercel's rewrites). We still assert a 2xx + a
      // rendered shell to guarantee no client-side route handler throws.
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("footer").first()).toBeVisible();
    });
  }
});

test.describe("prerendered HTML (static output)", () => {
  // These tests hit vite preview for the raw file path rather than the SPA
  // fallback. vite preview DOES serve /terms/index.html if we ask for it
  // explicitly, which is how we verify the prerender step produced correct
  // canonical + robots metadata per route.
  const routes: Array<[string, RegExp]> = [
    ["/terms/index.html", /bundlyplus\.com\/terms/],
    ["/privacy/index.html", /bundlyplus\.com\/privacy/],
    ["/refund-policy/index.html", /bundlyplus\.com\/refund-policy/],
    ["/contact/index.html", /bundlyplus\.com\/contact/],
    ["/coming-soon/index.html", /bundlyplus\.com\/coming-soon/],
  ];

  for (const [path, expectedCanonical] of routes) {
    test(`${path} carries a route-specific canonical`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      const html = await response.text();
      expect(html).toMatch(expectedCanonical);
    });
  }
});
