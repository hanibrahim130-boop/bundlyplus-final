import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  jsonLd?: object | object[];
}

const SITE = 'BundlyPlus';
const BASE_URL = 'https://bundlyplus.com';
const DEFAULT_OG = `${BASE_URL}/opengraph.jpg`;

export function Seo({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG,
  noIndex = false,
  jsonLd,
}: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE}` : `${SITE} — Premium Digital Subscriptions at Unbeatable Prices`;
  const metaDesc =
    description ||
    'Get Netflix, Spotify, ChatGPT, Adobe & 50+ premium subscriptions at up to 80% off. Instant WhatsApp delivery across Lebanon & MENA.';
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  const schemas = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
