import React from 'react';
import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useSettings } from '@/lib/settings';
import { useI18n } from '@/lib/i18n';

const socialLinks = [
  { icon: Facebook, href: '#' },
  { icon: Twitter, href: '#' },
  { icon: Instagram, href: '#' },
  { icon: Youtube, href: '#' },
];

export function Footer() {
  const { siteSettings } = useSettings();
  const { t } = useI18n();
  const siteName = siteSettings.site_name || 'BundlyPlus';

  const quickLinks = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.products, href: '/products' },
    { label: t.cart.title, href: '/cart' },
  ];

  const legalLinks = [
    { label: t.footer.terms, href: '#' },
    { label: t.footer.privacy, href: '#' },
    { label: t.footer.refund, href: '#' },
    { label: t.footer.contact, href: '#' },
  ];

  return (
    <footer className="w-full mt-24 border-t border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-black/20 backdrop-blur-sm relative z-10 pb-28 md:pb-0">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <img src="/logo-icon.png" alt="" className="h-9 w-9 object-contain" />
              <span className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100">{siteName}</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 hover:shadow-md transition-all border border-slate-100 dark:border-slate-700">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 tracking-wide text-sm uppercase">{t.footer.quickLinks}</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              {quickLinks.map(link => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors min-h-[44px] inline-flex items-center">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 tracking-wide text-sm uppercase">{t.footer.legal}</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              {legalLinks.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors min-h-[44px] inline-flex items-center">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 dark:text-slate-500 text-sm text-center md:text-start">
            &copy; {new Date().getFullYear()} {siteName}. {t.footer.rights}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <a
              href="https://wa.me/96176171003"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              +961 76 171 003
            </a>
            <span className="hidden md:inline text-slate-300 dark:text-slate-700">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-base leading-none">🇱🇧</span>
              <span>Beirut, Lebanon</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
