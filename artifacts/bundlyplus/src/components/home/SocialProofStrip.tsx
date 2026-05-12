import { Star, Users, ShieldCheck, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCatalogCount } from "@/lib/catalog-count";

/**
 * Social proof strip — thin bar of trust signals between the hero
 * marquee and the Selection shelf. Four stats in a row, each with
 * an icon + number + label. Builds instant credibility.
 */
export function SocialProofStrip() {
  const { lang } = useI18n();
  const catalog = useCatalogCount();

  const stats = lang === "ar"
    ? [
        { icon: Users, value: "+500", label: "زبون بلبنان" },
        { icon: Star, value: "4.9★", label: "تقييم واتساب" },
        { icon: ShieldCheck, value: "25", label: "يوم ضمان" },
        { icon: MapPin, value: catalog.localized(lang), label: "منتج رقمي" },
      ]
    : [
        { icon: Users, value: "500+", label: "customers in Lebanon" },
        { icon: Star, value: "4.9★", label: "WhatsApp rating" },
        { icon: ShieldCheck, value: "25-day", label: "money-back guarantee" },
        { icon: MapPin, value: catalog.display, label: "digital products" },
      ];

  return (
    <section
      className="relative w-full py-6 sm:py-8"
      style={{ background: "var(--bp-bg-muted)" }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <li
                key={stat.label}
                className="flex items-center gap-3"
              >
                <span
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: "rgba(236,72,153,0.08)",
                    color: "var(--bp-pink)",
                  }}
                >
                  <Icon size={17} strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <div
                    className="text-[18px] sm:text-[20px] font-bold tracking-tight tabular-nums-p"
                    style={{ color: "var(--bp-ink)" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-[11px] sm:text-[12px] font-medium"
                    style={{ color: "var(--bp-ink-faint)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
