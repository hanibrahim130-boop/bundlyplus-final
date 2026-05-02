import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/react";
import { Loader2, Receipt } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { EmptyState } from "@/components/shared/EmptyState";
import { useI18n, type T } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency";
import { listUserOrders, type Order } from "@/lib/users-store";

function formatDate(ms: number, lang: "en" | "ar") {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AccountOrdersPage() {
  const { user, isLoaded } = useUser();
  const { t, lang } = useI18n();
  const { format } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;
    (async () => {
      try {
        setLoading(true);
        const list = await listUserOrders(user.id);
        setOrders(list);
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoaded, user]);

  return (
    <AccountLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-slate-100">
            {t.account.myOrders}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t.account.ordersDesc}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={20} />
            {t.account.loading}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<Receipt className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
            title={t.account.noOrdersTitle}
            description={t.account.noOrdersDesc}
            actionLabel={t.account.browseCatalog}
            actionHref="/products"
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="glass-card rounded-3xl p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {t.account.orderRef} #{order.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {formatDate(order.createdAt, lang)}
                    </div>
                  </div>
                  <OrderStatusPill status={order.status} t={t} />
                </div>

                <ul className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-start justify-between gap-2 text-sm">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                          {item.quantity} × {item.name}
                        </div>
                        {item.duration && (
                          <div className="text-xs text-slate-400">{item.duration.replace(/_/g, " ")}</div>
                        )}
                      </div>
                      <div className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums-p whitespace-nowrap">
                        {format(item.price * item.quantity)}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between items-baseline pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {t.cart.total}
                  </span>
                  <span className="text-xl font-display font-bold text-gradient tabular-nums-p">
                    {format(order.totalPriceUsd)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}

function OrderStatusPill({ status, t }: { status: string; t: T }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    confirmed: "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300",
    delivered: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    cancelled: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
  };
  const labels: Record<string, string> = {
    pending: t.account.statusPending,
    confirmed: t.account.statusConfirmed,
    delivered: t.account.statusDelivered,
    cancelled: t.account.statusCancelled,
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${map[status] || map.pending}`}>
      {labels[status] || status}
    </span>
  );
}
