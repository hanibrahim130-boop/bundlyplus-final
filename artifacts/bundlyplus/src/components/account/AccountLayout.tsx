import React from "react";
import { Link, useLocation } from "wouter";
import { Show, useUser, useClerk } from "@clerk/react";
import { User as UserIcon, CreditCard, Receipt, LogOut } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PageLayout } from "@/components/shared/PageLayout";

interface AccountLayoutProps {
  children: React.ReactNode;
}

function AccountSidebar() {
  const [location] = useLocation();
  const { t } = useI18n();
  const { user } = useUser();
  const { signOut } = useClerk();
  const initials =
    user?.fullName
      ?.split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() ||
    user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ||
    "U";

  const items = [
    { to: "/account", label: t.account.profile, icon: UserIcon },
    { to: "/account/subscriptions", label: t.account.mySubscriptions, icon: CreditCard },
    { to: "/account/orders", label: t.account.myOrders, icon: Receipt },
  ];

  return (
    <aside className="lg:w-72 shrink-0">
      <div className="glass-card rounded-3xl p-6 mb-4">
        <div className="flex items-center gap-3">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt=""
              className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-200 dark:ring-pink-900/40"
            />
          ) : (
            <span className="flex w-12 h-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold">
              {initials}
            </span>
          )}
          <div className="min-w-0">
            <div className="font-display font-semibold text-slate-800 dark:text-slate-100 truncate">
              {user?.fullName || user?.primaryEmailAddress?.emailAddress}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </div>
          </div>
        </div>
      </div>

      <nav className="glass-card rounded-3xl p-2 flex lg:flex-col flex-row overflow-x-auto">
        {items.map((item) => {
          const isActive = location === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              href={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => signOut()}
          className="mt-1 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-colors text-left"
        >
          <LogOut size={16} />
          <span>{t.account.signOut}</span>
        </button>
      </nav>
    </aside>
  );
}

export function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <>
      <Show when="signed-in">
        <PageLayout maxWidth="xl">
          <div className="flex flex-col lg:flex-row gap-8">
            <AccountSidebar />
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </PageLayout>
      </Show>
      <Show when="signed-out">
        <SignedOutPlaceholder />
      </Show>
    </>
  );
}

function SignedOutPlaceholder() {
  const { t } = useI18n();
  return (
    <PageLayout maxWidth="md">
      <div className="glass-card rounded-3xl p-10 text-center">
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100 mb-3">
          {t.account.signedOutTitle}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          {t.account.signedOutDesc}
        </p>
        <a
          href={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/sign-in`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg shadow-pink-500/30 hover:scale-105 transition-transform"
        >
          {t.account.signIn}
        </a>
      </div>
    </PageLayout>
  );
}
