import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase-auth";
import {
  LogOut,
  Lock,
  Loader2,
  Mail,
  Eye,
  EyeOff,
  Package,
  ClipboardList,
  Users as UsersIcon,
  Bell,
  Megaphone,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { OrdersTab } from "@/components/admin/OrdersTab";
import { CustomersTab } from "@/components/admin/CustomersTab";
import { RemindersTab } from "@/components/admin/RemindersTab";
import PromotionsTab from "@/components/admin/PromotionsTab";
import { AnalyticsTab } from "@/components/admin/AnalyticsTab";
import { Seo } from "@/components/seo/Seo";

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string) || "";

type TabKey =
  | "products"
  | "orders"
  | "customers"
  | "reminders"
  | "promotions"
  | "analytics";

export default function Admin() {
  const { toast } = useToast();
  const { t } = useI18n();
  const [user, setUser] = useState<User | null>(null);
  const [isAdminClaim, setIsAdminClaim] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [emailInput, setEmailInput] = useState(ADMIN_EMAIL);
  const [pwInput, setPwInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<TabKey>("products");

  useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const tokenResult = await currentUser.getIdTokenResult();
          setIsAdminClaim(tokenResult.claims.admin === true);
        } catch {
          setIsAdminClaim(false);
        }
      } else {
        setIsAdminClaim(false);
      }
      setAuthReady(true);
    });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim() || !pwInput) {
      toast({
        title: "Email and password are required",
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, emailInput.trim(), pwInput);
      setPwInput("");
    } catch (e) {
      toast({
        title: "Sign in failed",
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
  }

  if (!authReady) {
    return (
      <>
        <Seo title="Admin" canonical="/admin" noIndex />
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
        </div>
      </>
    );
  }

  if (user && !isAdminClaim) {
    return (
      <>
        <Seo title="Admin" canonical="/admin" noIndex />
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-lg glass-card rounded-3xl p-8 sm:p-10 space-y-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-rose-600">
              <Lock size={20} />
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">
              Not authorized
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Signed in as <span className="font-semibold">{user.email}</span> —
              this account does not have the{" "}
              <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                admin
              </code>{" "}
              custom claim. Run{" "}
              <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                pnpm --filter @workspace/scripts run set-admin-claim
              </code>{" "}
              to grant access.
            </p>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Seo title="Admin" canonical="/admin" noIndex />
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleLogin}
            className="w-full max-w-lg glass-card rounded-3xl p-8 sm:p-10 space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white shrink-0">
                <Lock size={20} />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">
                  Admin Access
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage products, orders, and customers.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Admin Email
                </span>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    autoFocus
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900/40 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Admin Password
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={pwInput}
                    onChange={(e) => setPwInput(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900/40 text-slate-800 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md inline-flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full min-h-[48px] py-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:bg-pink-500 hover:text-white transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="animate-spin" size={16} />}
              Sign in
            </button>

            <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/40 dark:bg-slate-900/40 p-3 text-xs text-slate-500 dark:text-slate-400">
              Sign in with a Firebase Auth user that has the{" "}
              <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                admin
              </code>{" "}
              custom claim.
            </div>
          </motion.form>
        </div>
      </>
    );
  }

  const tabs: Array<{
    key: TabKey;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
  }> = [
    { key: "products", label: t.admin.tabs.products, icon: Package },
    { key: "orders", label: t.admin.tabs.orders, icon: ClipboardList },
    { key: "customers", label: t.admin.tabs.customers, icon: UsersIcon },
    { key: "reminders", label: t.admin.tabs.reminders, icon: Bell },
    { key: "promotions", label: t.admin.tabs.promotions, icon: Megaphone },
    { key: "analytics", label: t.admin.tabs.analytics, icon: BarChart3 },
  ];

  return (
    <>
      <Seo title="Admin" canonical="/admin" noIndex />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-800 dark:text-slate-100">
              BundlyPlus <span className="text-gradient">Admin</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors"
            title="Sign out"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>

        <div className="glass-panel rounded-full p-1.5 mb-6 inline-flex flex-wrap gap-1 max-w-full overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => {
            const isActive = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md shadow-pink-500/30"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </div>

        {tab === "products" && <ProductsTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "customers" && <CustomersTab />}
        {tab === "reminders" && <RemindersTab />}
        {tab === "promotions" && <PromotionsTab />}
        {tab === "analytics" && <AnalyticsTab />}
      </div>
    </>
  );
}
