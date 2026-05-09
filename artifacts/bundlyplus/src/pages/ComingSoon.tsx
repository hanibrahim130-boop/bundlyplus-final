import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Package, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { useI18n } from '@/lib/i18n';
import { Seo } from '@/components/seo/Seo';

export default function ComingSoon() {
  const { t, isRTL } = useI18n();

  const hints = ['👕', '📱', '🎧', '👟', '⌚', '💻'];

  return (
    <>
      <Seo
        title="Coming Soon — New Products"
        description="BundlyPlus is expanding beyond digital subscriptions. Real products delivered to your door across Lebanon & MENA."
        canonical="/coming-soon"
        noIndex
      />
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center">
        <div className="max-w-3xl mx-auto text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full coming-soon-pill text-white text-sm font-bold mb-8"
          >
            <Sparkles size={16} />
            <span>{t.nav.comingSoon}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-display font-bold tracking-tight bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent mb-5"
          >
            {t.comingSoon.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-10"
          >
            {t.comingSoon.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-3 sm:gap-5 mb-10 text-3xl sm:text-4xl select-none"
            aria-hidden="true"
          >
            {hints.map((emoji, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: [0.35, 1, 0.35],
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 2.4,
                  delay: i * 0.25,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="drop-shadow-md filter blur-[1.5px]"
                title="?"
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="text-sm text-slate-500 dark:text-slate-400 italic mb-12 inline-flex items-center gap-2"
          >
            <Package size={14} className="text-pink-500" />
            {t.comingSoon.teaserText}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:opacity-90 transition-opacity"
            >
              {t.comingSoon.browseLive}
              <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
