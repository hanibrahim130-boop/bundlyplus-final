import { Zap, Wallet, ShieldCheck, MessageCircle, type LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/**
 * Apple-style trust section — four flat stat cards in a single row.
 *
 * Replaces the older "Why Choose Us" block. Icons are brand-pink
 * chips, titles are 17px semibold, descriptions 14px on muted ink.
 * No hover lifts, no gradients — Apple signals trust through space
 * and precision, not decoration.
 */

const ICONS: LucideIcon[] = [Zap, Wallet, ShieldCheck, MessageCircle];

export function AppleTrust() {
  const { t } = useI18n();
  const trust = t.hero.trust;

  return (
    <section
      className="relative w-full"
      style={{ background: "var(--bp-bg-soft)" }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-20 sm:py-28">
        <div className="mb-10 sm:mb-14 max-w-2xl">
          <div className="bp-overline mb-3">{trust.overline}</div>
          <h2
            className="bp-display"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            {trust.title}
          </h2>
          <p className="bp-lead mt-4">{trust.lead}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trust.items.map((item, i) => {
            const Icon = ICONS[i] ?? Zap;
            return (
              <div
                key={item.title}
                className="bp-card p-6"
              >
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl mb-5"
                  style={{
                    background: "rgba(236,72,153,0.1)",
                    color: "var(--bp-pink)",
                  }}
                >
                  <Icon size={18} strokeWidth={2} />
                </span>
                <h3
                  className="text-[17px] font-semibold tracking-tight mb-2"
                  style={{ color: "var(--bp-ink)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: "var(--bp-ink-soft)" }}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
