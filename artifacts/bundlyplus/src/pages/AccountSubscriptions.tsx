import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/react";
import { Loader2, RefreshCcw, Calendar, CreditCard } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { EmptyState } from "@/components/shared/EmptyState";
import { useI18n, type T } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { listUserSubscriptions, type Subscription } from "@/lib/users-store";

function formatDate(ms: number, lang: "en" | "ar") {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AccountSubscriptionsPage() {
  const { user, isLoaded } = useUser();
  const { t, lang } = useI18n();
  const { siteSettings } = useSettings();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;
    (async () => {
      try {
        setLoading(true);
        const list = await listUserSubscriptions(user.id);
        setSubs(list);
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoaded, user]);

  function renewLink(sub: Subscription) {
    const phone = (siteSettings.whatsapp_number || "").replace(/[^0-9]/g, "");
    if (!phone) return "#";
    const expiry = formatDate(sub.expiryDate, "en");
    const text =
      lang === "ar"
        ? `مرحبا، أرغب في تجديد اشتراك *${sub.productName}* الذي ينتهي بتاريخ ${expiry}. شكرا!`
        : `Hi, I'd like to renew my *${sub.productName}* subscription (expires ${expiry}). Thanks!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  return (
    <AccountLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-slate-100">
            {t.account.mySubscriptions}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t.account.subsDesc}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={20} />
            {t.account.loading}
          </div>
        ) : subs.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
            title={t.account.noSubsTitle}
            description={t.account.noSubsDesc}
            actionLabel={t.account.browseCatalog}
            actionHref="/products"
          />
        ) : (
          <div className="grid gap-4">
            {subs.map((sub) => {
              const days = Math.ceil((sub.expiryDate - Date.now()) / (24 * 60 * 60 * 1000));
              const expiringSoon = sub.status === "active" && days <= 3;
              return (
                <div
                  key={sub.id}
                  className="glass-card rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {sub.productName}
                      </h3>
                      <StatusPill status={sub.status} t={t} />
                      {expiringSoon && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                          {t.account.renewSoon}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={13} />
                        {t.account.expires}: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatDate(sub.expiryDate, lang)}</span>
                      </span>
                      {sub.durationLabel && (
                        <span className="text-slate-400">· {sub.durationLabel}</span>
                      )}
                    </div>
                  </div>

                  {(sub.status === "active" || sub.status === "expired") && (
                    <a
                      href={renewLink(sub)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold shadow-md shadow-emerald-500/30 hover:scale-105 transition-transform whitespace-nowrap"
                    >
                      <RefreshCcw size={14} />
                      {t.account.renewWhatsapp}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}

function StatusPill({ status, t }: { status: string; t: T }) {
  const map: Record<string, string> = {
    active: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    expired: "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
    cancelled: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
  };
  const labels: Record<string, string> = {
    active: t.account.statusActive,
    expired: t.account.statusExpired,
    cancelled: t.account.statusCancelled,
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${map[status] || map.active}`}>
      {labels[status] || status}
    </span>
  );
}
