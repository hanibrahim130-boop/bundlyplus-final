/**
 * Shared Product / Offer structured-data builders (prerender / build-time).
 *
 * Keep this file in sync with `src/lib/product-schema.ts`, which emits the same
 * JSON-LD from the React app.
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
];

/**
 * Date the current offer terms became valid. Kept as a stable constant so the
 * emitted markup does not change on every build.
 */
export const OFFER_VALID_FROM = "2026-01-01";

export function buildBrand(name) {
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

export function buildMerchantReturnPolicy() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: [...SERVED_COUNTRIES],
    returnPolicyCountry: "LB",
    returnPolicyCategory:
      "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 7,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
    merchantReturnLink: SITE_URL + "/refund-policy",
  };
}

export function buildOffer({ price, url, inStock = true }) {
  const offer = {
    "@type": "Offer",
    price: Number(price || 0).toFixed(2),
    priceCurrency: "USD",
    availability: inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    validFrom: OFFER_VALID_FROM,
    shippingDetails: buildShippingDetails(),
    hasMerchantReturnPolicy: buildMerchantReturnPolicy(),
  };
  if (url) offer.url = url;
  return offer;
}

export function buildProductJsonLd({
  name,
  description,
  category,
  price,
  url,
  brand,
  inStock = true,
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    brand: buildBrand(brand || name),
    offers: buildOffer({ price, url, inStock }),
  };
  if (description) jsonLd.description = description;
  if (category) jsonLd.category = category;
  if (url) jsonLd.url = url;
  return jsonLd;
}
