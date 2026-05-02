import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/react";
import { Loader2, Save, Phone, Globe, DollarSign } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { getOrCreateUser, updateUserProfile, type UserDoc } from "@/lib/users-store";

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserDoc | null>(null);
  const [phone, setPhone] = useState("");
  const [preferredLang, setPreferredLang] = useState<"en" | "ar">(lang);
  const [preferredCurrency, setPreferredCurrency] = useState<"USD" | "LBP">("USD");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const doc = await getOrCreateUser(user.id, {
          email: user.primaryEmailAddress?.emailAddress,
          fullName: user.fullName || undefined,
        });
        if (cancelled) return;
        setProfile(doc);
        setPhone(doc.phone || "");
        setPreferredLang(doc.preferredLang || lang);
        setPreferredCurrency(doc.preferredCurrency || "USD");
      } catch (e) {
        toast({
          title: t.account.loadError,
          description: (e as Error).message,
          variant: "destructive",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Intentionally omit `lang` so changing language mid-edit does not
    // refetch and overwrite in-progress edits to phone/currency/lang prefs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.id, {
        phone: phone.trim(),
        preferredLang,
        preferredCurrency,
      });
      toast({ title: t.account.saved });
    } catch (e) {
      toast({
        title: t.account.saveError,
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AccountLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-slate-100">
            {t.account.profile}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t.account.profileDesc}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          {loading || !profile ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="animate-spin mr-2" size={20} />
              {t.account.loading}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t.account.fullName}>
                  <input
                    value={user?.fullName || ""}
                    readOnly
                    className={readOnlyCls}
                  />
                </Field>
                <Field label={t.account.email}>
                  <input
                    value={user?.primaryEmailAddress?.emailAddress || ""}
                    readOnly
                    className={readOnlyCls}
                  />
                </Field>
                <Field label={t.account.phone}>
                  <div className="relative">
                    <Phone
                      size={14}
                      className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      dir="ltr"
                      placeholder="+961 76 171 003"
                      className={inputClsWithIcon}
                    />
                  </div>
                </Field>
                <Field label={t.account.preferredLang}>
                  <div className="relative">
                    <Globe
                      size={14}
                      className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <select
                      value={preferredLang}
                      onChange={(e) => setPreferredLang(e.target.value as "en" | "ar")}
                      className={inputClsWithIcon}
                    >
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                </Field>
                <Field label={t.account.preferredCurrency}>
                  <div className="relative">
                    <DollarSign
                      size={14}
                      className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <select
                      value={preferredCurrency}
                      onChange={(e) => setPreferredCurrency(e.target.value as "USD" | "LBP")}
                      className={inputClsWithIcon}
                    >
                      <option value="USD">USD</option>
                      <option value="LBP">L.L.</option>
                    </select>
                  </div>
                </Field>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-transform disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {t.account.save}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AccountLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClsWithIcon =
  "w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900/40 text-slate-800 dark:text-slate-100";

const readOnlyCls =
  "w-full px-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-not-allowed";
