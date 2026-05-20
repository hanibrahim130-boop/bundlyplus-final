import React, { useState } from 'react';
import { Truck, ShieldCheck, MapPin, Clock, Phone, Copy, Check, QrCode, Wallet } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { PAYMENT_METHODS_EN, PAYMENT_METHODS_AR } from '@/data/payments';

export function LocalTrust() {
  const { lang, isRTL } = useI18n();
  const isAr = lang === 'ar';
  const methods = isAr ? PAYMENT_METHODS_AR : PAYMENT_METHODS_EN;

  const heading = isAr ? 'من لبنان ' : 'Trusted Worldwide ';
  const subheading = isAr
    ? 'ادفع بطريقتك المفضلة محلياً. توصيل فوري عبر واتساب لجميع المحافظات اللبنانية والشرق الأوسط.'
    : 'Pay your way. Instant WhatsApp delivery, globally.';

  const stats = isAr
    ? [
        { icon: <MapPin className="w-4 h-4" />, label: 'بيروت · لبنان' },
        { icon: <Clock className="w-4 h-4" />, label: 'تسليم خلال 5 دقائق' },
        { icon: <ShieldCheck className="w-4 h-4" />, label: 'ضمان استرداد' },
        { icon: <Truck className="w-4 h-4" />, label: 'كل المحافظات' },
      ]
    : [
        { icon: <MapPin className="w-4 h-4" />, label: 'Global Delivery' },
        { icon: <Clock className="w-4 h-4" />, label: '5-min delivery' },
        { icon: <ShieldCheck className="w-4 h-4" />, label: 'Money-back guarantee' },
        { icon: <Truck className="w-4 h-4" />, label: 'Worldwide delivery' },
      ];

  const payHere = isAr ? 'الدفع' : 'Payment methods';

  return (
    <section className="relative w-full px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            {/* Subtle Lebanese flag accent */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-red-500/10 via-white/0 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 mb-4">
                  <span className="text-base leading-none">🇱🇧</span>
                  <span>{isAr ? 'صنع لكم في لبنان' : 'Built for Everyone'}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {heading}<span className="text-gradient">{isAr ? 'للعالم' : 'for the world.'}</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
                  {subheading}
                </p>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-8">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium"
                  >
                    <span className="text-pink-500 dark:text-pink-400">{s.icon}</span>
                    {s.label}
                  </div>
                ))}
              </div>

              {/* Payment methods label */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300/60 dark:via-white/10 to-transparent" />
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-slate-400">
                  {payHere}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300/60 dark:via-white/10 to-transparent" />
              </div>

              {/* Payment cards grid */}
              <div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {methods.map((m, i) => (
                  <div
                    key={i}
                    className="group relative rounded-2xl p-[1.5px] bg-gradient-to-br hover:scale-[1.03] transition-transform duration-200"
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${m.color} opacity-30 group-hover:opacity-60 transition-opacity`} />
                    <div className="relative rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur p-4 h-full flex flex-col items-center justify-center text-center">
                      {m.icon}
                      <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight">
                        {m.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {m.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function CopyButton({ text }: { text: string }) {
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
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  );
}

function PaymentDetails({ isAr }: { isAr: boolean }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Whish & OMT Phone */}
      <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/40 bg-white dark:bg-slate-900 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Phone size={16} className="text-pink-500" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {isAr ? 'ويش موني و OMT' : 'Whish Money & OMT'}
          </span>
        </div>
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 rounded-xl px-4 py-3">
          <span className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-200 tracking-wide" dir="ltr">
            +961 76 171 003
          </span>
          <CopyButton text="+96176171003" />
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
          {isAr ? 'أرسل إلى هذا الرقم عبر ويش أو OMT' : 'Send to this number via Whish or OMT'}
        </p>
      </div>

      {/* Whish QR Code */}
      <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/40 bg-white dark:bg-slate-900 p-5 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3 self-start">
          <QrCode size={16} className="text-rose-500" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {isAr ? 'باركود ويش' : 'Whish QR Code'}
          </span>
        </div>
        <div className="w-36 h-36 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/60 p-2">
          <img
            src="/images/IMG_3601.JPG.jpeg"
            alt="Whish Money QR Code"
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 text-center">
          {isAr ? 'امسح الباركود في تطبيق ويش' : 'Scan in the Whish app to pay'}
        </p>
      </div>

    </div>
  );
}
