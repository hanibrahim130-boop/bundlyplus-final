import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Show, useUser, useClerk } from "@clerk/react";
import { LogIn, User as UserIcon, CreditCard, Receipt, LogOut } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function UserMenu() {
  const { t } = useI18n();
  return (
    <>
      <Show when="signed-out">
        <a
          href={`${basePath}/sign-in`}
          className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md shadow-pink-500/30 text-sm font-semibold min-h-[44px] hover:scale-105 active:scale-95 transition-transform"
        >
          <LogIn size={15} />
          <span>{t.account.signIn}</span>
        </a>
        <a
          href={`${basePath}/sign-in`}
          aria-label={t.account.signIn}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 border border-white/80 dark:border-white/20 text-slate-700 dark:text-slate-200 shadow-sm"
        >
          <LogIn size={15} />
        </a>
      </Show>
      <Show when="signed-in">
        <SignedInDropdown />
      </Show>
    </>
  );
}

function SignedInDropdown() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

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

  function go(path: string) {
    setOpen(false);
    setLocation(path);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t.account.profile}
        aria-expanded={open}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 border border-white/80 dark:border-white/20 shadow-sm overflow-hidden text-slate-700 dark:text-slate-200"
      >
        {user?.imageUrl ? (
          <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-bold">{initials}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl shadow-purple-900/10 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
              {user?.fullName || t.account.profile}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </div>
          </div>
          <div className="p-1.5">
            <MenuItem icon={UserIcon} label={t.account.profile} onClick={() => go("/account")} />
            <MenuItem icon={CreditCard} label={t.account.mySubscriptions} onClick={() => go("/account/subscriptions")} />
            <MenuItem icon={Receipt} label={t.account.myOrders} onClick={() => go("/account/orders")} />
          </div>
          <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <LogOut size={15} />
              <span>{t.account.signOut}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
    >
      <Icon size={15} />
      <span>{label}</span>
    </button>
  );
}
