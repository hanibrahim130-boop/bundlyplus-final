import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Mail, Phone, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  listAllUsers,
  listAllSubscriptions,
  listAllOrders,
  type UserDoc,
  type Subscription,
  type Order,
} from "@/lib/users-store";

export function CustomersTab() {
  const { t } = useI18n();
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [u, s, o] = await Promise.all([listAllUsers(), listAllSubscriptions(), listAllOrders()]);
        setUsers(u);
        setSubs(s);
        setOrders(o);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const data = useMemo(() => {
    const subCount = new Map<string, { active: number; total: number }>();
    for (const s of subs) {
      const cur = subCount.get(s.userId) || { active: 0, total: 0 };
      cur.total += 1;
      if (s.status === "active") cur.active += 1;
      subCount.set(s.userId, cur);
    }
    const orderCount = new Map<string, number>();
    for (const o of orders) {
      orderCount.set(o.userId, (orderCount.get(o.userId) || 0) + 1);
    }
    const q = search.toLowerCase().trim();
    return users
      .map((u) => ({
        user: u,
        subs: subCount.get(u.id) || { active: 0, total: 0 },
        orders: orderCount.get(u.id) || 0,
      }))
      .filter(({ user }) => {
        if (!q) return true;
        return (
          user.fullName?.toLowerCase().includes(q) ||
          user.email?.toLowerCase().includes(q) ||
          user.phone?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.subs.active - a.subs.active);
  }, [users, subs, orders, search]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone…"
          className="w-full pl-11 rtl:pl-4 rtl:pr-11 pr-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-white/10 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900/40 text-slate-800 dark:text-slate-100 text-sm"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={18} />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center text-slate-400 py-12">{t.admin.customers.empty}</div>
      ) : (
        <div className="grid gap-3">
          {data.map(({ user, subs, orders }) => (
            <div key={user.id} className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {(user.fullName?.[0] || user.email?.[0] || "U").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {user.fullName || user.email || user.id.slice(0, 12)}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  {user.email && (
                    <span className="inline-flex items-center gap-1">
                      <Mail size={11} /> <span className="truncate">{user.email}</span>
                    </span>
                  )}
                  {user.phone && (
                    <span className="inline-flex items-center gap-1" dir="ltr">
                      <Phone size={11} /> {user.phone}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Stat label={t.admin.customers.active} value={subs.active} tone="emerald" />
                <Stat label={t.admin.customers.orders} value={orders} tone="pink" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "emerald" | "pink" }) {
  const tones = {
    emerald: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
    pink: "bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300",
  };
  return (
    <div className={`px-3 py-1.5 rounded-xl text-center ${tones[tone]}`}>
      <div className="text-base font-bold leading-tight tabular-nums-p">{value}</div>
      <div className="text-[10px] uppercase tracking-wider">{label}</div>
    </div>
  );
}
