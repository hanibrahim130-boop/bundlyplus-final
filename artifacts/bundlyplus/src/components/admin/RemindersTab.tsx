import React, { useEffect, useState } from "react";
import { Loader2, MessageCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import {
  listPendingReminders,
  markReminderSent,
  REMINDER_WINDOW,
  type PendingReminder,
} from "@/lib/users-store";

export function RemindersTab() {
  const { toast } = useToast();
  const { t } = useI18n();
  const { siteSettings } = useSettings();
  const [reminders, setReminders] = useState<PendingReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setReminders(await listPendingReminders());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function buildLink(r: PendingReminder) {
    const phone = (r.user?.phone || siteSettings.whatsapp_number || "").replace(/[^0-9]/g, "");
    const expiry = new Date(r.subscription.expiryDate).toLocaleDateString();
    const text =
      r.user?.preferredLang === "ar"
        ? `مرحبا ${r.user?.fullName || ""}، اشتراكك بـ *${r.subscription.productName}* سينتهي بتاريخ ${expiry}. هل تود تجديده؟`
        : `Hi ${r.user?.fullName || ""}, your *${r.subscription.productName}* subscription expires on ${expiry}. Want to renew?`;
    if (!phone) return null;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text.trim())}`;
  }

  async function markSent(r: PendingReminder) {
    setActingId(r.subscription.id);
    try {
      await markReminderSent(r.subscription.id);
      toast({ title: t.admin.reminders.sentJustNow });
      await load();
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {t.admin.reminders.intro.replace("{days}", String(REMINDER_WINDOW))}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={18} />
        </div>
      ) : reminders.length === 0 ? (
        <div className="text-center text-slate-400 py-12">
          {t.admin.reminders.empty.replace("{days}", String(REMINDER_WINDOW))}
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((r) => {
            const link = buildLink(r);
            return (
              <div key={r.subscription.id} className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {r.subscription.productName}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                      {t.admin.reminders.daysLeft.replace("{count}", String(r.daysUntilExpiry))}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {r.user?.fullName || r.user?.email || r.subscription.userId.slice(0, 10)}
                    {r.user?.phone && (
                      <span className="ms-2" dir="ltr">
                        · {r.user.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-semibold"
                    >
                      <MessageCircle size={14} />
                      {t.admin.reminders.send}
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">no phone</span>
                  )}
                  <button
                    disabled={actingId === r.subscription.id}
                    onClick={() => markSent(r)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/50 text-xs font-semibold disabled:opacity-50"
                  >
                    {actingId === r.subscription.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    {t.admin.reminders.markSent}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
