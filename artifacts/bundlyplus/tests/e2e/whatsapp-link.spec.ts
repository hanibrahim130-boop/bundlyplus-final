import { test, expect } from "@playwright/test";
import { generateWhatsAppLink } from "../../src/utils/whatsapp";

/**
 * Contract tests for the WhatsApp checkout link generator.
 *
 * Playwright test files run in Node, and `@playwright/test` uses its own
 * esbuild-powered TS loader, so we can import the utility directly from
 * source. No browser context is needed — the function is pure.
 */

test.describe("generateWhatsAppLink", () => {
  test("builds wa.me URL with phone, items, total and order ref", () => {
    const link = generateWhatsAppLink(
      "961 76 171 003",
      [
        {
          id: "netflix",
          name: "Netflix Premium",
          price: 5,
          quantity: 2,
          type: "product",
          duration: "1_month",
        },
      ],
      10,
      undefined,
      "#ABC12345",
    );

    expect(link).toContain("https://wa.me/96176171003");

    const decoded = decodeURIComponent(link.split("?text=")[1] ?? "");
    expect(decoded).toContain("2x");
    expect(decoded).toContain("Netflix Premium");
    expect(decoded).toContain("(1_month)");
    expect(decoded).toContain("Total: $10.00");
    // whatsapp.ts wraps the order ref in Markdown bold (`*Order ref:*`) so
    // the pasted message is formatted in the WhatsApp client.
    expect(decoded).toContain("*Order ref:* #ABC12345");
  });

  test("strips non-digit characters from phone number", () => {
    const link = generateWhatsAppLink(
      "+961-76-171-003",
      [
        {
          id: "spotify",
          name: "Spotify",
          price: 3,
          quantity: 1,
          type: "product",
        },
      ],
      3,
    );

    expect(link).toMatch(/^https:\/\/wa\.me\/96176171003\?text=/);
  });

  test("omits order ref line when not provided", () => {
    const link = generateWhatsAppLink(
      "96176171003",
      [{ id: "x", name: "X", price: 1, quantity: 1, type: "product" }],
      1,
    );
    const decoded = decodeURIComponent(link.split("?text=")[1] ?? "");
    expect(decoded).not.toContain("*Order ref:*");
  });

  test("uses custom formatter when supplied", () => {
    const link = generateWhatsAppLink(
      "96176171003",
      [
        {
          id: "a",
          name: "A",
          price: 100,
          quantity: 1,
          type: "bundle",
        },
      ],
      100,
      (usd) => `${(usd * 89_500).toLocaleString()} LBP`,
    );
    const decoded = decodeURIComponent(link.split("?text=")[1] ?? "");
    expect(decoded).toContain("8,950,000 LBP");
  });
});
