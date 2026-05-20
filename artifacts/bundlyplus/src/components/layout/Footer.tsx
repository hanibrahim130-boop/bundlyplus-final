import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { useSettings } from '@/lib/settings';
import { useI18n } from '@/lib/i18n';

/**
 * Apple-style footer.
 *
 * Light, minimal, spacious. Uses page-muted background so it reads
 * like a deliberate ground for the page, not an afterthought. Links
 * render as small text-buttons in 3-4 columns, with a fine-print row
 * at the bottom covering copyright + region.
 */

const SOCIAL_PLATFORMS = [
  { settingsKey: 'facebook_url', icon: Facebook, label: 'Facebook' },
  { settingsKey: 'twitter_url', icon: Twitter, label: 'Twitter' },
  { settingsKey: 'instagram_url', icon: Instagram, label: 'Instagram' },
  { settingsKey: 'youtube_url', icon: Youtube, label: 'YouTube' },
] as const;

function readSocialUrl(
  siteSettings: Record<string, unknown>,
  key: string,
): string | null {
  const value = siteSettings[key];
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function Footer() {
  const { siteSettings } = useSettings();
  const { t } = useI18n();
  const siteName = siteSettings.site_name || 'BundlyPlus';
  const whatsappNumber =
    (siteSettings as { whatsapp_number?: string }).whatsapp_number || '96176171003';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const socialLinks = SOCIAL_PLATFORMS.flatMap(({ settingsKey, icon, label }) => {
    const url = readSocialUrl(siteSettings as Record<string, unknown>, settingsKey);
    return url ? [{ icon, label, url }] : [];
  });

  const shopLinks = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.products, href: '/products' },
    { label: t.cart.title, href: '/cart' },
    { label: t.nav.comingSoon, href: '/coming-soon' },
  ];

  const legalLinks = [
    { label: t.footer.terms, href: '/terms' },
    { label: t.footer.privacy, href: '/privacy' },
    { label: t.footer.refund, href: '/refund-policy' },
    { label: t.footer.contact, href: '/contact' },
  ];

  return (
    <footer
      className="w-full mt-24 relative z-10"
      style={{
        background: 'var(--bp-bg-muted)',
        borderTop: '1px solid var(--bp-border)',
      }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-14 sm:py-20">
        {/* Top — big brand block */}
        <div className="grid grid-cols-2 sm:grid-cols-12 gap-x-8 gap-y-12 pb-12">
          <div className="col-span-2 sm:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 shadow-sm ring-1 ring-slate-950/10 dark:bg-slate-900 dark:ring-white/15">
                <img
                  src="/logo-icon.png"
                  alt=""
                  className="h-6 w-6 object-contain"
                  width={24}
                  height={24}
                />
              </span>
              <span
                className="text-lg font-semibold tracking-tight"
                style={{ color: 'var(--bp-ink)' }}
              >
                {siteName}
              </span>
            </Link>
            <p
              className="text-[14px] leading-relaxed max-w-sm"
              style={{ color: 'var(--bp-ink-soft)' }}
            >
              {t.footer.description}
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium tracking-tight transition-colors"
              style={{ color: 'var(--bp-pink)' }}
            >
              <MessageCircle size={15} />
              <span>{t.footer.contact}</span>
            </a>
          </div>

          <div className="col-span-1 sm:col-span-3">
            <h4
              className="text-[11px] font-semibold tracking-[0.08em] uppercase mb-4"
              style={{ color: 'var(--bp-ink-faint)' }}
            >
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-3 text-[14px]">
              {shopLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="inline-block min-h-[32px] transition-colors hover:text-[color:var(--bp-pink)]"
                    style={{ color: 'var(--bp-ink-soft)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 sm:col-span-4">
            <h4
              className="text-[11px] font-semibold tracking-[0.08em] uppercase mb-4"
              style={{ color: 'var(--bp-ink-faint)' }}
            >
              {t.footer.legal}
            </h4>
            <ul className="space-y-3 text-[14px]">
              {legalLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="inline-block min-h-[32px] transition-colors hover:text-[color:var(--bp-pink)]"
                    style={{ color: 'var(--bp-ink-soft)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {socialLinks.length > 0 && (
              <div className="mt-8 flex gap-2">
                {socialLinks.map(({ icon: Icon, label, url }) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                    style={{
                      color: 'var(--bp-ink-soft)',
                      border: '1px solid var(--bp-border)',
                    }}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom — fine print */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--bp-border)' }}
        >
          <p
            className="text-[12px]"
            style={{ color: 'var(--bp-ink-faint)' }}
          >
            © {new Date().getFullYear()} {siteName}. {t.footer.rights}
          </p>
          <div
            className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]"
            style={{ color: 'var(--bp-ink-faint)' }}
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[color:var(--bp-pink)]"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: '#10B981' }}
              />
              +961 76 171 003
            </a>
            <span>·</span>
            <span>Global Delivery</span>
          </div>
        </div>

        <p
          className="mt-6 max-w-2xl text-[11px] leading-relaxed"
          style={{ color: 'var(--bp-ink-faint)' }}
        >
          {t.footer.analytics}
        </p>
      </div>
    </footer>
  );
}
