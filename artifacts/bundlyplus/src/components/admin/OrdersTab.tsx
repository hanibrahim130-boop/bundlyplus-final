import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Check, Truck, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import {
  listAllOrders,
  setOrderStatus,
  deliverOrderAndCreateSubscriptions,
  type Order,
  type OrderStatus,
} from "@/lib/users-store";

const STATUS_FILTERS: Array<OrderStatus | "all"> = ["all", "pending", "confirmed", "delivered", "cancelled"];

export function OrdersTab() {
  const { toast } = useToast();
  const { t } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  async function load() {
    setLoading(true);
    try {
      setOrders(await listAllOrders());
    } catch (e) {
      toast({ title: "Failed to load orders", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  async function act(order: Order, action: "confirm" | "deliver" | "cancel") {
    setActingId(order.id);
    try {
      if (action === "deliver") {
        const ids = await deliverOrderAndCreateSubscriptions(order);
        toast({ title: t.admin.orders.subsCreated.replace("{count}", String(ids.length)) });
      } else if (action === "confirm") {
        await setOrderStatus(order.id, "confirmed");
      } else {
        await setOrderStatus(order.id, "cancelled");
      }
      await load();
    } catch (e) {
      toast({ title: "Action failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setActingId(null);
    }
  }

  const statusLabel: Record<OrderStatus, string> = {
    pending: t.account.statusPending,
    confirmed: t.account.statusConfirmed,
    delivered: t.account.statusDelivered,
    cancelled: t.account.statusCancelled,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t.admin.orders.statusFilter}
        </span>
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors ${
              filter === s
                ? "bg-pink-500 text-white shadow-md shadow-pink-500/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {s === "all" ? t.admin.orders.all : statusLabel[s as OrderStatus]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={18} />
          {t.admin.orders.loading}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-slate-400 py-12">{t.admin.orders.empty}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const date = order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "";
            return (
              <div
                key={order.id}
                className="glass-card rounded-2xl p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4"
              >
                <div className="space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <StatusPill status={order.status} label={statusLabel[order.status]} />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{date}</span>
                  </div>

                  <div className="text-sm">
                    <div className="font-semibold text-slate-700 dark:text-slate-200">
                      {order.userName || order.userEmail || order.userId.slice(0, 12)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 break-all" dir="ltr">
                      {order.userEmail}
                      {order.userPhone ? ` · ${order.userPhone}` : ""}
                    </div>
                  </div>

                  <ul className="text-sm space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between gap-2">
                        <span className="text-slate-700 dark:text-slate-200 truncate">
                          {item.quantity} × {item.name}
                          {item.duration ? (
                            <span className="text-slate-400"> ({item.duration})</span>
                          ) : null}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 tabular-nums-p whitespace-nowrap">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Total: ${order.totalPriceUsd.toFixed(2)}
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col gap-2 lg:items-stretch">
                  {order.status === "pending" && (
                    <button
                      disabled={actingId === order.id}
                      onClick={() => act(order, "confirm")}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-xs font-semibold disabled:opacity-50"
                    >
                      <Check size={14} />
                      {t.admin.orders.markConfirmed}
                    </button>
                  )}
                  {(order.status === "pending" || order.status === "confirmed") && (
                    <button
                      disabled={actingId === order.id}
                      onClick={() => act(order, "deliver")}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-semibold disabled:opacity-50"
                    >
                      {actingId === order.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Truck size={14} />
                      )}
                      {t.admin.orders.markDelivered}
                    </button>
                  )}
                  {order.status !== "cancelled" && order.status !== "delivered" && (
                    <button
                      disabled={actingId === order.id}
                      onClick={() => act(order, "cancel")}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold disabled:opacity-50"
                    >
                      <X size={14} />
                      {t.admin.orders.markCancelled}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status, label }: { status: string; label: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    confirmed: "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300",
    delivered: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    cancelled: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${map[status] || map.pending}`}>
      {label}
    </span>
  );
}
