import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Layers, ShieldCheck, Zap, RefreshCw, Phone, Copy, Check, QrCode, Wallet } from 'lucide-react';
import { Link } from 'wouter';
import { useCart } from '@/hooks/use-cart';
import { generateWhatsAppLink } from '@/utils/whatsapp';
import { useSettings } from '@/lib/settings';
import { PageLayout } from '@/components/shared/PageLayout';
import { EmptyState } from '@/components/shared/EmptyState';
import { getBrandGradient, getInitials } from '@/lib/brand-theme';
import { useI18n } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const { siteSettings } = useSettings();
  const { t } = useI18n();
  const { format } = useCurrency();

  const handleCheckout = () => {
    if (!siteSettings.whatsapp_number) {
      alert(t.cart.whatsappNotConfigured);
      return;
    }
    const link = generateWhatsAppLink(siteSettings.whatsapp_number, items, totalPrice);
    window.open(link, '_blank');
  };

  if (items.length === 0) {
    return (
      <PageLayout maxWidth="lg" className="flex flex-col items-center justify-center">
        <EmptyState
          icon={<ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
          title={t.cart.empty}
          description={t.cart.emptyDesc}
          actionLabel={t.cart.startBrowsing}
          actionHref="/products"
        />
        <div className="-mt-6 mb-8">
          <Link href="/bundles" className="px-8 py-4 rounded-full bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-white dark:hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300 shadow-sm min-h-[48px] inline-flex items-center justify-center gap-2">
            <Layers size={18} />
            {t.cart.viewBundles}
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="lg">
      <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-800 dark:text-slate-100 mb-10 animate-[fadeIn_0.3s_ease-out]">
        {t.cart.title}
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-2/3 space-y-4">
          {items.map((item) => {
            const gradient = getBrandGradient(item.name);
            const initials = getInitials(item.name);
            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 animate-[fadeIn_0.3s_ease-out]"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                  {initials}
                </div>

                <div className="flex-grow w-full sm:w-auto">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{item.name}</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="uppercase tracking-wider text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-semibold me-2">{item.type}</span>
                    {item.duration && <span>{item.duration.replace('_', ' ')}</span>}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto">
                  <div className="flex items-center bg-white/60 dark:bg-white/10 rounded-full border border-slate-200 dark:border-slate-700 p-1 shadow-sm">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-semibold text-slate-800 dark:text-slate-100">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-xl font-bold font-display text-slate-800 dark:text-slate-100 min-w-[72px] text-center sm:text-end">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:w-1/3">
          <div className="glass-panel rounded-3xl p-8 sticky top-32">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">{t.cart.orderSummary}</h3>

            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t.cart.items} ({totalItems})</span>
                <span className="font-medium tabular-nums-p">{format(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t.cart.processingFee}</span>
                <span className="font-medium tabular-nums-p">{format(0)}</span>
              </div>
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between items-end">
                <span className="text-slate-800 dark:text-slate-100 font-bold text-base">{t.cart.total}</span>
                <span className="text-3xl font-display font-bold text-gradient tabular-nums-p">{format(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-lg shadow-green-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group min-h-[48px] gap-2"
            >
              {t.cart.checkout}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
              {t.cart.checkoutNote}
            </p>

            <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-white/10 grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">Instant<br/>delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">Secure<br/>payment</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">Money-back<br/>guarantee</span>
              </div>
            </div>

            {/* Payment Details */}
            <CheckoutPaymentDetails siteSettings={siteSettings} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      aria-label="Copy"
    >
      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
    </button>
  );
}

function CheckoutPaymentDetails({ siteSettings }: { siteSettings: any }) {
  return (
    <div className="mt-6 space-y-4">
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Payment Methods</h4>

      {/* Whish & OMT Phone */}
      <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/40 bg-white dark:bg-slate-900 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Phone size={14} className="text-pink-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Whish Money & OMT</span>
        </div>
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 rounded-lg px-3 py-2">
          <span className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-200" dir="ltr">{siteSettings.whatsapp_number ? `+${siteSettings.whatsapp_number}` : '+961 76 171 003'}</span>
          <CopyBtn text={siteSettings.whatsapp_number || '96176171003'} />
        </div>
      </div>

      {/* Whish QR */}
      <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/40 bg-white dark:bg-slate-900 p-4 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2 self-start">
          <QrCode size={14} className="text-rose-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Whish QR Code</span>
        </div>
        <div className="w-32 h-32 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800/60 p-1.5">
          <img src="/images/IMG_3601.JPG.jpeg" alt="Whish Money QR" className="w-full h-full object-contain" loading="lazy" />
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5">Scan in the Whish app</p>
      </div>

      {/* USDT Wallets */}
      <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/40 bg-white dark:bg-slate-900 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Wallet size={14} className="text-emerald-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">USDT Wallet Addresses</span>
        </div>
        <div className="space-y-2.5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">BEP20</div>
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg px-2.5 py-2">
              <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 break-all flex-1" dir="ltr">0x43cf4bded47c1309df53131a358db503a73de560</span>
              <CopyBtn text="0x43cf4bded47c1309df53131a358db503a73de560" />
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">TRON (TRC20)</div>
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg px-2.5 py-2">
              <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 break-all flex-1" dir="ltr">TBV1YtEANSAhsRZmU8MZwo8GnXPEbBd4oD</span>
              <CopyBtn text="TBV1YtEANSAhsRZmU8MZwo8GnXPEbBd4oD" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
