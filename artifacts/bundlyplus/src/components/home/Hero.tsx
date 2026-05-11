import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
  Flag,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency";
import { getLogoUrl } from "@/utils/logoUtils";
import { getBrandGradient, getInitials } from "@/lib/brand-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { SiteSettings } from "@/types";

interface HeroProps {
  settings?: SiteSettings | null;
}

interface MarqueeItem {
  name: string;
  price: string;
  tag?: string;
}

const MARQUEE_TOP: MarqueeItem[] = [
  { name: "Netflix Premium", price: "4.99", tag: "★ Top" },
  { name: "Spotify Premium", price: "4.99" },
  { name: "ChatGPT Plus", price: "6.99", tag: "AI" },
  { name: "YouTube Premium", price: "4.99" },
  { name: "Adobe Creative Cloud", price: "9.99" },
  { name: "Disney+", price: "4.49" },
  { name: "Canva Pro", price: "4.99" },
  { name: "Apple TV+", price: "4.49" },
];

const MARQUEE_BOTTOM: MarqueeItem[] = [
  { name: "Midjourney", price: "7.99", tag: "AI" },
  { name: "Notion AI", price: "3.49" },
  { name: "Grammarly Premium", price: "4.99" },
  { name: "GitHub Copilot Pro", price: "5.99" },
  { name: "Figma Professional", price: "4.99" },
  { name: "Perplexity Pro", price: "7.99" },
  { name: "Tidal HiFi", price: "4.99" },
  { name: "Max (HBO Max)", price: "5.49" },
];

function BrandLogo({ name }: { name: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const url = getLogoUrl(name);

  if (!url || imgFailed) {
    const gradient = getBrandGradient(name);
    return (
      <div
        className={`w-full h-full bg-linear-to-br ${gradient} flex items-center justify-center text-white font-bold text-xs rounded-lg`}
      >
        {getInitials(name)}
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={name}
      className="w-full h-full object-contain"
      onError={() => setImgFailed(true)}
      loading="lazy"
    />
  );
}

function MarqueeRow({
  items,
  reverse = false,
  speed = 40,
  isRTL = false,
}: {
  items: MarqueeItem[];
  reverse?: boolean;
  speed?: number;
  isRTL?: boolean;
}) {
  const { format } = useCurrency();
  const isMobile = useIsMobile();
  const loop = [...items, ...items];
  const goLeft = isRTL ? !reverse : reverse;

  const content = loop.map((item, idx) => (
    <div
      key={`${item.name}-${idx}`}
      className={`group flex items-center gap-2.5 sm:gap-3 bg-white/90 dark:bg-slate-800/80 border border-white/60 dark:border-slate-700/60 rounded-2xl pl-2.5 pr-4 sm:pl-3 sm:pr-5 py-2.5 sm:py-3 cursor-default whitespace-nowrap shadow-sm ${
        !isMobile
          ? "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          : ""
      }`}
    >
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white p-1.5 shadow-sm shrink-0 flex items-center justify-center">
        <BrandLogo name={item.name} />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
          {item.name
            .replace(" – Private Account", "")
            .replace(" Premium", "")
            .replace(" Pro", "")
            .replace(" Professional", "")
            .replace(" Plus", "")
            .replace(" Creative Cloud", " CC")
            .replace(" (HBO Max)", "")}
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold text-pink-600 dark:text-pink-400">
          {format(parseFloat(item.price))}
          <span className="text-slate-400 dark:text-slate-500 font-medium">
            /mo
          </span>
        </span>
      </div>
      {item.tag && (
        <span className="hidden sm:inline-flex text-[9px] font-bold uppercase tracking-wider bg-linear-to-r from-pink-500 to-orange-500 text-white px-1.5 py-0.5 rounded-full">
          {item.tag}
        </span>
      )}
    </div>
  ));

  return (
    <div
      dir="ltr"
      className="relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        className="flex gap-3 sm:gap-4 w-max"
        style={{
          animation: `${goLeft ? "marquee-reverse" : "marquee"} ${speed}s linear infinite`,
        }}
      >
        {content}
      </div>
    </div>
  );
}

/**
 * Hero — Lebanon + MENA positioning.
 *
 * Copy is driven entirely by `t.hero.*`, so the EN/AR surfaces stay in lockstep.
 * The "cheapest prices in {region}" claim uses the existing rotating-word
 * animation (localised list in i18n) — this preserves the brand's motion
 * language instead of dropping a static headline into the page.
 *
 * The four trust badges are translated via `t.hero.trustBadges`. The specific
 * claims ("7-Day Money Back", "2000+ Customers", "Lebanese Service") are
 * marketing assertions — they must match the refund policy page and reality.
 * If those drift, update the i18n keys in a single place (src/lib/i18n.tsx).
 */
export function Hero({ settings }: HeroProps) {
  const { t, lang } = useI18n();
  const isRTL = lang === "ar";
  const isMobile = useIsMobile();

  const [liveCount, setLiveCount] = useState(247);

  // Tick the live counter every 6-12s for a "real" feel. Matches the
  // previous behaviour so regulars don't notice a regression.
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

  return (
    <section
      className="relative overflow-hidden pt-32 sm:pt-36 pb-12 sm:pb-20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Aurora background — CSS animations only (no Framer Motion JS overhead) */}
      {!isMobile && (
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div
            className="hero-aurora hero-aurora-1 absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full opacity-60 dark:opacity-40 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, #fbcfe8 0%, transparent 70%)",
            }}
          />
          <div
            className="hero-aurora hero-aurora-2 absolute top-[20%] right-[-15%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full opacity-60 dark:opacity-40 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, #c7d2fe 0%, transparent 70%)",
            }}
          />
          <div
            className="hero-aurora hero-aurora-3 absolute bottom-[-20%] left-[20%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full opacity-50 dark:opacity-30 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, #fde68a 0%, transparent 70%)",
            }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Live trending pill */}
        <div
          className={`flex justify-center mb-5 sm:mb-7 ${isMobile ? "animate-[fadeIn_0.4s_ease-out]" : ""}`}
        >
          <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-white/90 dark:bg-slate-800/90 border border-white/80 dark:border-slate-700/60 rounded-full pl-2 pr-3 sm:pr-4 py-1.5 shadow-sm">
            <span className="relative flex w-2 h-2 shrink-0">
              <span className="animate-ping absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex w-2 h-2 rounded-full bg-green-500"></span>
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

        {/* Main MENA-focused headline */}
        <div className="text-center max-w-5xl mx-auto">
          <h1
            className={`font-display font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight ${isMobile ? "animate-[fadeIn_0.5s_ease-out]" : ""}`}
            // clamp widens the type so the long brand-list headline stays
            // readable on large screens without ballooning on tablet.
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.25rem)" }}
          >
            {/*
              Headline is a single translated string so Arabic wrapping,
              punctuation, and the 🔥 emoji all stay in the i18n bundle and
              don't require JSX gymnastics. The brand list ("Netflix + ChatGPT
              + Adobe + IPTV") is wrapped in a gradient span for emphasis.
            */}
            <span className="text-gradient-brand">
              {t.hero.mainHeadline.split(" — ")[0] ??
                t.hero.mainHeadline.split(" ")[0]}
            </span>
            {/* Fallback path: if the split delimiter isn't present in the
                translation, render the full headline as-is. */}
            {t.hero.mainHeadline.includes(" — ") ? (
              <>
                <br />
                <span>{t.hero.mainHeadline.split(" — ").slice(1).join(" — ")}</span>
              </>
            ) : null}
          </h1>

          {/* Subtitle — bullet-separated value props */}
          <p
            className={`mt-5 sm:mt-7 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-snug max-w-3xl mx-auto px-2 font-medium ${isMobile ? "animate-[fadeIn_0.5s_ease-out_0.1s_both]" : ""}`}
          >
            {t.hero.mainSubtitle}
          </p>

          {/* Savings pill */}
          <div
            className={`mt-5 flex justify-center ${isMobile ? "animate-[fadeIn_0.5s_ease-out_0.12s_both]" : ""}`}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-pink-50 to-orange-50 dark:from-pink-500/10 dark:to-orange-500/10 border border-pink-200/60 dark:border-pink-500/20 px-4 py-1.5 text-sm font-bold text-pink-600 dark:text-pink-400">
              <Sparkles size={14} />
              {t.hero.savingsPill}
            </span>
          </div>

          {/* CTAs — primary (catalog) + secondary (WhatsApp) */}
          <div
            className={`mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2 ${isMobile ? "animate-[fadeIn_0.5s_ease-out_0.15s_both]" : ""}`}
          >
            <Link
              href="/products"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-pink-500/40 hover:bg-pink-500 dark:hover:bg-pink-500 dark:hover:text-white hover:-translate-y-0.5 transition-all duration-300"
            >
              {t.hero.primaryCta}
              <ArrowRight
                size={16}
                className={`group-hover:translate-x-1 transition-transform ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`}
              />
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-500 text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-lg shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              <MessageCircle size={18} />
              {t.hero.secondaryCta}
            </a>
          </div>

          {/* Trust badges — 4 checkmarks, wrap gracefully on mobile */}
          <ul
            className={`mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto px-2 ${isMobile ? "animate-[fadeIn_0.5s_ease-out_0.2s_both]" : ""}`}
            aria-label={t.hero.marqueeLabel}
          >
            {trustBadges.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2.5 bg-white/80 dark:bg-slate-800/70 border border-white/80 dark:border-slate-700/60 rounded-2xl px-4 py-3 shadow-sm"
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

        {/* Marquee — retained below the fold; drives variety + product cues */}
        <div
          className={`mt-12 sm:mt-16 ${isMobile ? "animate-[fadeIn_0.6s_ease-out_0.25s_both]" : ""}`}
        >
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-5">
            <span className="h-px w-8 bg-slate-300 dark:bg-slate-600" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {t.hero.marqueeLabel}
            </span>
            <span className="h-px w-8 bg-slate-300 dark:bg-slate-600" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <MarqueeRow items={MARQUEE_TOP} speed={45} isRTL={isRTL} />
            <MarqueeRow items={MARQUEE_BOTTOM} reverse speed={50} isRTL={isRTL} />
          </div>
        </div>
      </div>
    </section>
  );
}
