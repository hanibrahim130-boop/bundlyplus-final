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
import type { SiteSettings } from "@/types";

interface HeroProps {
  settings?: SiteSettings | null;
}

/**
 * Hero — Lebanon + MENA positioning.
 *
 * Heavy background effects (aurora blobs, drifting color fields) now
 * live in `components/layout/Background.tsx` and render once at the
 * app-shell level, so every route inherits the cinematic mood without
 * paying for per-page GPU work. The Hero is deliberately light here:
 * only one-shot entrance animations on mount — no infinite loops,
 * no blur filters, no blend-mode sweeps.
 *
 * Motion budget:
 *  - Headline: word-by-word reveal (60ms staggered delay, one-shot).
 *  - Subtitle / pill / CTAs / trust badges: clip-path curtain on mount.
 *  - Ticker strip: 45s linear translate, desktop-only, transform-only.
 * All three auto-freeze under `prefers-reduced-motion: reduce` via the
 * class-level media query in `index.css`.
 */
export function Hero({ settings }: HeroProps) {
  const { t, lang } = useI18n();
  const isRTL = lang === "ar";
  const { format } = useCurrency();

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

  const tickerItems = useMemo(
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

  // Split the headline into words for the staggered reveal. Translation
  // owns emoji + punctuation, so .split(/\s+/) is permissive for both
  // EN and AR without special-casing.
  const headlineWords = t.hero.mainHeadline.split(/\s+/);

  return (
    <section
      className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 isolate"
      dir={isRTL ? "rtl" : "ltr"}
    >
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

        {/* Headline with word-by-word lighting */}
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

          {/* Subtitle */}
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

        {/* Ticker strip at the hero bottom */}
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

      <p className="sr-only">
        {t.hero.from} {format(4.99)}
      </p>
    </section>
  );
}
