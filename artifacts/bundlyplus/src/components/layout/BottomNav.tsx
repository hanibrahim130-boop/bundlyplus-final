import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Package, ShoppingCart, MessageCircle, User as UserIcon } from 'lucide-react';
import { Show } from '@clerk/react';
import { useCart } from '@/hooks/use-cart';
import { useSettings } from '@/lib/settings';
import { useI18n } from '@/lib/i18n';

export function BottomNav() {
  const [location] = useLocation();
  const { totalItems } = useCart();
  const { siteSettings } = useSettings();
  const { t } = useI18n();

  const navItems = [
    { id: 'home', path: '/', icon: Home, label: t.bottomNav.home },
    { id: 'products', path: '/products', icon: Package, label: t.bottomNav.products },
    { id: 'cart', path: '/cart', icon: ShoppingCart, label: t.bottomNav.cart },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50 glass-panel rounded-full px-2 py-2 flex justify-between items-center shadow-2xl shadow-purple-500/10 dark:shadow-black/40">
      {navItems.map(item => {
        const isActive = location === item.path;
        const Icon = item.icon;

        return (
          <Link
            key={item.id}
            href={item.path}
            className={`relative flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-300 ${
              isActive
                ? 'bg-white/80 dark:bg-white/15 shadow-sm text-pink-600 dark:text-pink-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] font-medium mt-1 ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              {item.label}
            </span>

            {item.id === 'cart' && totalItems > 0 && (
              <span className="absolute top-0.5 right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-md">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        );
      })}

      <Show when="signed-in">
        <Link
          href="/account"
          aria-label={t.account.profile}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-300 ${
            location.startsWith('/account')
              ? 'bg-white/80 dark:bg-white/15 shadow-sm text-pink-600 dark:text-pink-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <UserIcon size={20} strokeWidth={location.startsWith('/account') ? 2.5 : 2} />
          <span className={`text-[10px] font-medium mt-1 ${location.startsWith('/account') ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            {t.bottomNav.account}
          </span>
        </Link>
      </Show>

      <Show when="signed-out">
        {siteSettings.whatsapp_number && (
          <a
            href={`https://wa.me/${siteSettings.whatsapp_number}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Contact us on WhatsApp"
            className="flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-300 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
          >
            <MessageCircle size={20} strokeWidth={2} />
            <span className="text-[10px] font-medium mt-1 opacity-0 h-0 overflow-hidden">{t.bottomNav.chat}</span>
          </a>
        )}
      </Show>
    </div>
  );
}
