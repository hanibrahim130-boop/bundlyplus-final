import React, { useEffect, useRef, useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  Phone,
  Copy,
  Check,
  QrCode,
  Wallet,
  Loader2,
} from "lucide-react";
import { useUser } from "@clerk/react";
import { useCart } from "@/hooks/use-cart";
import { generateWhatsAppLink } from "@/utils/whatsapp";
import { useSettings } from "@/lib/settings";
import { PageLayout } from "@/components/shared/PageLayout";
import { EmptyState } from "@/components/shared/EmptyState";
import { Seo } from "@/components/seo/Seo";
import { getBrandGradient, getInitials } from "@/lib/brand-theme";
import { useI18n } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  createOrder,
  markOrderWhatsappOpened,
  getUserDoc,
} from "@/lib/users-store";
import type { SiteSettings } from "@/types";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } =
    useCart();
  const { siteSettings } = useSettings();
  const { t, lang } = useI18n();
  const { format, currency } = useCurrency();
  const { user, isSignedIn } = useUser();
  const [submitting, setSubmitting] = useState(false);

  const isMobile = useIsMobile();
  const estimatedFullPrice = items.reduce((acc, it) => {
    const fullPrice = it.type === 'product' ? it.price * 5 : it.price * 4;
    return acc + fullPrice * it.quantity;
  }, 0);
  const estimatedSavings = estimatedFullPrice - totalPrice;
  const savingsPercent = estimatedFullPrice > 0 ? Math.round((estimatedSavings / estimatedFullPrice) * 100) : 0;

  const cartViewedRef = useRef(false);
  useEffect(() => {
    if (cartViewedRef.current) return;
    cartViewedRef.current = true;
    trackEvent(ANALYTICS_EVENTS.CART_VIEWED, {
      total_items: totalItems,
      total_price_usd: totalPrice,
      currency,
      language: lang,
      signed_in: !!isSignedIn,
    });
  }, []);

  const handleCheckout = async () => {
    if (!siteSettings.whatsapp_number) {
      alert(t.cart.whatsappNotConfigured);
      return;
    }

    trackEvent(ANALYTICS_EVENTS.WHATSAPP_CHECKOUT_CLICKED, {
      total_items: totalItems,
      total_price_usd: totalPrice,
      currency,
      language: lang,
      signed_in: !!isSignedIn,
    });

    let orderRef: string | undefined;
    if (user) {
      try {
        setSubmitting(true);
        const userDoc = await getUserDoc(user.id);
        orderRef = await createOrder({
          userId: user.id,
          userEmail: user.primaryEmailAddress?.emailAddress,
          userName: user.fullName || undefined,
          userPhone:
            userDoc?.phone || user.primaryPhoneNumber?.phoneNumber || undefined,
          items: items.map((it) => ({
            productId: it.id,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
            type: it.type,
            duration: it.duration,
          })),
          totalPriceUsd: totalPrice,
        });
      } catch (e) {
        console.warn("Failed to create order draft", e);
      } finally {
        setSubmitting(false);
      }
    }

    const link = generateWhatsAppLink(
      siteSettings.whatsapp_number,
      items,
      totalPrice,
      format,
      orderRef ? `#${orderRef.slice(0, 8).toUpperCase()}` : undefined,
    );

    if (orderRef) {
      markOrderWhatsappOpened(orderRef).catch(() => {});
    }

    window.open(link, "_blank");
  };

  if (items.length === 0) {
    return (
      <>
        <Seo title="Cart" canonical="/cart" noIndex />
        <PageLayout
          maxWidth="lg"
          className="flex flex-col items-center justify-center"
        >
          <EmptyState
            icon={
              <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600" />
            }
            title={t.cart.empty}
            description={t.cart.emptyDesc}
            actionLabel={t.cart.startBrowsing}
            actionHref="/products"
          />
        </PageLayout>
      </>
    );
  }

  return (
    <>
      <Seo title="Cart" canonical="/cart" noIndex />
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
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-md`}
                  >
                    {initials}
                  </div>

                  <div className="flex-grow w-full sm:w-auto">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                      {item.name}
                    </h3>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      <span className="uppercase tracking-wider text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-semibold">
                        {item.type}
                      </span>
                      {item.duration && (
                        <span className="ms-2">
                          {item.duration.replace("_", " ")}
                        </span>
                      )}
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
                      <span className="w-8 text-center font-semibold text-slate-800 dark:text-slate-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-xl font-bold font-display text-slate-800 dark:text-slate-100 min-w-[72px] text-center sm:text-end">
                      {format(item.price * item.quantity)}
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
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                {t.cart.orderSummary}
              </h3>

              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>
                    {t.cart.items} ({totalItems})
                  </span>
                  <span className="font-medium tabular-nums-p">
                    {format(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>{t.cart.processingFee}</span>
                  <span className="font-medium tabular-nums-p">
                    {format(0)}
                  </span>
                </div>
                {estimatedSavings > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>{t.cart.youSave}</span>
                    <span className="font-bold tabular-nums-p">
                      {format(estimatedSavings)} ({savingsPercent}%)
                    </span>
                  </div>
                )}
                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between items-end">
                  <span className="text-slate-800 dark:text-slate-100 font-bold text-base">
                    {t.cart.total}
                  </span>
                  <span className="text-3xl font-display font-bold text-gradient tabular-nums-p">
                    {format(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-lg shadow-green-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group min-h-[48px] gap-2 disabled:opacity-70 disabled:cursor-wait"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                {t.cart.checkout}
                {!submitting && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
                {t.cart.checkoutPaymentInstruction}
              </p>

              <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-white/10">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
                  {t.cart.checkoutHowWorks}
                </h4>
                <ol className="space-y-3">
                  {t.cart.checkoutFlow.map((step, index) => (
                    <li
                      key={step.title}
                      className="grid grid-cols-[2rem_1fr] gap-3"
                    >
                      <span className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                          {step.title}
                        </span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                          {step.description}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-white/10 grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                    {t.cart.instantDelivery}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-full bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                    {t.cart.securePayment}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                    {t.cart.moneyBackGuarantee}
                  </span>
                </div>
              </div>

              {/* Payment Details */}
              <CheckoutPaymentDetails siteSettings={siteSettings} />
            </div>
          </div>
        </div>
      </PageLayout>

      {isMobile && (
        <div className="fixed bottom-16 left-0 right-0 z-[60] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 px-4 py-3 shadow-lg">
          <div className="flex items-center gap-3 mb-2 text-center justify-center">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={12} /> {t.cart.securePayment}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
              <Zap size={12} /> {t.cart.instantDelivery}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
              <RefreshCw size={12} /> {t.cart.moneyBackGuarantee}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-lg shadow-green-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-70"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {t.cart.checkout} — {format(totalPrice)}
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      )}
    </>
  );
}

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const { t } = useI18n();
  const copiedMessage = t.cart.copiedLabel.replace("{label}", label);
  const copyErrorMessage = t.cart.copyErrorLabel.replace("{label}", label);
  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.top = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!copied) throw new Error("Copy command failed");
      }
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 2500);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="min-w-[36px] min-h-[36px] rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
      aria-label={`${t.cart.copy} ${label}`}
      title={status === "error" ? t.cart.copyFailed : `${t.cart.copy} ${label}`}
    >
      {status === "copied" ? (
        <Check size={15} className="text-emerald-500" />
      ) : (
        <Copy size={15} />
      )}
      <span className="sr-only" aria-live="polite">
        {status === "copied"
          ? copiedMessage
          : status === "error"
            ? copyErrorMessage
            : ""}
      </span>
    </button>
  );
}

function CheckoutPaymentDetails({
  siteSettings,
}: {
  siteSettings: SiteSettings;
}) {
  const { t } = useI18n();
  const paymentPhone = (siteSettings.whatsapp_number || "96176171003").replace(
    /[^0-9]/g,
    "",
  );
  const displayPaymentPhone = paymentPhone
    ? `+${paymentPhone}`
    : "+96176171003";

  return (
    <div className="mt-6 space-y-4">
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {t.cart.paymentMethods}
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {t.cart.paymentIntro}
        </p>
      </div>

      {/* Whish & OMT Phone */}
      <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/40 bg-white dark:bg-slate-900 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
            <Phone size={16} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {t.cart.whishOmt}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {t.cart.whishPhoneHelp}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-3 py-2">
          <span
            className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-200 break-all"
            dir="ltr"
          >
            {displayPaymentPhone}
          </span>
          <CopyBtn text={paymentPhone} label={t.cart.whishOmtPhoneLabel} />
        </div>
      </div>

      {/* Whish QR */}
      <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/40 bg-white dark:bg-slate-900 p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <QrCode size={16} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {t.cart.whishQrCode}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {t.cart.whishQrHelp}
            </div>
          </div>
        </div>
        <div className="mx-auto w-36 h-36 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/60 p-1.5">
          <img
            src="/images/IMG_3601.JPG.jpeg"
            alt={t.cart.whishQrAlt}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
      </div>

      {/* USDT Wallets */}
      <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/40 bg-white dark:bg-slate-900 p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Wallet size={16} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {t.cart.usdtWalletAddresses}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {t.cart.usdtNetworkHelp}
            </div>
          </div>
        </div>
        <div className="space-y-2.5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              BEP20
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-3 py-2">
              <span
                className="text-[11px] font-mono text-slate-600 dark:text-slate-300 break-all flex-1"
                dir="ltr"
              >
                0x43cf4bded47c1309df53131a358db503a73de560
              </span>
              <CopyBtn
                text="0x43cf4bded47c1309df53131a358db503a73de560"
                label={t.cart.usdtBep20Label}
              />
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              TRON (TRC20)
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-3 py-2">
              <span
                className="text-[11px] font-mono text-slate-600 dark:text-slate-300 break-all flex-1"
                dir="ltr"
              >
                TBV1YtEANSAhsRZmU8MZwo8GnXPEbBd4oD
              </span>
              <CopyBtn
                text="TBV1YtEANSAhsRZmU8MZwo8GnXPEbBd4oD"
                label={t.cart.usdtTrc20Label}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
