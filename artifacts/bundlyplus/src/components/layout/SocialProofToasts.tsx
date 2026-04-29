import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, MapPin } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const NAMES_EN = [
  { name: 'Hala', city: 'Beirut' },
  { name: 'Rami', city: 'Tripoli' },
  { name: 'Layla', city: 'Saida' },
  { name: 'Karim', city: 'Jounieh' },
  { name: 'Nour', city: 'Zahle' },
  { name: 'Tarek', city: 'Tyre' },
  { name: 'Yara', city: 'Byblos' },
  { name: 'Omar', city: 'Baabda' },
  { name: 'Maya', city: 'Aley' },
  { name: 'Ziad', city: 'Batroun' },
];

const NAMES_AR = [
  { name: 'هلا', city: 'بيروت' },
  { name: 'رامي', city: 'طرابلس' },
  { name: 'ليلى', city: 'صيدا' },
  { name: 'كريم', city: 'جونية' },
  { name: 'نور', city: 'زحلة' },
  { name: 'طارق', city: 'صور' },
  { name: 'يارا', city: 'جبيل' },
  { name: 'عمر', city: 'بعبدا' },
  { name: 'مايا', city: 'عاليه' },
  { name: 'زياد', city: 'البترون' },
];

const PRODUCTS = [
  'Netflix Premium',
  'Spotify Premium',
  'ChatGPT Plus',
  'Shahid VIP',
  'Anghami Plus',
  'YouTube Premium',
  'Adobe Creative Cloud',
  'Disney+',
  'OSN+',
  'Canva Pro',
  'Apple TV+',
  'Midjourney',
  'Notion AI',
];

interface ToastData {
  id: number;
  who: string;
  city: string;
  product: string;
  ago: number;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function SocialProofToasts() {
  const { lang, isRTL } = useI18n();
  const [toast, setToast] = useState<ToastData | null>(null);
  const isAr = lang === 'ar';

  useEffect(() => {
    let alive = true;
    let scheduleTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;
    let nextId = 1;

    const scheduleNext = (initial = false) => {
      const delay = initial ? 8000 : 25000 + Math.random() * 20000;
      scheduleTimer = setTimeout(() => {
        if (!alive) return;
        const person = isAr ? pick(NAMES_AR) : pick(NAMES_EN);
        setToast({
          id: nextId++,
          who: person.name,
          city: person.city,
          product: pick(PRODUCTS),
          ago: Math.floor(Math.random() * 8) + 1,
        });
        hideTimer = setTimeout(() => {
          if (alive) setToast(null);
        }, 6000);
        scheduleNext(false);
      }, delay);
    };

    scheduleNext(true);

    return () => {
      alive = false;
      clearTimeout(scheduleTimer);
      clearTimeout(hideTimer);
    };
  }, [isAr]);

  const minAgo = (n: number) => (isAr ? `قبل ${n} د` : `${n}m ago`);
  const just = isAr ? 'اشترى' : 'just got';
  const inText = isAr ? 'في' : 'in';

  return (
    <div
      className={`fixed z-50 bottom-28 md:bottom-6 ${isRTL ? 'right-4' : 'left-4'} pointer-events-none`}
      aria-live="polite"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto max-w-[88vw] sm:max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40 px-4 py-3 flex items-center gap-3"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white">
                <ShoppingBag size={16} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                <span className="text-pink-600 dark:text-pink-400">{toast.who}</span>{' '}
                <span className="font-normal text-slate-500 dark:text-slate-400 text-xs">
                  <MapPin className="inline w-3 h-3 -mt-0.5 mx-0.5" />
                  {toast.city}
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 truncate">
                {just} <span className="font-semibold text-slate-800 dark:text-slate-100">{toast.product}</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap shrink-0">
              {minAgo(toast.ago)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
