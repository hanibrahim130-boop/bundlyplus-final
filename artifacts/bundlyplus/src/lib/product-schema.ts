/**
 * Shared Product / Offer structured-data builders (client-side).
 *
 * Keep this file in sync with `scripts/product-schema.mjs`, which is used by
 * the prerender step to emit the same JSON-LD into the static HTML.
 *
 * Fixes the Google Search Console "Merchant listings" issues reported for
 * bundlyplus.com:
 *   - Missing field 'shippingDetails' (in 'offers')
 *   - Invalid object type for field 'brand'
 *   - Missing field 'validFrom' (in 'offers')
 *   - Missing field 'hasMerchantReturnPolicy' (in 'offers')
 */

export const SITE_URL = "https://bundlyplus.com";

/** Countries BundlyPlus delivers to (digital delivery via WhatsApp). */
export const SERVED_COUNTRIES = [
  "LB",
  "SA",
  "AE",
  "KW",
  "QA",
  "BH",
  "JO",
  "EG",
] as const;

/**
 * Date the current offer terms became valid. Kept as a stable constant so the
 * emitted markup does not change on every build.
 */
export const OFFER_VALID_FROM = "2026-01-01";

/**
 * The money-back window BundlyPlus advertises.
 *
 * WARNING: this number is a public promise. If you change it you must also
 * change every place it is shown to customers, otherwise Google will flag the
 * mismatch between the structured data and the visible copy:
 *   - src/pages/RefundPolicy.tsx        (section 6, EN + AR)
 *   - src/lib/i18n.tsx                  (hero.mainSubtitle, hero.trustBadges.moneyBack,
 *                                        hero.apple.trustPills, hero.trust.items,
 *                                        productDetails.faq)
 *   - src/components/home/SocialProofStrip.tsx
 *   - scripts/product-schema.mjs        (MERCHANT_RETURN_DAYS)
 */
export const MERCHANT_RETURN_DAYS = 25;

export interface ProductSchemaInput {
  name: string;
  description?: string;
  category?: string;
  price: number | string;
  url?: string;
  brand?: string;
  inStock?: boolean;
}

export function buildBrand(name?: string) {
  return {
    "@type": "Brand",
    name: String(name || "BundlyPlus"),
  };
}

export function buildShippingDetails() {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: "0.00",
      currency: "USD",
    },
    shippingDestination: SERVED_COUNTRIES.map((country) => ({
      "@type": "DefinedRegion",
      addressCountry: country,
    })),
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: 0,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: 1,
        unitCode: "DAY",
      },
    },
  };
}

/**
 * Note: `returnMethod` is intentionally omitted. It is an optional field and
 * nothing physical is ever returned for a digital subscription, so declaring
 * ReturnByMail (or similar) would be inaccurate.
 */
export function buildMerchantReturnPolicy() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: [...SERVED_COUNTRIES],
    returnPolicyCountry: "LB",
    returnPolicyCategory:
      "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: MERCHANT_RETURN_DAYS,
    returnFees: "https://schema.org/FreeReturn",
    merchantReturnLink: SITE_URL + "/refund-policy",
  };
}

export function buildOffer(input: ProductSchemaInput) {
  const offer: Record<string, unknown> = {
    "@type": "Offer",
    price: Number(input.price || 0).toFixed(2),
    priceCurrency: "USD",
    availability:
      input.inStock === false
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    validFrom: OFFER_VALID_FROM,
    shippingDetails: buildShippingDetails(),
    hasMerchantReturnPolicy: buildMerchantReturnPolicy(),
  };
  if (input.url) offer.url = input.url;
  return offer;
}

export function buildProductJsonLd(input: ProductSchemaInput) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    brand: buildBrand(input.brand || input.name),
    offers: buildOffer(input),
  };
  if (input.description) jsonLd.description = input.description;
  if (input.category) jsonLd.category = input.category;
  if (input.url) jsonLd.url = input.url;
  return jsonLd;
}
