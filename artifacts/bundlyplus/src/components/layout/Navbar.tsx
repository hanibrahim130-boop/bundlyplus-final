import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingCart, MessageCircle, Sun, Moon, Languages, Heart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useSettings, getWhatsAppUrl } from '@/lib/settings';
import { useTheme } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';

export function Navbar() {
  const [location] = useLocation();
  const { totalItems } = useCart();
  const { siteSettings } = useSettings();
  const { toggleTheme, isDark } = useTheme();
  const { t, toggleLang, lang } = useI18n();
  const { currency, toggleCurrency } = useCurrency();
  const { count: wishlistCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        rafId = 0;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.products, path: '/products' },
  ];

  const isCartActive = location === '/cart';
  const whatsAppLink = getWhatsAppUrl(siteSettings.whatsapp_number);

  return (
    <nav style={{ top: 'max(env(safe-area-inset-top, 0px), 12px)' }} className={`fixed sm:!top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-6xl z-50 rounded-full px-3 sm:px-6 py-2.5 sm:py-3 flex justify-between items-center gap-2 transition-[background-color,box-shadow] duration-300 ${
      scrolled
        ? 'md:bg-white/80 md:dark:bg-slate-900/80 md:backdrop-blur-xl bg-white/[0.97] dark:bg-slate-900/[0.97] border border-white/80 dark:border-white/10 shadow-xl shadow-purple-900/10 dark:shadow-black/30'
        : 'md:glass-panel bg-white/[0.92] dark:bg-slate-900/[0.92] md:bg-transparent md:dark:bg-transparent border border-white/60 dark:border-white/10 shadow-lg md:shadow-xl'
    }`}>
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 shadow-sm ring-1 ring-slate-950/10 dark:bg-white/10 dark:ring-white/15">
          <img src="/logo-icon.png" alt="" className="h-7 w-7 object-contain" />
        </span>
        <span className="text-xl font-bold font-display text-slate-800 dark:text-slate-100 tracking-tight">
          {siteSettings.site_name || 'BundlyPlus'}
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map(link => (
          <Link
            key={link.path}
            href={link.path}
            className={`text-sm font-medium transition-colors hover:text-pink-500 min-h-[44px] flex items-center ${
              location === link.path ? 'text-pink-600' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2.5">
        {/* Currency Toggle */}
        <button
          onClick={toggleCurrency}
          aria-label={currency === 'USD' ? 'Switch to Lebanese Pound' : 'Switch to US Dollar'}
          title={currency === 'USD' ? 'Show prices in L.L.' : 'Show prices in USD'}
          className="hidden sm:flex items-center justify-center h-10 px-3 rounded-full transition-all duration-300 bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 border border-white/80 dark:border-white/20 text-slate-700 dark:text-slate-200 shadow-sm text-xs font-bold tracking-wide"
        >
          <span className={currency === 'USD' ? 'text-pink-600 dark:text-pink-400' : 'opacity-50'}>USD</span>
          <span className="mx-1.5 text-slate-300 dark:text-slate-600">/</span>
          <span className={currency === 'LBP' ? 'text-pink-600 dark:text-pink-400' : 'opacity-50'}>L.L.</span>
        </button>

        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-full transition-all duration-300 bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 border border-white/80 dark:border-white/20 text-slate-700 dark:text-slate-200 shadow-sm text-xs font-bold tracking-wide"
        >
          <Languages size={14} />
          <span>{t.nav.switchLang}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 border border-white/80 dark:border-white/20 text-slate-700 dark:text-slate-200 shadow-sm overflow-hidden"
        >
          <span className={`absolute transition-all duration-300 ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
            <Moon size={15} />
          </span>
          <span className={`absolute transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}>
            <Sun size={15} />
          </span>
        </button>

        <Link
          href="/wishlist"
          aria-label="Wishlist"
          className={`relative hidden sm:flex items-center justify-center w-10 h-10 rounded-full transition-all shadow-sm ${
            location === '/wishlist'
              ? 'bg-pink-50 dark:bg-pink-950/50 border-2 border-pink-400 text-pink-600'
              : 'bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 border border-white/80 dark:border-white/20 text-slate-700 dark:text-slate-200'
          }`}
        >
          <Heart size={16} className={wishlistCount > 0 ? 'fill-pink-500 text-pink-500' : ''} />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
              {wishlistCount}
            </span>
          )}
        </Link>

        <Link href="/cart" className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all shadow-sm ${
          isCartActive
            ? 'bg-pink-50 dark:bg-pink-950/50 border-2 border-pink-400 text-pink-600'
            : 'bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 border border-white/80 dark:border-white/20 text-slate-700 dark:text-slate-200'
        }`}>
          <ShoppingCart size={17} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
              {totalItems}
            </span>
          )}
        </Link>

        <a
          href={whatsAppLink}
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-all shadow-md shadow-slate-900/20 text-sm font-medium min-h-[44px]"
        >
          <MessageCircle size={16} />
          <span>{t.nav.contactUs}</span>
        </a>
      </div>
    </nav>
  );
}
