import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, Sparkles, Zap, ShieldCheck, Users, MessageCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';
import { getLogoUrl } from '@/utils/logoUtils';
import { getBrandGradient, getInitials } from '@/lib/brand-theme';
import { useIsMobile } from '@/hooks/use-mobile';
import { SiteSettings } from '@/types';

interface HeroProps {
  settings?: SiteSettings | null;
}

interface MarqueeItem {
  name: string;
  price: string;
  tag?: string;
}

const MARQUEE_TOP: MarqueeItem[] = [
  { name: 'Netflix Premium', price: '4.99', tag: '★ Top' },
  { name: 'Spotify Premium', price: '4.99' },
  { name: 'ChatGPT Plus', price: '6.99', tag: 'AI' },
  { name: 'YouTube Premium', price: '4.99' },
  { name: 'Adobe Creative Cloud', price: '9.99' },
  { name: 'Disney+', price: '4.49' },
  { name: 'Canva Pro', price: '4.99' },
  { name: 'Apple TV+', price: '4.49' },
];

const MARQUEE_BOTTOM: MarqueeItem[] = [
  { name: 'Midjourney', price: '7.99', tag: 'AI' },
  { name: 'Notion AI', price: '3.49' },
  { name: 'Grammarly Premium', price: '4.99' },
  { name: 'GitHub Copilot Pro', price: '5.99' },
  { name: 'Figma Professional', price: '4.99' },
  { name: 'Perplexity Pro', price: '7.99' },
  { name: 'Tidal HiFi', price: '4.99' },
  { name: 'Max (HBO Max)', price: '5.49' },
];

function BrandLogo({ name }: { name: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const url = getLogoUrl(name);

  if (!url || imgFailed) {
    const gradient = getBrandGradient(name);
    return (
      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xs rounded-lg`}>
        {getInitials(name)}
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={name}
      className="w-full h-full object-contain"
      onError={() => setImgFailed(true)}
      loading="lazy"
    />
  );
}

function MarqueeRow({ items, reverse = false, speed = 40, isRTL = false, isMobile = false }: { items: MarqueeItem[]; reverse?: boolean; speed?: number; isRTL?: boolean; isMobile?: boolean }) {
  const { format } = useCurrency();
  // Duplicate items for seamless loop. In RTL, flip the natural direction.
  const loop = [...items, ...items];
  const goLeft = isRTL ? !reverse : reverse;

  // On mobile: use CSS animation (GPU-composited) instead of Framer Motion (JS main thread)
  const marqueeStyle = isMobile
    ? {
        animation: `${goLeft ? 'marquee-reverse' : 'marquee'} ${speed}s linear infinite`,
      }
    : undefined;

  const content = loop.map((item, idx) => (
    <div
      key={`${item.name}-${idx}`}
      className={`group flex items-center gap-2.5 sm:gap-3 ${isMobile ? 'bg-white/90 dark:bg-slate-800/80 shadow-sm' : 'bg-white/80 dark:bg-slate-800/70 backdrop-blur-md shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300'} border border-white/60 dark:border-slate-700/60 rounded-2xl pl-2.5 pr-4 sm:pl-3 sm:pr-5 py-2.5 sm:py-3 cursor-default whitespace-nowrap`}
    >
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white p-1.5 shadow-sm shrink-0 flex items-center justify-center">
        <BrandLogo name={item.name} />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
          {item.name.replace(' – Private Account', '').replace(' Premium', '').replace(' Pro', '').replace(' Professional', '').replace(' Plus', '').replace(' Creative Cloud', ' CC').replace(' (HBO Max)', '')}
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold text-pink-600 dark:text-pink-400">
          {format(parseFloat(item.price))}<span className="text-slate-400 dark:text-slate-500 font-medium">/mo</span>
        </span>
      </div>
      {item.tag && (
        <span className="hidden sm:inline-flex text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-pink-500 to-orange-500 text-white px-1.5 py-0.5 rounded-full">
          {item.tag}
        </span>
      )}
    </div>
  ));

  return (
    <div dir="ltr" className="relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
      {isMobile ? (
        <div className="flex gap-3 w-max" style={marqueeStyle}>
          {content}
        </div>
      ) : (
        <motion.div
          className="flex gap-3 sm:gap-4 w-max"
          animate={{ x: goLeft ? ['-50%', '0%'] : ['0%', '-50%'] }}
          transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
        >
          {content}
        </motion.div>
      )}
    </div>
  );
}

export function Hero({ settings }: HeroProps) {
  const { t, lang } = useI18n();
  const isRTL = lang === 'ar';
  const isMobile = useIsMobile();
  const rotatingWords = t.hero.rotating as readonly string[];
  const [wordIdx, setWordIdx] = useState(0);
  const [liveCount, setLiveCount] = useState(247);

  // Rotate the highlighted word every 2.2s
  useEffect(() => {
    const id = setInterval(() => {
      setWordIdx((i) => (i + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(id);
  }, [rotatingWords.length]);

  // Tick the live counter every 6-12s for a "real" feel
  useEffect(() => {
    let alive = true;
    const tick = () => {
      if (!alive) return;
      setLiveCount((c) => c + Math.floor(Math.random() * 2) + 1);
      setTimeout(tick, 6000 + Math.random() * 6000);
    };
    const id = setTimeout(tick, 4000);
    return () => { alive = false; clearTimeout(id); };
  }, []);

  const whatsappNumber = settings?.whatsapp_number || '96176171003';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <section className="relative overflow-hidden pt-32 sm:pt-36 pb-12 sm:pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Aurora animated background — disabled on mobile (Background.tsx already provides blobs) */}
      {!isMobile && (
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <motion.div
            className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full opacity-60 dark:opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, #fbcfe8 0%, transparent 70%)' }}
            animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-[20%] right-[-15%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full opacity-60 dark:opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, #c7d2fe 0%, transparent 70%)' }}
            animate={{ x: [0, -25, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.div
            className="absolute bottom-[-20%] left-[20%] w-[65vw] h-[65vw] max-w-[750px] max-h-[750px] rounded-full opacity-50 dark:opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, #fde68a 0%, transparent 70%)' }}
            animate={{ x: [0, 40, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
            style={{
              backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              color: '#0f172a',
            }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Live trending pill */}
        <div
          className={`flex justify-center mb-5 sm:mb-7 ${isMobile ? 'animate-[fadeIn_0.4s_ease-out]' : ''}`}
          {...(!isMobile ? {} : {})}
        >
          <div className={`inline-flex items-center gap-2 sm:gap-2.5 border rounded-full pl-2 pr-3 sm:pr-4 py-1.5 ${isMobile ? 'bg-white/95 dark:bg-slate-800/95 border-white/80 dark:border-slate-700/60 shadow-sm' : 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-white/80 dark:border-slate-700/60 shadow-md'}`}>
            <span className="relative flex w-2 h-2 shrink-0">
              <span className="animate-ping absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex w-2 h-2 rounded-full bg-green-500"></span>
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {liveCount.toLocaleString()}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium">
              {t.hero.live}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 ms-1 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-pink-500 to-orange-500 text-white px-2 py-0.5 rounded-full">
              <Sparkles size={10} strokeWidth={2.5} />
              {t.hero.badge}
            </span>
          </div>
        </div>

        {/* Headline with rotating word */}
        <div className="text-center max-w-4xl mx-auto">
          <h1
            className={`font-display font-black text-slate-900 dark:text-white leading-[0.95] tracking-tight ${isMobile ? 'animate-[fadeIn_0.5s_ease-out]' : ''}`}
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
          >
            <span className="block">{t.hero.line1}</span>
            <span className="block mt-1 sm:mt-2">
              <span>{t.hero.line2}</span>{' '}
              <span className="relative inline-grid overflow-hidden" style={{ verticalAlign: 'baseline' }}>
                {/* Hidden spacers — the longest word sets the width */}
                {rotatingWords.map((w: string) => (
                  <span key={w} className="invisible col-start-1 row-start-1" aria-hidden="true">{w}</span>
                ))}
                {/* Animated visible word */}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWords[wordIdx]}
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-110%', opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="col-start-1 row-start-1 text-gradient-brand"
                  >
                    {rotatingWords[wordIdx]}
                  </motion.span>
                </AnimatePresence>
                <motion.span
                  className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-1 sm:h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 opacity-40"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                />
              </span>
            </span>
            {t.hero.line3 && <span className="block mt-1 sm:mt-2">{t.hero.line3}</span>}
          </h1>

          {/* Subtitle */}
          <p
            className={`mt-5 sm:mt-7 text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-snug max-w-2xl mx-auto px-2 ${isMobile ? 'animate-[fadeIn_0.5s_ease-out_0.1s_both]' : ''}`}
          >
            {t.hero.subtitle}
          </p>

          {/* CTAs */}
          <div
            className={`mt-7 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2 ${isMobile ? 'animate-[fadeIn_0.5s_ease-out_0.15s_both]' : ''}`}
          >
            <Link
              href="/products"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-pink-500/40 hover:bg-pink-500 dark:hover:bg-pink-500 dark:hover:text-white hover:-translate-y-0.5 transition-all duration-300"
            >
              {t.hero.cta}
              <ArrowRight size={16} className={`group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`group w-full sm:w-auto inline-flex items-center justify-center gap-2 border text-slate-800 dark:text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full ${isMobile ? 'bg-white/95 dark:bg-slate-800/95 border-white/80 dark:border-slate-700 shadow-sm' : 'bg-white/80 dark:bg-slate-800/70 backdrop-blur-md border-white/80 dark:border-slate-700 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300'}`}
            >
              <MessageCircle size={16} className="text-green-500" />
              {t.hero.getOnWhatsApp}
            </a>
          </div>

          {/* Trust stats */}
          <div
            className={`mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-7 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium px-2 ${isMobile ? 'animate-[fadeIn_0.5s_ease-out_0.2s_both]' : ''}`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Users size={14} className="text-pink-500" />
              {t.hero.users}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              {t.hero.secure}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" />
              {t.hero.setup}
            </span>
          </div>
        </div>

        {/* Marquee section */}
        <div
          className={`mt-10 sm:mt-14 ${isMobile ? 'animate-[fadeIn_0.6s_ease-out_0.25s_both]' : ''}`}
        >
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-5">
            <span className="h-px w-8 bg-slate-300 dark:bg-slate-600" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {t.hero.marqueeLabel}
            </span>
            <span className="h-px w-8 bg-slate-300 dark:bg-slate-600" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <MarqueeRow items={MARQUEE_TOP} speed={45} isRTL={isRTL} isMobile={isMobile} />
            <MarqueeRow items={MARQUEE_BOTTOM} reverse speed={50} isRTL={isRTL} isMobile={isMobile} />
          </div>
        </div>
      </div>
    </section>
  );
}
