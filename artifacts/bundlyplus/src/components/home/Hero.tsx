import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, MessageCircle, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";
import { getLogoUrl } from "@/utils/logoUtils";
import { getBrandGradient, getInitials } from "@/lib/brand-theme";
import type { SiteSettings } from "@/types";

interface HeroProps {
  settings?: SiteSettings | null;
}

/**
 * Hero — Apple-style rebuild (v5).
 *
 * - Light-first palette (near-white), flips to near-black in dark mode
 * - Oversized Inter Tight display headline with brand-pink accent line
 * - Two-tier CTAs: primary pink pill + outline secondary
 * - Three micro trust pills replacing the old 4-badge slab
 * - Floating brand tile cluster on the right (desktop) — transform-only
 *   animations via the existing `.float-logo` / `.float-card` keyframes
 * - Full-width marquee strip at the bottom of the hero section
 *
 * All animations respect prefers-reduced-motion through the global
 * overrides already installed in `index.css`. No backdrop-filter on
 * mobile (handled by the mobile policy block).
 */

const HERO_TILES = [
  { name: "Netflix",        size: "large",  angle: "rotate-[-6deg]", delay: "0s",   pos: "top-0 right-16" },
  { name: "ChatGPT",        size: "medium", angle: "rotate-[4deg]",  delay: "0.8s", pos: "top-24 right-0" },
  { name: "Spotify",        size: "small",  angle: "rotate-[-3deg]", delay: "1.4s", pos: "top-52 right-36" },
  { name: "Adobe",          size: "medium", angle: "rotate-[5deg]",  delay: "0.4s", pos: "bottom-12 right-10" },
  { name: "YouTube",        size: "small",  angle: "rotate-[-4deg]", delay: "1.0s", pos: "bottom-36 right-44" },
] as const;

const TILE_SIZE: Record<"small" | "medium" | "large", string> = {
  small:  "w-14 h-14",
  medium: "w-16 h-16",
  large:  "w-20 h-20",
};

function FloatingTile({
  name,
  size,
  angle,
  delay,
  pos,
}: (typeof HERO_TILES)[number]) {
  const [failed, setFailed] = useState(false);
  const url = getLogoUrl(name);
  return (
    <div
      className={`absolute ${pos} ${TILE_SIZE[size]} rounded-2xl bg-white dark:bg-white p-2.5 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.18)] dark:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.5)] ring-1 ring-black/5 dark:ring-white/5 ${angle} float-logo pointer-events-none`}
      style={{ animationDelay: delay }}
      aria-hidden="true"
    >
      {url && !failed ? (
        <img
          src={url}
          alt=""
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
          loading="eager"
          decoding="async"
        />
      ) : (
        <div
          className={`h-full w-full rounded-lg bg-gradient-to-br ${getBrandGradient(name)} flex items-center justify-center text-white font-semibold text-xs`}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}

export function Hero({ settings }: HeroProps) {
  const { t, lang } = useI18n();
  const isRTL = lang === "ar";
  const isMobile = useIsMobile();
  const a = t.hero.apple;

  const whatsappNumber = settings?.whatsapp_number || "96176171003";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <section
      className="relative w-full overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* 12-col frame */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-12 gap-y-12 gap-x-10 px-5 sm:px-6 pt-10 sm:pt-16 lg:pt-24 pb-14 lg:pb-20">
        {/* Left column — type + CTAs */}
        <div className="lg:col-span-7 lg:pr-6">
          <div
            className="bp-overline mb-5 opacity-0 animate-[fadeIn_0.6s_0.1s_ease-out_forwards]"
          >
            {a.overline}
          </div>

          <h1
            className="bp-display opacity-0 animate-[fadeIn_0.8s_0.25s_ease-out_forwards]"
            style={{ fontSize: "clamp(2.75rem, 7vw, 5.5rem)" }}
          >
            {a.headline}
            <br />
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
              {a.headlineAccent}
            </span>
          </h1>

          <p
            className="bp-lead mt-6 max-w-xl opacity-0 animate-[fadeIn_0.8s_0.45s_ease-out_forwards]"
          >
            {a.subline}
          </p>

          {/* CTAs */}
          <div
            className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 opacity-0 animate-[fadeIn_0.8s_0.6s_ease-out_forwards]"
          >
            <Link href="/products" className="bp-btn-primary w-full sm:w-auto justify-center">
              <span>{a.primaryCta}</span>
              <ArrowRight size={15} className={isRTL ? "rotate-180" : ""} />
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bp-btn-secondary w-full sm:w-auto justify-center"
            >
              <MessageCircle size={15} />
              <span>{a.secondaryCta}</span>
            </a>
          </div>

          {/* Trust pills */}
          <ul
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2 opacity-0 animate-[fadeIn_0.8s_0.75s_ease-out_forwards]"
          >
            {a.trustPills.map((pill) => (
              <li
                key={pill}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium"
                style={{ color: "var(--bp-ink-soft)" }}
              >
                <Check
                  size={13}
                  className="shrink-0"
                  style={{ color: "var(--bp-pink)" }}
                />
                <span>{pill}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column — floating tile cluster (desktop only) */}
        <div className="lg:col-span-5 relative hidden lg:block">
          <div className="relative h-[440px] w-full">
            {/* Soft pink glow behind the stack */}
            <div
              className="absolute -top-8 right-10 w-72 h-72 rounded-full blur-3xl opacity-60 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(236,72,153,0.28) 0%, rgba(236,72,153,0) 70%)",
              }}
              aria-hidden="true"
            />
            {!isMobile &&
              HERO_TILES.map((tile) => (
                <FloatingTile key={tile.name} {...tile} />
              ))}
          </div>
        </div>
      </div>

      {/* Hairline separator before the marquee */}
      <div className="bp-hairline mx-auto max-w-6xl" />
    </section>
  );
}
