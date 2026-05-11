import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
  Repeat,
  Clock,
  TrendingUp,
  TrendingDown,
  Package,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  CircleDashed,
  XCircle,
  Truck,
} from "lucide-react";
import {
  listAllOrders,
  listAllSubscriptions,
  listAllUsers,
  type Order,
  type Subscription,
  type UserDoc,
} from "@/lib/users-store";
import { useToast } from "@/hooks/use-toast";

const WINDOW_DAYS = 30;
const MS_DAY = 24 * 60 * 60 * 1000;

interface SnapshotState {
  orders: Order[];
  subs: Subscription[];
  users: UserDoc[];
}

interface Totals {
  allTime: number;
  window: number;
  previousWindow: number;
}

interface TopProduct {
  productId: string;
  name: string;
  units: number;
  revenue: number;
}

function fmtUsd(n: number): string {
  if (n >= 10_000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n.toFixed(2)}`;
}

function fmtCount(n: number): string {
  return n.toLocaleString();
}

function pctChange(current: number, previous: number): { pct: number; dir: "up" | "down" | "flat" } {
  if (previous === 0) return { pct: current > 0 ? 100 : 0, dir: current > 0 ? "up" : "flat" };
  const delta = ((current - previous) / previous) * 100;
  if (Math.abs(delta) < 0.1) return { pct: 0, dir: "flat" };
  return { pct: Math.round(Math.abs(delta)), dir: delta > 0 ? "up" : "down" };
}

export function AnalyticsTab() {
  const { toast } = useToast();
  const [state, setState] = useState<SnapshotState | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const [orders, subs, users] = await Promise.all([
        listAllOrders(),
        listAllSubscriptions(),
        listAllUsers(),
      ]);
      setState({ orders, subs, users });
      setFetchedAt(Date.now());
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load analytics";
      setErr(msg);
      toast({ title: "Analytics fetch failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const metrics = useMemo(() => {
    if (!state) return null;
    const { orders, subs, users } = state;
    const now = Date.now();
    const windowStart = now - WINDOW_DAYS * MS_DAY;
    const prevStart = windowStart - WINDOW_DAYS * MS_DAY;

    // Orders bucketed
    const windowOrders = orders.filter((o) => o.createdAt >= windowStart);
    const prevOrders = orders.filter(
      (o) => o.createdAt >= prevStart && o.createdAt < windowStart,
    );

    // Revenue is delivered orders only
    const deliveredAll = orders.filter((o) => o.status === "delivered");
    const deliveredWindow = windowOrders.filter((o) => o.status === "delivered");
    const deliveredPrev = prevOrders.filter((o) => o.status === "delivered");

    const revenue: Totals = {
      allTime: deliveredAll.reduce((s, o) => s + (o.totalPriceUsd || 0), 0),
      window: deliveredWindow.reduce((s, o) => s + (o.totalPriceUsd || 0), 0),
      previousWindow: deliveredPrev.reduce((s, o) => s + (o.totalPriceUsd || 0), 0),
    };

    const orderCount: Totals = {
      allTime: orders.length,
      window: windowOrders.length,
      previousWindow: prevOrders.length,
    };

    // Conversion pipeline
    const pipeline = {
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
    const conversionRate =
      orderCount.allTime > 0
        ? (pipeline.delivered / orderCount.allTime) * 100
        : 0;

    // AOV (average order value) — delivered
    const aov =
      deliveredAll.length > 0 ? revenue.allTime / deliveredAll.length : 0;

    // Customers
    const windowUsers = users.filter((u) => (u.createdAt || 0) >= windowStart);
    const prevUsers = users.filter(
      (u) => (u.createdAt || 0) >= prevStart && (u.createdAt || 0) < windowStart,
    );
    const customerCount: Totals = {
      allTime: users.length,
      window: windowUsers.length,
      previousWindow: prevUsers.length,
    };

    // Returning customers = users with 2+ orders
    const ordersByUser = new Map<string, number>();
    for (const o of orders) {
      ordersByUser.set(o.userId, (ordersByUser.get(o.userId) || 0) + 1);
    }
    const returningCustomers = Array.from(ordersByUser.values()).filter(
      (c) => c >= 2,
    ).length;
    const repeatRate =
      customerCount.allTime > 0
        ? (returningCustomers / customerCount.allTime) * 100
        : 0;

    // Subscriptions
    const activeSubs = subs.filter((s) => s.status === "active").length;
    const expiringSoon = subs.filter((s) => {
      if (s.status !== "active") return false;
      const daysLeft = Math.ceil((s.expiryDate - now) / MS_DAY);
      return daysLeft >= 0 && daysLeft <= 7;
    }).length;

    // Top products — aggregate from delivered orders
    const productAgg = new Map<string, { name: string; units: number; revenue: number }>();
    for (const o of deliveredAll) {
      for (const item of o.items) {
        const key = item.productId || item.name;
        const existing = productAgg.get(key) || {
          name: item.name,
          units: 0,
          revenue: 0,
        };
        existing.units += item.quantity;
        existing.revenue += item.price * item.quantity;
        productAgg.set(key, existing);
      }
    }
    const topProducts: TopProduct[] = Array.from(productAgg.entries())
      .map(([productId, v]) => ({ productId, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Daily orders chart — last 14 days
    const dailyChart: { date: string; orders: number; revenue: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const dayStart = now - i * MS_DAY;
      const d0 = new Date(dayStart);
      d0.setHours(0, 0, 0, 0);
      const d1 = d0.getTime() + MS_DAY;
      const dayOrders = orders.filter(
        (o) => o.createdAt >= d0.getTime() && o.createdAt < d1,
      );
      const dayRevenue = dayOrders
        .filter((o) => o.status === "delivered")
        .reduce((s, o) => s + o.totalPriceUsd, 0);
      dailyChart.push({
        date: d0.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        orders: dayOrders.length,
        revenue: dayRevenue,
      });
    }

    return {
      revenue,
      orderCount,
      aov,
      conversionRate,
      pipeline,
      customerCount,
      repeatRate,
      returningCustomers,
      activeSubs,
      expiringSoon,
      topProducts,
      dailyChart,
    };
  }, [state]);

  if (loading && !state) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="animate-spin mr-2" size={20} />
        Loading analytics…
      </div>
    );
  }

  if (err && !state) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/30 p-6 text-sm text-rose-700 dark:text-rose-200">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold">Could not load analytics</div>
            <div className="text-xs opacity-80 mt-1">{err}</div>
            <button
              onClick={load}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-100 text-xs font-semibold"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const revenueChange = pctChange(metrics.revenue.window, metrics.revenue.previousWindow);
  const orderChange = pctChange(metrics.orderCount.window, metrics.orderCount.previousWindow);
  const customerChange = pctChange(
    metrics.customerCount.window,
    metrics.customerCount.previousWindow,
  );

  const maxChartValue = Math.max(
    1,
    ...metrics.dailyChart.map((d) => Math.max(d.orders, d.revenue / 10)),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white">
            <BarChart3 size={18} />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">
              Store Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live numbers from Firestore — last {WINDOW_DAYS} days.
              {fetchedAt ? ` Refreshed ${new Date(fetchedAt).toLocaleTimeString()}` : ""}
            </p>
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:border-pink-300 hover:text-pink-600 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            <RefreshCw size={14} />
          )}
          Refresh
        </button>
      </div>

      {/* Primary KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Revenue (30d)"
          value={fmtUsd(metrics.revenue.window)}
          sub={`${fmtUsd(metrics.revenue.allTime)} all time`}
          icon={DollarSign}
          change={revenueChange}
          tone="pink"
        />
        <KpiCard
          label="Orders (30d)"
          value={fmtCount(metrics.orderCount.window)}
          sub={`${fmtCount(metrics.orderCount.allTime)} all time`}
          icon={ShoppingCart}
          change={orderChange}
          tone="violet"
        />
        <KpiCard
          label="Avg order value"
          value={fmtUsd(metrics.aov)}
          sub={`${metrics.conversionRate.toFixed(1)}% delivered`}
          icon={Package}
          tone="emerald"
        />
        <KpiCard
          label="Customers (30d)"
          value={fmtCount(metrics.customerCount.window)}
          sub={`${fmtCount(metrics.customerCount.allTime)} all time`}
          icon={Users}
          change={customerChange}
          tone="orange"
        />
      </div>

      {/* Pipeline / Order status */}
      <div className="bp-card p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
          Order pipeline
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <PipelineTile
            label="Pending"
            value={metrics.pipeline.pending}
            icon={CircleDashed}
            tone="amber"
          />
          <PipelineTile
            label="Confirmed"
            value={metrics.pipeline.confirmed}
            icon={CheckCircle2}
            tone="sky"
          />
          <PipelineTile
            label="Delivered"
            value={metrics.pipeline.delivered}
            icon={Truck}
            tone="emerald"
          />
          <PipelineTile
            label="Cancelled"
            value={metrics.pipeline.cancelled}
            icon={XCircle}
            tone="rose"
          />
        </div>
      </div>

      {/* Daily chart + subs health + repeat rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bp-card p-5 sm:p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Last 14 days — orders &amp; revenue
            </h3>
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider">
              <span className="inline-flex items-center gap-1.5 text-pink-600">
                <span className="w-2 h-2 rounded-sm bg-pink-500" /> Orders
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <span className="w-2 h-2 rounded-sm bg-slate-400" /> Revenue / $10
              </span>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-40">
            {metrics.dailyChart.map((d) => {
              const orderBar = (d.orders / maxChartValue) * 100;
              const revenueBar = (d.revenue / 10 / maxChartValue) * 100;
              return (
                <div
                  key={d.date}
                  className="flex-1 flex flex-col items-center gap-1 group"
                >
                  <div className="relative w-full flex items-end h-full gap-0.5">
                    <div
                      className="flex-1 bg-pink-500/80 rounded-t-sm transition-all group-hover:bg-pink-600"
                      style={{ height: `${Math.max(2, orderBar)}%` }}
                      title={`${d.orders} orders`}
                    />
                    <div
                      className="flex-1 bg-slate-400/60 dark:bg-slate-500/70 rounded-t-sm transition-all group-hover:bg-slate-500"
                      style={{ height: `${Math.max(2, revenueBar)}%` }}
                      title={`${fmtUsd(d.revenue)}`}
                    />
                  </div>
                  <div className="text-[9px] text-slate-400 font-medium -rotate-45 translate-y-1 origin-top-left whitespace-nowrap">
                    {d.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bp-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              <Clock size={13} /> Subscriptions
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {fmtCount(metrics.activeSubs)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">active</div>
            {metrics.expiringSoon > 0 && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                <AlertCircle size={11} />
                {metrics.expiringSoon} expiring in 7d
              </div>
            )}
          </div>

          <div className="bp-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              <Repeat size={13} /> Repeat rate
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {metrics.repeatRate.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {metrics.returningCustomers} customers with 2+ orders
            </div>
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="bp-card p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Top products by revenue (all time)
        </h3>
        {metrics.topProducts.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">
            No delivered orders yet. Top sellers will appear here once orders start landing.
          </p>
        ) : (
          <ul className="space-y-2">
            {metrics.topProducts.map((p, i) => {
              const max = metrics.topProducts[0].revenue || 1;
              const width = (p.revenue / max) * 100;
              return (
                <li
                  key={p.productId}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="w-6 text-xs font-bold text-slate-400 tabular-nums-p">
                    #{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2 mb-1">
                      <span className="truncate font-semibold text-slate-700 dark:text-slate-200">
                        {p.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
                        {fmtCount(p.units)} units · {fmtUsd(p.revenue)}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-pink-500 to-orange-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Small presentational components
// ─────────────────────────────────────────────────────────────

type Tone = "pink" | "violet" | "emerald" | "orange" | "amber" | "sky" | "rose";

const toneClasses: Record<Tone, { bg: string; text: string }> = {
  pink: { bg: "bg-pink-50 dark:bg-pink-500/10", text: "text-pink-600 dark:text-pink-400" },
  violet: { bg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  orange: { bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-600 dark:text-orange-400" },
  amber: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  sky: { bg: "bg-sky-50 dark:bg-sky-500/10", text: "text-sky-600 dark:text-sky-400" },
  rose: { bg: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
};

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  change,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  change?: { pct: number; dir: "up" | "down" | "flat" };
  tone: Tone;
}) {
  const cls = toneClasses[tone];
  return (
    <div className="bp-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${cls.bg} ${cls.text}`}>
          <Icon size={16} />
        </span>
        {change && change.dir !== "flat" && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-bold tabular-nums-p ${
              change.dir === "up"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {change.dir === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {change.pct}%
          </span>
        )}
      </div>
      <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </div>
      <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums-p">
        {value}
      </div>
      {sub && (
        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{sub}</div>
      )}
    </div>
  );
}

function PipelineTile({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tone: Tone;
}) {
  const cls = toneClasses[tone];
  return (
    <div className={`rounded-xl px-3 py-3 flex items-center gap-3 ${cls.bg}`}>
      <Icon size={16} className={cls.text} />
      <div className="min-w-0">
        <div className={`text-[10px] font-bold uppercase tracking-wider ${cls.text}`}>
          {label}
        </div>
        <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums-p">
          {fmtCount(value)}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsTab;
