import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/lib/firestore-hooks";
import { useCurrency } from "@/lib/currency";
import { useSettings } from "@/lib/settings";
import { useI18n } from "@/lib/i18n";
import { getLogoUrl } from "@/utils/logoUtils";
import { getBrandGradient, getInitials } from "@/lib/brand-theme";
import { getCategoryTheme } from "@/lib/category-theme";
import { generateWhatsAppOrderLink } from "@/utils/whatsapp";
import { productHref } from "@/lib/product-slug";
import { useCatalogCount } from "@/lib/catalog-count";
import type { Product } from "@/types";

/**
 * Selection — Apple-style featured catalog grid.
 *
 * Six flat cards, three columns on desktop / two on tablet / one on
 * mobile. Each card shows the brand logo, name, category pill, price
 * and a WhatsApp order CTA that deep-links into wa.me with a
 * pre-filled message (brief template).
 *
 * Cards follow the hairline-border Apple pattern: no gradients, a
 * subtle lift + shadow on hover. Details page opens on card-click,
 * the WhatsApp button is a sibling CTA that stops propagation.
 */

interface SelectionCardProps {
  product: Product;
  whatsappNumber: string;
}

function SelectionCard({ product, whatsappNumber }: SelectionCardProps) {
  const { format } = useCurrency();
  const [imgFailed, setImgFailed] = useState(false);
  const url = getLogoUrl(product.name);
  const theme = getCategoryTheme(product.category);

  const orderLink = generateWhatsAppOrderLink(
    whatsappNumber,
    product.name,
    product.duration || "1 Month",
  );

  return (
    <article className="bp-card p-5 sm:p-6 flex flex-col h-full">
      {/* Header row — logo + category pill */}
      <div className="flex items-start justify-between mb-5">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl p-2.5 ring-1 ring-black/5 dark:ring-white/5"
          style={{ background: "#fff" }}
        >
          {url && !imgFailed ? (
            <img
              src={url}
              alt={product.name}
              className="h-full w-full object-contain"
              onError={() => setImgFailed(true)}
              loading="lazy"
              decoding="async"
              width={56}
              height={56}
            />
          ) : (
            <div
              className={`h-full w-full rounded-xl bg-gradient-to-br ${getBrandGradient(product.name)} flex items-center justify-center text-white font-semibold text-sm`}
            >
              {getInitials(product.name)}
            </div>
          )}
        </div>
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase"
          style={{
            background: `${theme.hex}14`,
            color: theme.hex,
          }}
        >
          {theme.label}
        </span>
      </div>

      {/* Name + snippet */}
      <Link
        href={productHref(product)}
        className="group mb-auto"
      >
        <h3
          className="text-[17px] sm:text-lg font-semibold tracking-tight mb-1.5 transition-colors"
          style={{ color: "var(--bp-ink)" }}
        >
          {product.name}
        </h3>
        {product.description && (
          <p
            className="text-[13px] leading-relaxed line-clamp-2"
            style={{ color: "var(--bp-ink-soft)" }}
          >
            {product.description}
          </p>
        )}
      </Link>

      {/* Features list (max 3) */}
      {product.features && product.features.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {product.features.slice(0, 3).map((feature, i) => (
            <li
              key={i}
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{
                background: "var(--bp-bg-muted)",
                color: "var(--bp-ink-soft)",
                border: "1px solid var(--bp-border)",
              }}
            >
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* Footer — price + WhatsApp CTA */}
      <div
        className="mt-6 pt-5 flex items-end justify-between gap-3"
        style={{ borderTop: "1px solid var(--bp-border)" }}
      >
        <div>
          <div
            className="text-2xl font-semibold tracking-tight tabular-nums-p"
            style={{ color: "var(--bp-ink)" }}
          >
            {format(product.price)}
          </div>
          <div
            className="text-[11px] font-medium"
            style={{ color: "var(--bp-ink-faint)" }}
          >
            / month
          </div>
        </div>

        <a
          href={orderLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold transition-colors"
          style={{
            background: "#25D366",
            color: "#fff",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span>Order</span>
        </a>
      </div>
    </article>
  );
}

export function Selection() {
  const { data: productsData = [], isLoading } = useProducts({ featured: true });
  const { data: allProducts = [] } = useProducts();
  const { siteSettings } = useSettings();
  const { t, lang } = useI18n();
  const catalog = useCatalogCount();
  const countLabel = catalog.localized(lang);
  const catalogLead = t.home.catalogLead.replace("{count}", countLabel);
  const viewAllLabel = t.home.viewAllProductsCount.replace("{count}", countLabel);

  const whatsappNumber =
    (siteSettings as { whatsapp_number?: string }).whatsapp_number ||
    "96176171003";

  // Show the trendiest products: hot first, then featured, sorted by
  // popularity signals. This ensures the homepage shelf shows what
  // people actually want — not alphabetical filler.
  // Brand-boost: well-known names get priority so the shelf feels
  // immediately recognizable to first-time visitors.
  const items = useMemo(() => {
    const pool = (allProducts as Product[]).length > 0
      ? (allProducts as Product[])
      : (productsData as Product[]);

    const brandBoost = new Set([
      "Netflix Premium",
      "ChatGPT Plus",
      "Spotify Premium",
      "Adobe Creative Cloud",
      "Discord Nitro",
      "YouTube Premium",
    ]);

    return [...pool]
      .filter((p) => !p.out_of_stock && (p.hot || p.featured))
      .sort((a, b) => {
        // Brand-boosted items always first
        const aBoost = brandBoost.has(a.name) ? 3 : 0;
        const bBoost = brandBoost.has(b.name) ? 3 : 0;
        if (aBoost !== bBoost) return bBoost - aBoost;
        // Then hot > featured
        const aHot = a.hot ? 2 : a.featured ? 1 : 0;
        const bHot = b.hot ? 2 : b.featured ? 1 : 0;
        if (aHot !== bHot) return bHot - aHot;
        // Then by price descending (higher-value items feel more premium)
        return b.price - a.price;
      })
      .slice(0, 6);
  }, [allProducts, productsData]);

  return (
    <section
      className="relative w-full"
      style={{ background: "var(--bp-bg)" }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-20 sm:py-28">
        <header className="mb-10 sm:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="bp-overline mb-3">{t.home.catalogOverline}</div>
            <h2
              className="bp-display"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              {t.home.catalogTitle}
            </h2>
            <p className="bp-lead mt-4">{catalogLead}</p>
          </div>
          <Link href="/products" className="bp-link shrink-0">
            <span>{viewAllLabel}</span>
            <ArrowRight size={15} />
          </Link>
        </header>

        {isLoading ? (
          <div className="py-24 flex justify-center">
            <div
              className="h-8 w-8 rounded-full border-2 border-transparent animate-spin"
              style={{
                borderTopColor: "var(--bp-pink)",
                borderRightColor: "var(--bp-pink)",
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {items.map((product) => (
              <SelectionCard
                key={product.id}
                product={product}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
