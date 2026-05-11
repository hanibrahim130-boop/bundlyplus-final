import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "wouter";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "@/lib/firestore-hooks";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { Seo } from "@/components/seo/Seo";
import { CATEGORY_ORDER, getCategoryTheme } from "@/lib/category-theme";
import { ProductShopCard } from "@/components/shared/ProductShopCard";
import type { Product } from "@/types";

type AccountTypeFilter = "All" | "Private" | "Shared";
type ProductSort = "popular" | "price-asc" | "price-desc" | "name";

/**
 * Products listing — Apple-style rebuild.
 *
 * - Sticky glass filter bar (category chips + sort + type tabs)
 * - Responsive 1 / 2 / 3 / 4-col grid
 * - Category chips are tinted by the category-theme palette so the
 *   selected chip reads the same whether you're on Streaming orange
 *   or Gaming lime
 * - Reads ?category= and ?q= from the URL (set by CategoryRail links)
 */
export default function Products() {
  const [location] = useLocation();
  const { t, lang } = useI18n();
  const { siteSettings } = useSettings();
  const whatsappNumber =
    (siteSettings as { whatsapp_number?: string }).whatsapp_number ||
    "96176171003";

  // Parse URL query params on every location change
  const initialQuery = useMemo(() => {
    const q =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();
    return {
      category: q.get("category") || "All",
      search: q.get("q") || "",
    };
  }, [location]);

  const [searchQuery, setSearchQuery] = useState(initialQuery.search);
  const [selectedCategory, setSelectedCategory] = useState(initialQuery.category);
  const [selectedAccountType, setSelectedAccountType] =
    useState<AccountTypeFilter>("All");
  const [sortBy, setSortBy] = useState<ProductSort>("popular");

  useEffect(() => {
    setSelectedCategory(initialQuery.category);
    setSearchQuery(initialQuery.search);
  }, [initialQuery.category, initialQuery.search]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSearchQuery(val);
        if (val.trim().length >= 2) {
          trackEvent(ANALYTICS_EVENTS.SEARCH_PERFORMED, {
            query: val.trim(),
            language: lang,
          });
        }
      }, 350);
    },
    [lang],
  );

  const { data: products = [], isLoading } = useProducts();

  const availableCategories = useMemo(() => {
    const seen = new Set<string>();
    (products as Product[]).forEach((p) => {
      if (p.category) seen.add(p.category);
    });
    // Use the canonical CATEGORY_ORDER but filter to those present
    const ordered = CATEGORY_ORDER.filter((c) => seen.has(c));
    // Append any oddballs not in the known list
    seen.forEach((c) => {
      if (!ordered.includes(c)) ordered.push(c);
    });
    return ["All", ...ordered];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const visible = (products as Product[]).filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchesType =
        selectedAccountType === "All" || p.account_type === selectedAccountType;
      return matchesSearch && matchesCategory && matchesType;
    });
    return [...visible].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      const ap = Number(!!(a.hot || a.featured));
      const bp = Number(!!(b.hot || b.featured));
      if (ap !== bp) return bp - ap;
      return a.name.localeCompare(b.name);
    });
  }, [products, searchQuery, selectedCategory, selectedAccountType, sortBy]);

  const resultLabel =
    filteredProducts.length === 1
      ? t.products.resultSingular
      : t.products.resultPlural.replace("{count}", String(filteredProducts.length));

  return (
    <main style={{ background: "var(--bp-bg)" }}>
      <Seo
        title="All Products — Digital Subscriptions"
        description="Browse 150+ premium digital subscriptions: Netflix, Spotify, ChatGPT, Adobe & more. Best prices in Lebanon & MENA, instant WhatsApp delivery."
        canonical="/products"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Digital Subscriptions Catalog",
          description:
            "Browse 150+ premium digital subscriptions at unbeatable prices",
          url: "https://bundlyplus.com/products",
        }}
      />

      {/* Page header */}
      <header className="mx-auto max-w-6xl px-5 sm:px-6 pt-10 sm:pt-16 pb-8 sm:pb-12">
        <div className="bp-overline mb-3">{t.nav.products}</div>
        <h1
          className="bp-display"
          style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)" }}
        >
          {t.products.title}{" "}
          <span
            className="inline-block"
            style={{
              background:
                "linear-gradient(110deg, #EC4899 0%, #DB2777 50%, #BE185D 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t.products.gradientWord}
          </span>
        </h1>
        <p className="bp-lead mt-4 max-w-2xl">{t.products.subtitle}</p>
      </header>

      {/* Filter rail */}
      <div
        className="sticky top-12 z-40 border-y"
        style={{
          background: "var(--bp-glass-bg)",
          borderColor: "var(--bp-border)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
        }}
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-6 py-3.5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={16}
              className="absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--bp-ink-faint)" }}
            />
            <input
              type="text"
              placeholder={t.products.searchPlaceholder}
              defaultValue={searchQuery}
              onChange={handleSearchChange}
              className="h-10 w-full rounded-full ps-10 pe-10 text-[14px] outline-none focus:ring-2 focus:ring-pink-500/40"
              style={{
                background: "var(--bp-bg-muted)",
                color: "var(--bp-ink)",
                border: "1px solid var(--bp-border)",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  const input = document.querySelector<HTMLInputElement>(
                    'input[type="text"]',
                  );
                  if (input) input.value = "";
                }}
                className="absolute end-3 top-1/2 -translate-y-1/2"
                aria-label="Clear search"
              >
                <X size={14} style={{ color: "var(--bp-ink-faint)" }} />
              </button>
            )}
          </div>

          {/* Account type + sort + count */}
          <div className="flex items-center gap-2 flex-wrap">
            {(["All", "Private", "Shared"] as AccountTypeFilter[]).map((type) => {
              const active = selectedAccountType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedAccountType(type)}
                  className="inline-flex items-center h-9 rounded-full px-3.5 text-[12px] font-semibold transition-colors"
                  style={{
                    background: active ? "var(--bp-ink)" : "transparent",
                    color: active ? "var(--bp-bg)" : "var(--bp-ink-soft)",
                    border: "1px solid var(--bp-border)",
                  }}
                >
                  {type === "All"
                    ? t.products.allTypes
                    : type === "Private"
                      ? t.productCard.private
                      : t.productCard.shared}
                </button>
              );
            })}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ProductSort)}
              className="h-9 rounded-full px-3 text-[12px] font-semibold outline-none focus:ring-2 focus:ring-pink-500/40"
              style={{
                background: "transparent",
                color: "var(--bp-ink)",
                border: "1px solid var(--bp-border)",
              }}
              aria-label={t.products.sortProducts}
            >
              <option value="popular">{t.products.sortPopular}</option>
              <option value="price-asc">{t.products.sortPriceAsc}</option>
              <option value="price-desc">{t.products.sortPriceDesc}</option>
              <option value="name">{t.products.sortName}</option>
            </select>

            <span
              className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-semibold"
              style={{ color: "var(--bp-ink-faint)" }}
            >
              <SlidersHorizontal size={13} />
              {resultLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Category chip rail */}
      <div
        className="border-b"
        style={{
          background: "var(--bp-bg-soft)",
          borderColor: "var(--bp-border)",
        }}
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-6 py-3 overflow-x-auto">
          <ul className="flex items-center gap-2 min-w-max">
            {availableCategories.map((cat) => {
              const active = selectedCategory === cat;
              const theme = cat === "All" ? null : getCategoryTheme(cat);
              return (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className="h-9 rounded-full px-3.5 text-[13px] font-semibold transition-colors whitespace-nowrap"
                    style={{
                      background: active
                        ? theme
                          ? `${theme.hex}14`
                          : "var(--bp-ink)"
                        : "transparent",
                      color: active
                        ? theme
                          ? theme.hex
                          : "var(--bp-bg)"
                        : "var(--bp-ink-soft)",
                      border: `1px solid ${
                        active
                          ? theme
                            ? `${theme.hex}40`
                            : "var(--bp-ink)"
                          : "var(--bp-border)"
                      }`,
                    }}
                  >
                    {cat === "All" ? t.products.all : cat}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6 py-10 sm:py-16">
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
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center">
            <Search
              size={28}
              style={{ color: "var(--bp-ink-faint)" }}
              className="mx-auto mb-4"
            />
            <h2
              className="text-[17px] font-semibold tracking-tight"
              style={{ color: "var(--bp-ink)" }}
            >
              {t.products.noResults}
            </h2>
            <p
              className="mt-2 text-[14px]"
              style={{ color: "var(--bp-ink-soft)" }}
            >
              {t.products.noResultsDesc}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductShopCard
                key={product.id}
                product={product}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
