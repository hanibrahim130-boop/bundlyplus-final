import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { useI18n } from "@/lib/i18n";
import { CATEGORY_ORDER, getCategoryTheme } from "@/lib/category-theme";
import { useCatalogCount } from "@/lib/catalog-count";

/**
 * Category rail — 10 Apple-style tiles that deep-link into the
 * products page with a category pre-selected via query param.
 *
 * Each tile is an equal-height flat card with a hairline border, its
 * category accent colour for the icon chip, and a chevron that
 * shifts on hover.
 *
 * Layout is responsive: 2 cols on mobile, 3 on tablet, 5 on desktop.
 * With 10 categories that gives two perfectly filled rows on desktop.
 */
export function CategoryRail() {
  const { t, lang } = useI18n();
  const isRTL = lang === "ar";
  const c = t.hero.categories;
  const catalog = useCatalogCount();
  const leadText = c.lead.replace("{count}", catalog.localized(lang));

  return (
    <section
      className="relative w-full"
      style={{ background: "var(--bp-bg)" }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-20 sm:py-28">
        <div className="mb-10 sm:mb-14 max-w-2xl">
          <div className="bp-overline mb-3">{c.overline}</div>
          <h2
            className="bp-display"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            {c.title}
          </h2>
          <p className="bp-lead mt-4">{leadText}</p>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORY_ORDER.map((cat) => {
            const theme = getCategoryTheme(cat);
            const Icon = theme.icon;
            return (
              <li key={cat}>
                <Link
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  className="bp-card block p-5 h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={
                    {
                      // CSS custom prop used by Tailwind's focus-ring classes
                      ["--tw-ring-color" as string]: theme.hex,
                    } as CSSProperties
                  }
                >
                  <div className="flex items-start justify-between mb-8">
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        background: `${theme.hex}14`,
                        color: theme.hex,
                      }}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <ArrowRight
                      size={15}
                      className={`transition-transform duration-300 group-hover:translate-x-0.5 ${
                        isRTL ? "rotate-180 group-hover:-translate-x-0.5" : ""
                      }`}
                      style={{ color: "var(--bp-ink-faint)" }}
                    />
                  </div>
                  <div
                    className="text-[15px] font-semibold tracking-tight mb-1"
                    style={{ color: "var(--bp-ink)" }}
                  >
                    {theme.label}
                  </div>
                  <div
                    className="text-[12px] font-medium"
                    style={{ color: "var(--bp-ink-faint)" }}
                  >
                    {theme.tagline}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
