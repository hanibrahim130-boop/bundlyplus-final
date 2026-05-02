import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  ExternalLink,
  ShieldCheck,
  Eye,
  ShoppingCart,
  Heart,
  Phone,
  Tag,
  Globe,
  Loader2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { ANALYTICS_EVENTS } from '@/lib/analytics';

const POSTHOG_PROJECT_URL = (import.meta.env.VITE_POSTHOG_PROJECT_URL as string) || '';
const POSTHOG_KEY = (import.meta.env.VITE_POSTHOG_KEY as string) || '';
const API_BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

const FUNNEL_EVENTS: Array<{
  event: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  { event: ANALYTICS_EVENTS.PRODUCT_VIEWED, label: 'Product viewed', icon: Eye },
  { event: ANALYTICS_EVENTS.BUNDLE_VIEWED, label: 'Bundle viewed', icon: Eye },
  { event: ANALYTICS_EVENTS.ADD_TO_CART, label: 'Added to cart', icon: ShoppingCart },
  { event: ANALYTICS_EVENTS.CART_VIEWED, label: 'Cart viewed', icon: ShoppingCart },
  {
    event: ANALYTICS_EVENTS.WHATSAPP_CHECKOUT_CLICKED,
    label: 'WhatsApp checkout clicked',
    icon: Phone,
  },
  { event: ANALYTICS_EVENTS.WISHLIST_ADDED, label: 'Wishlist added', icon: Heart },
  { event: ANALYTICS_EVENTS.DISCOUNT_POPUP_SHOWN, label: 'Discount popup shown', icon: Tag },
  {
    event: ANALYTICS_EVENTS.DISCOUNT_POPUP_DISMISSED,
    label: 'Discount popup dismissed',
    icon: Tag,
  },
  {
    event: ANALYTICS_EVENTS.DISCOUNT_POPUP_CTA_CLICKED,
    label: 'Discount popup CTA clicked',
    icon: Tag,
  },
  { event: ANALYTICS_EVENTS.CURRENCY_TOGGLED, label: 'Currency toggled', icon: Globe },
  { event: ANALYTICS_EVENTS.LANGUAGE_TOGGLED, label: 'Language toggled', icon: Globe },
];

interface KpiResponse {
  configured: boolean;
  windowDays: number;
  counts: Record<string, number>;
  conversion: {
    productViewToAddToCart: number | null;
    addToCartToWhatsApp: number | null;
    productViewToWhatsApp: number | null;
  };
  fetchedAt: string;
  error?: string;
}

function fmtCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return n.toLocaleString();
}

function fmtPct(n: number | null): string {
  return n == null ? '—' : `${n.toFixed(1)}%`;
}

export function AnalyticsTab() {
  const isClientConfigured = Boolean(POSTHOG_KEY);
  const hasDashboard = Boolean(POSTHOG_PROJECT_URL);
  const [kpis, setKpis] = useState<KpiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    fetch(`${API_BASE}/api/analytics/kpis?days=7`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return (await r.json()) as KpiResponse;
      })
      .then((data) => {
        if (!cancelled) setKpis(data);
      })
      .catch((err) => {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : 'Fetch failed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const serverConfigured = kpis?.configured ?? false;

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white shrink-0">
              <BarChart3 size={20} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">
                Analytics
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Funnel and engagement events stream to PostHog. Live numbers below cover the last 7 days.
              </p>
            </div>
          </div>
          {hasDashboard ? (
            <a
              href={POSTHOG_PROJECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm hover:bg-pink-500 hover:text-white transition-colors self-start"
            >
              Open dashboard <ExternalLink size={14} />
            </a>
          ) : null}
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          <div
            className={`rounded-2xl border p-4 ${
              isClientConfigured
                ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-800/60 dark:bg-emerald-950/30'
                : 'border-amber-200 bg-amber-50/60 dark:border-amber-800/60 dark:bg-amber-950/30'
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Browser capture
            </div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {isClientConfigured
                ? 'Connected — events are being captured.'
                : 'Not configured — set VITE_POSTHOG_KEY to start collecting data.'}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-white/60 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              <ShieldCheck size={14} /> Privacy
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300">
              IP addresses are anonymized. Session recording is disabled.
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp size={18} /> Last 7 days
          </h3>
          {kpis ? (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              fetched {new Date(kpis.fetchedAt).toLocaleTimeString()}
            </span>
          ) : null}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Live counts from PostHog via the API server.
        </p>

        {loading ? (
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Loader2 className="animate-spin" size={16} /> Loading…
          </div>
        ) : fetchError ? (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/30 p-4 text-sm text-rose-700 dark:text-rose-200">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold">Could not load KPIs</div>
              <div className="text-xs opacity-80 mt-1">{fetchError}</div>
            </div>
          </div>
        ) : !serverConfigured ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 dark:border-amber-800/60 dark:bg-amber-950/30 p-4 text-sm text-amber-800 dark:text-amber-200">
            <div className="font-semibold mb-1">Server-side KPIs not configured</div>
            <div className="text-xs opacity-90">
              Set <code>POSTHOG_PERSONAL_API_KEY</code>, <code>POSTHOG_PROJECT_ID</code>, and (optionally)
              <code> POSTHOG_HOST</code> on the API server to enable live numbers here.
            </div>
          </div>
        ) : (
          <>
            {kpis?.error ? (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/60 dark:border-amber-800/60 dark:bg-amber-950/30 p-3 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
                <AlertCircle size={14} /> {kpis.error}
              </div>
            ) : null}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <KpiTile label="Product views" value={kpis?.counts.product_viewed ?? 0} icon={Eye} />
              <KpiTile
                label="Added to cart"
                value={kpis?.counts.add_to_cart ?? 0}
                icon={ShoppingCart}
              />
              <KpiTile
                label="WhatsApp clicks"
                value={kpis?.counts.whatsapp_checkout_clicked ?? 0}
                icon={Phone}
              />
              <KpiTile label="Wishlist adds" value={kpis?.counts.wishlist_added ?? 0} icon={Heart} />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <ConversionTile
                label="View → Cart"
                value={fmtPct(kpis?.conversion.productViewToAddToCart ?? null)}
              />
              <ConversionTile
                label="Cart → WhatsApp"
                value={fmtPct(kpis?.conversion.addToCartToWhatsApp ?? null)}
              />
              <ConversionTile
                label="View → WhatsApp"
                value={fmtPct(kpis?.conversion.productViewToWhatsApp ?? null)}
              />
            </div>
          </>
        )}
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 mb-1">
          Tracked events
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          These event names are stable — build PostHog funnels and insights against them.
        </p>
        <ul className="grid sm:grid-cols-2 gap-2">
          {FUNNEL_EVENTS.map(({ event, label, icon: Icon }) => (
            <li
              key={event}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700/60"
            >
              <Icon size={16} className="text-pink-500 shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</div>
                <code className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{event}</code>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          UTM params (<code>utm_source</code>, <code>utm_medium</code>, <code>utm_campaign</code>,
          <code> utm_term</code>, <code>utm_content</code>, <code>gclid</code>, <code>fbclid</code>) are
          captured as super-properties on the user's first visit and attached to every subsequent event.
          Signed-in users are identified by their Clerk user id.
        </div>
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
        <Icon size={14} /> {label}
      </div>
      <div className="text-2xl font-display font-bold text-slate-900 dark:text-white">
        {fmtCount(value)}
      </div>
    </div>
  );
}

function ConversionTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-pink-200/80 dark:border-pink-900/60 bg-pink-50/60 dark:bg-pink-950/30 p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-pink-700 dark:text-pink-300 mb-2">
        {label}
      </div>
      <div className="text-2xl font-display font-bold text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}

export default AnalyticsTab;
