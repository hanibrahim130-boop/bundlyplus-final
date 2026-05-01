import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Gift, Sparkles, X } from 'lucide-react';

import { translations } from '@/lib/i18n';

const DISCOUNT_POPUP_STORAGE_KEY = 'bundlyplus_may_1_2_discount_seen';

function isMayDiscountActive(date = new Date()) {
  const month = date.getMonth();
  const day = date.getDate();

  return month === 4 && (day === 1 || day === 2);
}

export function DiscountPopup() {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const discount = translations.en.discountPopup;

  const sparklePositions = useMemo(
    () => [
      'left-[18%] top-[18%]',
      'right-[16%] top-[22%]',
      'left-[12%] bottom-[24%]',
      'right-[22%] bottom-[18%]',
    ],
    [],
  );

  useEffect(() => {
    if (!isMayDiscountActive()) return;

    try {
      if (localStorage.getItem(DISCOUNT_POPUP_STORAGE_KEY) === 'true') return;
      localStorage.setItem(DISCOUNT_POPUP_STORAGE_KEY, 'true');
    } catch {
      // If storage is unavailable, still show the offer for the current visit.
    }

    const showTimer = window.setTimeout(() => setIsVisible(true), 650);
    return () => window.clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsVisible(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="discount-popup-title"
          dir="ltr"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.22 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45 dark:bg-slate-950/65"
            aria-label={discount.dismiss}
            onClick={() => setIsVisible(false)}
          />

          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl shadow-pink-950/20 dark:border-white/10 dark:bg-slate-950 dark:shadow-black/60"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 28, scale: 0.92 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          >
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400" />
            <div className="absolute inset-x-0 top-0 h-28 opacity-30 hero-shimmer" />

            {!shouldReduceMotion &&
              sparklePositions.map((position, index) => (
                <motion.span
                  key={position}
                  className={`absolute ${position} z-10 text-white/80`}
                  animate={{ y: [0, -8, 0], rotate: [0, 12, 0], opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 2.8, delay: index * 0.22, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden="true"
                >
                  <Sparkles className="h-4 w-4" />
                </motion.span>
              ))}

            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/80"
              aria-label={discount.dismiss}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10 px-6 pb-6 pt-10 text-center">
              <motion.div
                className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-pink-600 shadow-xl shadow-pink-950/20"
                initial={shouldReduceMotion ? false : { rotate: -8, scale: 0.8 }}
                animate={shouldReduceMotion ? { scale: 1 } : { rotate: [0, -5, 5, 0], scale: 1 }}
                transition={{ delay: 0.12, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
              >
                <Gift className="h-9 w-9" />
              </motion.div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-pink-600 dark:bg-pink-500/10 dark:text-pink-300">
                <Sparkles className="h-3.5 w-3.5" />
                {discount.badge}
              </div>

              <h2 id="discount-popup-title" className="text-4xl font-display font-bold text-slate-950 dark:text-white">
                {discount.title}
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
                {discount.description}
              </p>

              <div className="mt-5 rounded-2xl border border-pink-100 bg-pink-50/70 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-pink-500/20 dark:bg-pink-500/10 dark:text-slate-200">
                {discount.window}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  onClick={() => setIsVisible(false)}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition-transform hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                >
                  {discount.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsVisible(false)}
                  className="min-h-12 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-pink-400 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                >
                  {discount.later}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
