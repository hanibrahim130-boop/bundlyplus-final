import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingCart, Sun, Moon, Languages, Heart, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useSettings } from '@/lib/settings';
import { useTheme } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';
import { UserMenu } from '@/components/layout/UserMenu';

/**
 * Apple-style top bar.
 *
 * Fixed at the very top, full-width, glass background that fades in
 * once the user has scrolled past the hero. Structure follows
 * apple.com:
 *   logo · primary nav · icon utilities (theme/lang/cart)
 *
 * Mobile collapses the centre nav into a single sheet button.
 * Glass is disabled on narrow screens (see mobile block in index.css)
 * so frame-rate stays at 60fps on mid-range Android devices.
 */
export function Navbar() {
  const [location] = useLocation();
  const { totalItems } = useCart();
  const { siteSettings } = useSettings();
  const { toggleTheme, isDark } = useTheme();
  const { t, toggleLang, lang } = useI18n();
  const { count: wishlistCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 16);
        raf = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Close mobile sheet on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.products, path: '/products' },
    { name: t.nav.comingSoon, path: '/coming-soon' },
  ];

  const siteName = siteSettings.site_name || 'BundlyPlus';

  return (
    <>
      <nav
        aria-label="Primary"
        className={`fixed inset-x-0 top-0 z-50 w-full transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled
            ? 'bp-glass-nav border-b'
            : 'bg-transparent border-b border-transparent'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label={siteName}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 shadow-sm ring-1 ring-slate-950/10 dark:bg-slate-900 dark:ring-white/15">
              <img
                src="/logo-icon.png"
                alt=""
                className="h-5 w-5 object-contain"
                width={20}
                height={20}
              />
            </span>
            <span
              className="text-[15px] font-semibold tracking-tight"
              style={{ color: 'var(--bp-ink)' }}
            >
              {siteName}
            </span>
          </Link>

          {/* Centre nav — desktop only */}
          <ul className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = location === link.path;
              return (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-[13px] font-normal tracking-[-0.01em] transition-colors duration-200"
                    style={{
                      color: active ? 'var(--bp-ink)' : 'var(--bp-ink-soft)',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.color = 'var(--bp-ink)';
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.color = 'var(--bp-ink-soft)';
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Language */}
            <button
              type="button"
              onClick={toggleLang}
              aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
              className="inline-flex h-8 items-center gap-1 px-2.5 rounded-full text-[11px] font-medium tracking-tight transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/10"
              style={{ color: 'var(--bp-ink-soft)' }}
            >
              <Languages size={13} />
              <span>{t.nav.switchLang}</span>
            </button>

            {/* Theme */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/10"
              style={{ color: 'var(--bp-ink-soft)' }}
            >
              <span
                className={`absolute transition-all duration-300 ${
                  isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                }`}
              >
                <Moon size={14} />
              </span>
              <span
                className={`absolute transition-all duration-300 ${
                  isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                }`}
              >
                <Sun size={14} />
              </span>
            </button>

            {/* Wishlist — hidden on very small screens to save space */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/10"
              style={{ color: 'var(--bp-ink-soft)' }}
            >
              <Heart
                size={14}
                fill={wishlistCount > 0 ? 'currentColor' : 'none'}
                className={wishlistCount > 0 ? 'text-pink-500' : ''}
              />
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold text-white"
                  style={{ background: 'var(--bp-pink)' }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/10"
              style={{ color: 'var(--bp-ink-soft)' }}
            >
              <ShoppingCart size={14} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold text-white"
                  style={{ background: 'var(--bp-pink)' }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Account */}
            <div className="hidden sm:block">
              <UserMenu />
            </div>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-sheet"
              className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/10"
              style={{ color: 'var(--bp-ink)' }}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile sheet */}
        <div
          id="mobile-nav-sheet"
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{
            background: scrolled ? 'var(--bp-glass-bg)' : 'var(--bp-bg-soft)',
            borderTop: mobileOpen ? '1px solid var(--bp-border)' : 'none',
          }}
        >
          <ul className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => {
              const active = location === link.path;
              return (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="block rounded-xl px-4 py-3 text-[15px] font-medium tracking-tight transition-colors"
                    style={{
                      color: active ? 'var(--bp-pink)' : 'var(--bp-ink)',
                      background: active ? 'var(--bp-pink-soft)' : 'transparent',
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
            <li className="mt-2 pt-3 border-t" style={{ borderColor: 'var(--bp-border)' }}>
              <Link
                href="/account"
                className="block rounded-xl px-4 py-3 text-[15px] font-medium tracking-tight transition-colors"
                style={{ color: 'var(--bp-ink)' }}
              >
                {t.account.profile}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Spacer so page content sits below the fixed nav */}
      <div className="h-12" aria-hidden="true" />
    </>
  );
}
