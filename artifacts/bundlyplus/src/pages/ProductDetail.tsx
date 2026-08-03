import { useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import {
  ArrowLeft,
  Check,
  MessageCircle,
  ChevronDown,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useProducts } from "@/lib/firestore-hooks";
import { useSettings } from "@/lib/settings";
import { useI18n } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency";
import { getLogoUrl } from "@/utils/logoUtils";
import { getBrandGradient, getInitials } from "@/lib/brand-theme";
import { getCategoryTheme } from "@/lib/category-theme";
import { generateWhatsAppOrderLink } from "@/utils/whatsapp";
import { findProductBySlug, productSlug } from "@/lib/product-slug";
import { buildProductJsonLd, SITE_URL } from "@/lib/product-schema";
import { getTiers, type DurationKey, type PricingTier } from "@/lib/pricing-tiers";
import { Seo } from "@/components/seo/Seo";
import type { Product } from "@/types";

const FAQ_ACCENT = "var(--bp-pink)";

interface PricingTileProps {
  tier: PricingTier;
  selected: boolean;
  onSelect: (key: DurationKey) => void;
  format: (usd: number) => string;
  durationLabel: string;
  perMonthLabel: string;
  recommendedLabel: string;
}

function PricingTile({
  tier,
  selected,
  onSelect,
  format,
  durationLabel,
  perMonthLabel,
  recommendedLabel,
}: PricingTileProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(tier.key)}
      aria-pressed={selected}
      className="relative flex flex-col items-start gap-1 rounded-2xl p-5 text-left transition-all duration-200 focus:outline-none"
      style={{
        background: "var(--bp-bg)",
        border: `2px solid ${selected ? "var(--bp-pink)" : "var(--bp-border)"}`,
        boxShadow: selected ? "0 0 0 4px rgba(236,72,153,0.12)" : "none",
      }}
    >
      {tier.recommended && (
        <span
          className="absolute -top-2 start-4 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white"
          style={{ background: "var(--bp-pink)" }}
        >
          {recommendedLabel}
        </span>
      )}

      <span
        className="text-[12px] font-semibold tracking-[0.02em]"
        style={{ color: selected ? "var(--bp-pink)" : "var(--bp-ink-soft)" }}
      >
        {durationLabel}
      </span>

      <span
        className="text-2xl font-bold tracking-tight tabular-nums-p"
        style={{ color: "var(--bp-ink)" }}
      >
        {format(tier.price)}
      </span>

      <span
        className="text-[11px] font-medium tabular-nums-p"
        style={{ color: "var(--bp-ink-faint)" }}
      >
        {format(tier.perMonth)} {perMonthLabel}
      </span>

      {tier.savingsBadge && (
        <span
          className="mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{
            background: "rgba(34,197,94,0.12)",
            color: "#16A34A",
          }}
        >
          {tier.savingsBadge}
        </span>
      )}
    </button>
  );
}

export default function ProductDetail() {
  const [, params] = useRoute<{ slug: string }>("/products/:slug");
  const slug = params?.slug || "";
  const { data: products = [], isLoading } = useProducts();
  const { siteSettings } = useSettings();
  const { t, lang } = useI18n();
  const { format } = useCurrency();
  const isRTL = lang === "ar";

  const whatsappNumber =
    (siteSettings as { whatsapp_number?: string }).whatsapp_number ||
    "96176171003";

  const product: Product | undefined = useMemo(() => {
    return findProductBySlug(products as Product[], slug);
  }, [products, slug]);

  const tiers = useMemo(
    () => (product ? getTiers(product.price) : []),
    [product],
  );

  const [selectedKey, setSelectedKey] = useState<DurationKey>("12m");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [imgFailed, setImgFailed] = useState(false);

  const selectedTier = useMemo(
    () => tiers.find((t) => t.key === selectedKey) ?? tiers[0],
    [tiers, selectedKey],
  );

  if (isLoading) {
    return (
      <main
        className="min-h-[60vh] flex items-center justify-center"
        style={{ background: "var(--bp-bg)" }}
      >
        <div
          className="h-8 w-8 rounded-full border-2 border-transparent animate-spin"
          style={{
            borderTopColor: "var(--bp-pink)",
            borderRightColor: "var(--bp-pink)",
          }}
        />
      </main>
    );
  }

  if (!product) {
    return (
      <main
        className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center"
        style={{ background: "var(--bp-bg)" }}
      >
        <h1
          className="text-2xl font-semibold tracking-tight mb-2"
          style={{ color: "var(--bp-ink)" }}
        >
          {t.notFound.title}
        </h1>
        <p
          className="mb-6 max-w-md"
          style={{ color: "var(--bp-ink-soft)" }}
        >
          {t.notFound.desc}
        </p>
        <Link href="/products" className="bp-btn-primary">
          {t.productDetails.backToProducts}
        </Link>
      </main>
    );
  }

  const theme = getCategoryTheme(product.category);
  const Icon = theme.icon;
  const url = getLogoUrl(product.name);

  const duration = selectedTier?.label || "1 Month";
  const orderLink = generateWhatsAppOrderLink(
    whatsappNumber,
    product.name,
    duration,
  );

  const canonicalPath = `/products/${productSlug(product.name)}`;

  const durationMap: Record<DurationKey, string> = {
    "1m": t.pricing.duration.oneMonth,
    "3m": t.pricing.duration.threeMonths,
    "6m": t.pricing.duration.sixMonths,
    "12m": t.pricing.duration.oneYear,
  };

  return (
    <main
      className="pb-32 sm:pb-16"
      style={{ background: "var(--bp-bg)" }}
    >
      <Seo
        title={`${product.name} — Order on WhatsApp`}
        description={
          product.description ||
          `${product.name} subscription with instant WhatsApp delivery in Lebanon.`
        }
        canonical={canonicalPath}
        jsonLd={buildProductJsonLd({
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          url: `${SITE_URL}${canonicalPath}`,
          inStock: !product.out_of_stock,
        })}
      />

      {/* Back link */}
      <div className="mx-auto max-w-5xl px-5 sm:px-6 pt-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:text-[color:var(--bp-pink)]"
          style={{ color: "var(--bp-ink-soft)" }}
        >
          <ArrowLeft size={14} className={isRTL ? "rotate-180" : ""} />
          <span>{t.productDetails.backToProducts}</span>
        </Link>
      </div>

      {/* Hero row: logo + name + meta */}
      <section className="mx-auto max-w-5xl px-5 sm:px-6 pt-8 sm:pt-12 pb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div
            className="h-24 w-24 shrink-0 rounded-3xl bg-white p-4 ring-1 ring-black/5 shadow-sm"
          >
            {url && !imgFailed ? (
              <img
                src={url}
                alt={product.name}
                className="h-full w-full object-contain"
                onError={() => setImgFailed(true)}
                loading="eager"
                decoding="async"
                width={96}
                height={96}
              />
            ) : (
              <div
                className={`h-full w-full rounded-2xl bg-gradient-to-br ${getBrandGradient(product.name)} flex items-center justify-center text-white font-semibold text-2xl`}
              >
                {getInitials(product.name)}
              </div>
            )}
          </div>

          <div className="flex-grow">
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase mb-3"
              style={{
                background: `${theme.hex}14`,
                color: theme.hex,
              }}
            >
              <Icon size={12} />
              <span>{theme.label}</span>
            </div>
            <h1
              className="bp-display"
              style={{ fontSize: "clamp(1.875rem, 4vw, 3rem)" }}
            >
              {product.name}
            </h1>
            {product.description && (
              <p
                className="mt-3 text-[15px] leading-relaxed max-w-2xl"
                style={{ color: "var(--bp-ink-soft)" }}
              >
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Quick meta row */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bp-card p-4 flex items-start gap-3">
            <Zap size={16} style={{ color: "var(--bp-pink)" }} className="mt-0.5 shrink-0" />
            <div>
              <div
                className="text-[13px] font-semibold tracking-tight"
                style={{ color: "var(--bp-ink)" }}
              >
                {t.productDetails.fastDelivery}
              </div>
              <div
                className="text-[12px] mt-0.5"
                style={{ color: "var(--bp-ink-soft)" }}
              >
                {t.productDetails.fastDeliveryHelp}
              </div>
            </div>
          </div>
          <div className="bp-card p-4 flex items-start gap-3">
            <ShieldCheck size={16} style={{ color: "var(--bp-pink)" }} className="mt-0.5 shrink-0" />
            <div>
              <div
                className="text-[13px] font-semibold tracking-tight"
                style={{ color: "var(--bp-ink)" }}
              >
                {t.productDetails.guarantee}
              </div>
              <div
                className="text-[12px] mt-0.5"
                style={{ color: "var(--bp-ink-soft)" }}
              >
                {t.productDetails.guaranteeHelp}
              </div>
            </div>
          </div>
          <div className="bp-card p-4 flex items-start gap-3">
            <Clock size={16} style={{ color: "var(--bp-pink)" }} className="mt-0.5 shrink-0" />
            <div>
              <div
                className="text-[13px] font-semibold tracking-tight"
                style={{ color: "var(--bp-ink)" }}
              >
                {t.productDetails.renewal}
              </div>
              <div
                className="text-[12px] mt-0.5"
                style={{ color: "var(--bp-ink-soft)" }}
              >
                {t.productDetails.renewalHelp}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <section
          className="mx-auto max-w-5xl px-5 sm:px-6 py-10"
          style={{ borderTop: "1px solid var(--bp-border)" }}
        >
          <h2
            className="text-[22px] sm:text-2xl font-semibold tracking-tight mb-6"
            style={{ color: "var(--bp-ink)" }}
          >
            {t.productDetails.featuresTitle}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[14px] leading-relaxed"
                style={{ color: "var(--bp-ink)" }}
              >
                <span
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: "rgba(236,72,153,0.12)",
                    color: "var(--bp-pink)",
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Pricing table */}
      <section
        className="mx-auto max-w-5xl px-5 sm:px-6 py-10 sm:py-14"
        style={{ borderTop: "1px solid var(--bp-border)" }}
      >
        <header className="mb-6 sm:mb-8">
          <h2
            className="text-[22px] sm:text-2xl font-semibold tracking-tight mb-2"
            style={{ color: "var(--bp-ink)" }}
          >
            {t.productDetails.pricingTitle}
          </h2>
          <p
            className="text-[14px] max-w-2xl"
            style={{ color: "var(--bp-ink-soft)" }}
          >
            {t.productDetails.pricingSubtitle}
          </p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {tiers.map((tier) => (
            <PricingTile
              key={tier.key}
              tier={tier}
              selected={tier.key === selectedKey}
              onSelect={setSelectedKey}
              format={format}
              durationLabel={durationMap[tier.key]}
              perMonthLabel={t.pricing.effectivePerMonth}
              recommendedLabel={t.pricing.recommended}
            />
          ))}
        </div>

        {/* Desktop CTA — primary order button below the tiers */}
        <div className="mt-8 hidden sm:flex items-center gap-4 flex-wrap">
          <a
            href={orderLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "#25D366",
            }}
          >
            <MessageCircle size={16} />
            <span>{t.pricing.orderWhatsApp}</span>
          </a>
          {selectedTier && (
            <span
              className="text-[13px] font-medium"
              style={{ color: "var(--bp-ink-soft)" }}
            >
              {durationMap[selectedTier.key]} · {format(selectedTier.price)}{" "}
              {t.pricing.total.toLowerCase()}
            </span>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section
        className="mx-auto max-w-3xl px-5 sm:px-6 py-12 sm:py-16"
        style={{ borderTop: "1px solid var(--bp-border)" }}
      >
        <h2
          className="text-[22px] sm:text-2xl font-semibold tracking-tight mb-6"
          style={{ color: "var(--bp-ink)" }}
        >
          {t.productDetails.faqTitle}
        </h2>
        <ul className="space-y-3">
          {t.productDetails.faq.map((row, i) => {
            const open = openFaq === i;
            return (
              <li
                key={i}
                className="rounded-2xl"
                style={{
                  border: "1px solid var(--bp-border)",
                  background: open ? "var(--bp-bg-soft)" : "var(--bp-bg)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-start"
                >
                  <span
                    className="text-[15px] font-semibold tracking-tight"
                    style={{ color: "var(--bp-ink)" }}
                  >
                    {row.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className="shrink-0 transition-transform duration-200"
                    style={{
                      color: FAQ_ACCENT,
                      transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                {open && (
                  <div
                    className="px-5 pb-4 pt-0 text-[14px] leading-relaxed"
                    style={{ color: "var(--bp-ink-soft)" }}
                  >
                    {row.a}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Sticky mobile CTA bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 sm:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          background: "var(--bp-glass-bg)",
          borderTop: "1px solid var(--bp-border)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
        }}
      >
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
          <div className="flex-grow min-w-0">
            <div
              className="text-[10px] font-semibold tracking-[0.08em] uppercase"
              style={{ color: "var(--bp-ink-faint)" }}
            >
              {t.productDetails.stickyFrom}
            </div>
            <div
              className="text-lg font-bold tracking-tight tabular-nums-p"
              style={{ color: "var(--bp-ink)" }}
            >
              {selectedTier ? format(selectedTier.price) : format(product.price)}
            </div>
          </div>
          <a
            href={orderLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-grow items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-semibold text-white"
            style={{ background: "#25D366" }}
          >
            <MessageCircle size={15} />
            <span>{t.productDetails.stickyOrderCta}</span>
          </a>
        </div>
      </div>
    </main>
  );
}
