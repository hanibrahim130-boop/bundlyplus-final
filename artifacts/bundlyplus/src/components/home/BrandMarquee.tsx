import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { getLogoUrl } from "@/utils/logoUtils";
import { getBrandGradient, getInitials } from "@/lib/brand-theme";

/**
 * Edge-to-edge brand marquee.
 *
 * Sits under the hero with a fixed-height strip of real brand logos.
 * Single-line, infinite linear drift (`.bp-marquee`), pauses on hover.
 * Logos render at 20px with greyscale; the hovered/active tile pops
 * back to full colour.
 */

const BRANDS = [
  "Netflix",
  "Spotify",
  "ChatGPT",
  "Adobe",
  "YouTube",
  "Disney+",
  "Apple Music",
  "Canva",
  "Notion",
  "Figma",
  "Perplexity",
  "Midjourney",
  "NordVPN",
  "Duolingo",
  "Grammarly",
  "Microsoft 365",
];

function BrandMark({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  const url = getLogoUrl(name);
  return (
    <div
      className="shrink-0 flex items-center gap-2.5 px-6 py-5 opacity-70 hover:opacity-100 transition-opacity duration-300"
      style={{ minWidth: "max-content" }}
    >
      <div className="h-7 w-7 shrink-0 flex items-center justify-center">
        {url && !failed ? (
          <img
            src={url}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
            onError={() => setFailed(true)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className={`h-full w-full rounded-full bg-gradient-to-br ${getBrandGradient(name)} flex items-center justify-center text-white font-semibold text-[9px]`}
          >
            {getInitials(name)}
          </div>
        )}
      </div>
      <span
        className="text-[13px] font-medium tracking-tight whitespace-nowrap"
        style={{ color: "var(--bp-ink)" }}
      >
        {name}
      </span>
    </div>
  );
}

export function BrandMarquee() {
  const { t } = useI18n();
  // Double the list so the -50% transform loops seamlessly
  const items = [...BRANDS, ...BRANDS];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        borderTop: "1px solid var(--bp-border)",
        borderBottom: "1px solid var(--bp-border)",
        background: "var(--bp-bg-soft)",
      }}
      aria-label={t.hero.tickerLabel}
    >
      {/* Edge fade masks */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10"
        style={{
          background:
            "linear-gradient(to right, var(--bp-bg-soft), transparent)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10"
        style={{
          background:
            "linear-gradient(to left, var(--bp-bg-soft), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="bp-marquee flex w-max">
        {items.map((name, i) => (
          <BrandMark key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </section>
  );
}
