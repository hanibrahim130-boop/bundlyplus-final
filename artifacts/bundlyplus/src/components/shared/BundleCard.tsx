import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, ShoppingCart } from 'lucide-react';
import { Bundle } from '@/types';
import { useCart } from '@/hooks/use-cart';
import { indexedGradients } from '@/lib/brand-theme';
import { useI18n } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';

export function BundleCard({ bundle, index = 0 }: { bundle: Bundle, index?: number }) {
  const { addToCart, isInCart } = useCart();
  const { t } = useI18n();
  const { format } = useCurrency();
  const inCart = isInCart(bundle.id);
  const saveAmount = bundle.originalPrice - bundle.price;
  const savePercent = Math.round((saveAmount / bundle.originalPrice) * 100);
  const gradient = indexedGradients[index % indexedGradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`glass-card rounded-2xl overflow-hidden flex flex-col relative h-full ${inCart ? 'ring-2 ring-pink-400/50' : ''}`}
    >
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-orange-300/30 to-pink-300/30 rounded-full blur-2xl pointer-events-none" />

      <div className={`h-20 bg-gradient-to-br ${gradient} flex items-center justify-center relative`} dir="ltr">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center shadow-lg border border-white/30">
          <ShoppingBag size={22} />
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          {inCart && (
            <span className="bg-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Check size={10} strokeWidth={3} />
              {t.bundleCard.inCart}
            </span>
          )}
          <div className="bg-white/90 backdrop-blur-sm text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {t.bundleCard.save} {savePercent}%
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow relative z-10">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 font-display leading-snug" dir="auto">{bundle.name}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-5 line-clamp-2" dir="auto">{bundle.description}</p>

        <div className="mb-5 pb-5 border-b border-slate-200/50 dark:border-slate-700/50 flex items-end gap-3">
          <div className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100 tabular-nums-p">
            {format(bundle.price)}
          </div>
          <div className="text-slate-400 dark:text-slate-500 line-through text-lg mb-0.5 font-medium tabular-nums-p">
            {format(bundle.originalPrice)}
          </div>
        </div>

        <ul className="space-y-2.5 mb-6 flex-grow" dir="auto">
          {bundle.features.map((feature, i) => (
            <li key={i} className="flex items-start text-sm text-slate-600 dark:text-slate-300 gap-2" dir="ltr">
              <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 mt-0.5`}>
                <Check size={12} className="text-white" />
              </div>
              <span dir="auto">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => addToCart(bundle, 'bundle')}
          className={`w-full py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px] ${
            inCart
              ? 'bg-pink-500 text-white shadow-pink-500/25'
              : `bg-gradient-to-r ${gradient} text-white hover:shadow-pink-500/25`
          }`}
        >
          {inCart ? (
            <>
              <Check size={16} />
              {t.bundleCard.addAnother}
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              {t.bundleCard.addToCart}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
