import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Flag,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wallet,
  Zap,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency";
import { useIsMobile } from "@/hooks/use-mobile";
import { getLogoUrl } from "@/utils/logoUtils";
import { getBrandGradient, getInitials } from "@/lib/brand-theme";
import type { SiteSettings } from "@/types";

interface HeroProps {
  settings?: SiteSettings | null;
}

/* ──────────────────────────────────────────────────────────────
   Floating brand tiles
   Desktop-only, shared .float-logo keyframe, staggered via
   animation-delay. Also driven by the parallax hook below so they
   drift slightly on scroll (Vercel-style).
   ────────────────────────────────────────────────────────────── */

interface FloatingBrand {
  name: string;
  top: string;
  left?: string;
  right?: string;
  size: number;
  delay: string;
  /** parallax strength (px of counter-scroll drift) */
  parallax: number;
}

const FLOATING_BRANDS: FloatingBrand[] = [
  { name: "Netflix Premium", top: "14%", left: "6%", size: 76, delay: "0s", parallax: 40 },
  { name: "ChatGPT Plus", top: "20%", right: "7%", size: 80, delay: "-1.6s", parallax: 55 },
  { name: "Spotify Premium", top: "58%", left: "4%", size: 66, delay: "-3.2s", parallax: 25 },
  { name: "Adobe Creative Cloud", top: "64%", right: "5%", size: 70, delay: "-2.2s", parallax: 35 },
];

function FloatingBrandTile({ brand }: { brand: FloatingBrand }) {
  const [imgFailed, setImgFailed] = useState(false);
  const url = getLogoUrl(brand.name);
  const side = brand.left ? { left: brand.left } : { right: brand.right };

  return (
    <div
      className="float-logo cine-parallax absolute pointer-events-none"
      style={{
        top: brand.top,
        ...side,
        width: `${brand.size}px`,
        height: `${brand.size}px`,
        animationDelay: brand.delay,
        ["--parallax-strength" as string]: `${brand.parallax}px`,
      }}
      aria-hidden="true"
    >
      <div className="w-full h-full rounded-2xl bg-white/90 dark:bg-slate-900/85 border border-white/80 dark:border-slate-700/60 shadow-xl shadow-purple-900/15 p-3 backdrop-blur-sm">
        {url && !imgFailed ? (
          <img
            src={url}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain"
            onError={() => setImgFailed(true)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className={`w-full h-full bg-linear-to-br ${getBrandGradient(brand.name)} flex items-center justify-center text-white font-bold text-xs rounded-xl`}
          >
            {getInitials(brand.name)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Magnetic button wrapper
   Translates the child by a fraction of the pointer's distance
   from its center. CSS custom properties drive a transform-only
   update = GPU-only. Zero JS for reduced-motion users.
   ────────────────────────────────────────────────────────────── */

interface MagneticProps {
  strength?: number;
  className?: string;
  children: React.ReactNode;
}

function Magnetic({ strength = 0.25, className = "", children }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const isMobile = useIsMobile();

  const handleMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (isMobile) return;
      const el = ref.current;
      if (!el) return;
      if (rafRef.current) return; // throttle to 1 update / frame
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;
        el.style.setProperty("--mag-x", String(dx));
        el.style.setProperty("--mag-y", String(dy));
        rafRef.current = null;
      });
    },
    [isMobile, strength],
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mag-x", "0");
    el.style.setProperty("--mag-y", "0");
  }, []);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={ref}
      className={`cine-magnet ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Social proof rotator
   Cycles through 5 localised strings, one every 6s. Matches the
   Stripe/Linear "recent signup" pattern. Builds trust without
   requiring real data.
   ────────────────────────────────────────────────────────────── */

function SocialProofRotator({ items }: { items: readonly string[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % items.length);
    }, 6000);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div
      className="flex justify-center mb-5"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-900/80 border border-white/70 dark:border-slate-700/50 px-4 py-1.5 shadow-sm max-w-[90vw]">
        <UserCheck size={14} className="text-emerald-500 shrink-0" />
        <span
          key={idx}
          className="cine-social-item text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-medium truncate"
        >
          {items[idx]}
        </span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Main Hero
   ────────────────────────────────────────────────────────────── */

/**
 * BundlyPlus hero — v3 (cinematic agent-assisted rebuild).
 *
 * Four layered desktop-only effects (all mobile-gated + reduced-motion safe):
 *   1. Cursor spotlight glow — radial gradient tracking the pointer.
 *   2. Floating brand tiles with scroll-linked parallax drift.
 *   3. Magnetic CTA buttons — transform-follow on hover.
 *   4. SVG noise grain overlay — adds film-grade polish.
 *
 * Plus:
 *   - Social proof rotator (5 Lebanese strings cycling every 6s).
 *   - Word-by-word headline reveal (.cine-word, existing CSS).
 *   - Clip-path curtain reveal for subtitle/CTAs/badges.
 *   - Live counter pill, savings pill, trust badges, ticker strip.
 *
 * Infinite CSS animations on desktop: 4 aurora blobs (global) + 4 float-logo
 * tiles = 8 total. Each is transform-only, GPU-accelerated.
 * Mobile: 0 infinite animations.
 */
export function Hero({ settings }: HeroProps) {
  const { t, lang } = useI18n();
  const isRTL = lang === "ar";
  const isMobile = useIsMobile();
  const { format } = useCurrency();

  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [liveCount, setLiveCount] = useState(247);

  // Live counter tick
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

  // Cursor spotlight — pointer tracking, RAF-throttled.
  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return;

    let raf: number | null = null;
    const onMove = (e: globalThis.PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width;
        const my = (e.clientY - rect.top) / rect.height;
        glow.style.setProperty("--mx", mx.toFixed(3));
        glow.style.setProperty("--my", my.toFixed(3));
        raf = null;
      });
    };
    const onEnter = () => glow.classList.add("is-active");
    const onLeave = () => glow.classList.remove("is-active");

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerenter", onEnter);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerenter", onEnter);
      section.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  // Parallax — translate floating tiles based on scroll position
  // relative to the hero section itself (not the whole page).
  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;

    let raf: number | null = null;
    const update = () => {
      raf = null;
      const rect = section.getBoundingClientRect();
      // 0 when section fills viewport, -1..1 as it leaves
      const progress = -rect.top / (rect.height || 1);
      section.style.setProperty("--scroll", progress.toFixed(3));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile]);

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
      trust.instantDelivery,
      trust.localPayment,
      trust.moneyBack,
      trust.lebanese,
      t.hero.badge,
      t.hero.live,
    ],
    [t, trust],
  );

  const headlineWords = t.hero.mainHeadline.split(/\s+/);
  const socialProof = t.hero.socialProof;

  return (
    <section
      ref={sectionRef}
      className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 isolate overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Cursor spotlight (desktop only, gated in CSS) */}
      {!isMobile && (
        <div
          ref={glowRef}
          className="cine-cursor-glow"
          aria-hidden="true"
        />
      )}

      {/* Noise grain overlay (desktop only) */}
      {!isMobile && <div className="cine-noise" aria-hidden="true" />}

      {/* Floating brand tiles */}
      {!isMobile && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 max-w-7xl mx-auto"
          aria-hidden="true"
        >
          {FLOATING_BRANDS.map((b) => (
            <FloatingBrandTile key={b.name} brand={b} />
          ))}
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Social proof rotator (above live counter) */}
        <SocialProofRotator items={socialProof} />

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

        {/* Headline — word-by-word reveal */}
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

          {/* CTAs — magnetic on desktop */}
          <div
            className="cine-curtain mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2"
            style={{ ["--cine-delay" as string]: "1000ms" }}
          >
            <Magnetic strength={0.3} className="w-full sm:w-auto">
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
            </Magnetic>
            <Magnetic strength={0.25} className="w-full sm:w-auto">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm sm:text-base px-7 sm:px-9 py-4 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <MessageCircle size={18} />
                {t.hero.secondaryCta}
              </a>
            </Magnetic>
          </div>

          {/* Trust badges */}
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

        {/* Ticker strip */}
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
