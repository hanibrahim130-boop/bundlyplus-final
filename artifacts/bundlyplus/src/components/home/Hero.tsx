import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Flag,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency";
import { getLogoUrl } from "@/utils/logoUtils";
import { getBrandGradient, getInitials } from "@/lib/brand-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SiteSettings } from "@/types";

interface HeroProps {
  settings?: SiteSettings | null;
}

/* ──────────────────────────────────────────────────────────────
   Data — kept compact because the design leans on motion, not
   on cramming the brand list into the hero. The marquee strip
   below still advertises the full catalog.
   ────────────────────────────────────────────────────────────── */

interface BrandOrbit {
  name: string;
  /** Screen position. Values are % of the hero container box. */
  top: string;
  /** Use `left` OR `right`; the other is auto. Tailwind inset not
   *  used because we need fractional positions per viewport. */
  left?: string;
  right?: string;
  /** Depth-2 floating logos are three orbit variations. */
  orbit: 1 | 2 | 3;
  /** Extra scale — the hero logos vary 0.7 – 1.15 by importance. */
  scale?: number;
  /** Hide on md- to keep mobile calm (per epic-design mobile rules). */
  desktopOnly?: boolean;
}

const ORBITING_BRANDS: BrandOrbit[] = [
  { name: "Netflix Premium", top: "12%", left: "6%", orbit: 1, scale: 1.05 },
  { name: "ChatGPT Plus", top: "18%", right: "6%", orbit: 2, scale: 1.05 },
  { name: "Spotify Premium", top: "44%", left: "2%", orbit: 3, scale: 0.95, desktopOnly: true },
  { name: "Adobe Creative Cloud", top: "48%", right: "3%", orbit: 1, scale: 0.95, desktopOnly: true },
  { name: "Disney+", top: "72%", left: "10%", orbit: 2, scale: 0.85, desktopOnly: true },
  { name: "YouTube Premium", top: "75%", right: "10%", orbit: 3, scale: 0.85, desktopOnly: true },
];

/** Ticker — short tagline loop, purely decorative depth-5 strip. */
function useTickerItems(): string[] {
  const { t } = useI18n();
  return useMemo(
    () => [
      t.hero.trustBadges.instantDelivery,
      t.hero.trustBadges.localPayment,
      t.hero.trustBadges.moneyBack,
      t.hero.trustBadges.lebanese,
      t.hero.badge,
      t.hero.live,
    ],
    [t],
  );
}

function BrandLogo({ name }: { name: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const url = getLogoUrl(name);

  if (!url || imgFailed) {
    const gradient = getBrandGradient(name);
    return (
      <div
        className={`w-full h-full bg-linear-to-br ${gradient} flex items-center justify-center text-white font-bold text-xs rounded-xl`}
      >
        {getInitials(name)}
      </div>
    );
  }
  return (
    <img
      src={url}
      alt=""
      aria-hidden="true"
      className="w-full h-full object-contain drop-shadow-md"
      onError={() => setImgFailed(true)}
      loading="lazy"
      decoding="async"
    />
  );
}

/**
 * Orbiting brand "constellation" — depth-2 assets that float in a
 * slow loop behind the headline. On reduced-motion they freeze; on
 * mobile they're hidden entirely per the epic-design mobile policy.
 */
function BrandConstellation({ isMobile }: { isMobile: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10"
      aria-hidden="true"
    >
      {ORBITING_BRANDS.map((b) => {
        if (isMobile && b.desktopOnly) return null;
        const side = b.left ? { left: b.left } : { right: b.right };
        const scale = b.scale ?? 1;
        return (
          <div
            key={b.name}
            className={`absolute cine-orbit-${b.orbit}`}
            style={{
              top: b.top,
              ...side,
              width: `${Math.round(84 * scale)}px`,
              height: `${Math.round(84 * scale)}px`,
            }}
          >
            <div className="w-full h-full rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-white/80 dark:border-slate-700/60 shadow-2xl shadow-purple-900/20 p-3 backdrop-blur-sm">
              <BrandLogo name={b.name} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Hero — epic-design build.
 *
 * Depth layers (reading top-down of the JSX):
 *   depth-0  Dotted grid texture, gated to desktop
 *   depth-1  Aurora blobs (existing)
 *   depth-2  Orbiting brand constellation (new)
 *   depth-4  Headline, subtitle, CTAs, trust badges (DOM flow)
 *   depth-5  Spotlight sweep + ticker (decorative overlays)
 *
 * Motion budget:
 *  - Headline runs one-shot word-by-word lighting on mount.
 *  - Constellation runs infinite slow orbit (11–15s cycles).
 *  - Spotlight sweep runs 9s infinite, mobile-disabled.
 *  - Every effect has a `prefers-reduced-motion` kill switch in
 *    index.css.
 */
export function Hero({ settings }: HeroProps) {
  const { t, lang } = useI18n();
  const isRTL = lang === "ar";
  const isMobile = useIsMobile();
  const { format } = useCurrency();
  const tickerItems = useTickerItems();

  const [liveCount, setLiveCount] = useState(247);

  useEffect(() => {
    let alive = true;
    const tick = () => {
      if (!alive) return;
      setLiveCount((c) => c + Math.floor(Math.random() * 2) + 1);
      setTimeout(tick, 6000 + Math.random() * 6000);
    };
    const id = setTimeout(tick, 4000);
    return () => {
      alive = false;
      clearTimeout(id);
    };
  }, []);

  const whatsappNumber = settings?.whatsapp_number || "96176171003";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const trust = t.hero.trustBadges;
  const trustBadges: Array<{ icon: typeof Zap; label: string }> = [
    { icon: Zap, label: trust.instantDelivery },
    { icon: Wallet, label: trust.localPayment },
    { icon: ShieldCheck, label: trust.moneyBack },
    { icon: Flag, label: trust.lebanese },
  ];

  // Split the headline into words for the staggered reveal. The
  // translation owns emoji + punctuation, so we keep .split(/\s+/)
  // permissive — zero special-casing needed for the Arabic side.
  const headlineWords = t.hero.mainHeadline.split(/\s+/);

  return (
    <section
      className="relative overflow-hidden pt-32 sm:pt-40 pb-16 sm:pb-24 isolate"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Depth-0: dotted grid texture (desktop only) */}
      {!isMobile && <div className="cine-grid" aria-hidden="true" />}

      {/* Depth-1: aurora blobs — kept from the previous hero */}
      {!isMobile && (
        <div
          className="pointer-events-none absolute inset-0 -z-20"
          aria-hidden="true"
        >
          <div
            className="hero-aurora hero-aurora-1 absolute top-[-18%] left-[-10%] w-[52vw] h-[52vw] max-w-[640px] max-h-[640px] rounded-full opacity-70 dark:opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, #fbcfe8 0%, transparent 70%)",
            }}
          />
          <div
            className="hero-aurora hero-aurora-2 absolute top-[22%] right-[-15%] w-[46vw] h-[46vw] max-w-[560px] max-h-[560px] rounded-full opacity-70 dark:opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, #c7d2fe 0%, transparent 70%)",
            }}
          />
          <div
            className="hero-aurora hero-aurora-3 absolute bottom-[-20%] left-[25%] w-[56vw] h-[56vw] max-w-[680px] max-h-[680px] rounded-full opacity-60 dark:opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, #fde68a 0%, transparent 70%)",
            }}
          />
        </div>
      )}

      {/* Depth-2: orbiting brand constellation */}
      <BrandConstellation isMobile={isMobile} />

      {/* Depth-5: spotlight sweep — single pass every 9s */}
      {!isMobile && <div className="cine-spotlight" aria-hidden="true" />}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Live counter pill */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-white/90 dark:bg-slate-900/90 border border-white/80 dark:border-slate-700/60 rounded-full pl-2 pr-3 sm:pr-4 py-1.5 shadow-lg shadow-purple-900/10">
            <span className="relative flex w-2 h-2 shrink-0">
              <span className="animate-ping absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {liveCount.toLocaleString()}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium">
              {t.hero.live}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 ms-1 text-[10px] font-bold uppercase tracking-wider bg-linear-to-r from-pink-500 to-orange-500 text-white px-2 py-0.5 rounded-full">
              <Sparkles size={10} strokeWidth={2.5} />
              {t.hero.badge}
            </span>
          </div>
        </div>

        {/* Depth-4: headline with word-by-word lighting */}
        <div className="text-center max-w-5xl mx-auto">
          <h1
            className="font-display font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.25rem)" }}
          >
            {headlineWords.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className={`cine-word ${
                  /netflix|chatgpt|adobe|iptv|نتفلكس|lebanon|mena|لبنان|الشرق/i.test(
                    word,
                  )
                    ? "text-gradient-brand"
                    : ""
                }`}
                style={{ ["--i" as string]: i }}
              >
                {word}
                {i < headlineWords.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </h1>

          {/* Subtitle — rises via clip-path curtain after the headline */}
          <p
            className="cine-curtain mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-snug max-w-3xl mx-auto px-2 font-medium"
            style={{ ["--cine-delay" as string]: "700ms" }}
          >
            {t.hero.mainSubtitle}
          </p>

          {/* Savings pill */}
          <div
            className="cine-curtain mt-5 flex justify-center"
            style={{ ["--cine-delay" as string]: "900ms" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-pink-50 to-orange-50 dark:from-pink-500/10 dark:to-orange-500/10 border border-pink-200/60 dark:border-pink-500/20 px-4 py-1.5 text-sm font-bold text-pink-600 dark:text-pink-400">
              <Sparkles size={14} />
              {t.hero.savingsPill}
            </span>
          </div>

          {/* CTAs */}
          <div
            className="cine-curtain mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2"
            style={{ ["--cine-delay" as string]: "1000ms" }}
          >
            <Link
              href="/products"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm sm:text-base px-7 sm:px-9 py-4 rounded-full shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-pink-500/40 hover:bg-pink-500 dark:hover:bg-pink-500 dark:hover:text-white hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              {/* Sheen pass on hover — pure CSS, no JS */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 pointer-events-none" />
              <span className="relative">{t.hero.primaryCta}</span>
              <ArrowRight
                size={16}
                className={`relative group-hover:translate-x-1 transition-transform ${
                  isRTL ? "rotate-180 group-hover:-translate-x-1" : ""
                }`}
              />
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm sm:text-base px-7 sm:px-9 py-4 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              <MessageCircle size={18} />
              {t.hero.secondaryCta}
            </a>
          </div>

          {/* Trust badges — 4-tile grid */}
          <ul
            className="cine-curtain mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto px-2"
            style={{ ["--cine-delay" as string]: "1150ms" }}
            aria-label={t.hero.marqueeLabel}
          >
            {trustBadges.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2.5 bg-white/80 dark:bg-slate-900/70 border border-white/80 dark:border-slate-700/60 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="flex w-8 h-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Icon size={16} strokeWidth={2.5} />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Depth-5: ticker strip — product names + prices scroll
            forever at the hero bottom, bridging into the marquee
            section below without feeling duplicated. */}
        <div
          className="cine-curtain mt-14 sm:mt-20 relative overflow-hidden border-y border-slate-200/70 dark:border-slate-700/50 py-3"
          style={{ ["--cine-delay" as string]: "1300ms" }}
          aria-hidden="true"
        >
          <div
            dir="ltr"
            className="relative"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            }}
          >
            <div className="cine-ticker flex gap-10 w-max whitespace-nowrap">
              {[...tickerItems, ...tickerItems, ...tickerItems].map(
                (item, i) => (
                  <span
                    key={`${item}-${i}`}
                    className="inline-flex items-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400"
                  >
                    {item}
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-400" />
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden currency-aware microcopy for SEO / assistive tech.
          `format` already pulls from useCurrency so the string adapts
          to USD/LBP toggle. Kept off-screen but in the DOM to preserve
          the value proposition for screen readers when the hero
          graphics load for sighted users. */}
      <p className="sr-only">
        {t.hero.from} {format(4.99)}
      </p>
    </section>
  );
}
