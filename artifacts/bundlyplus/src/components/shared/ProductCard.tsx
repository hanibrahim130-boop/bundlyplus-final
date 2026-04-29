import React, { useState } from 'react';
import { ShoppingCart, Check, Heart } from 'lucide-react';
import { Product } from '@/types';
import { getBrandGradient, getInitials } from '@/lib/brand-theme';
import { getLogoUrl } from '@/utils/logoUtils';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { useI18n } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = React.memo(function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { t } = useI18n();
  const { format } = useCurrency();
  const wishlisted = isWishlisted(product.id);
  const [imgFailed, setImgFailed] = useState(false);
  const inCart = isInCart(product.id);

  const logoUrl = product.image_url || getLogoUrl(product.name);
  const initials = getInitials(product.name);
  const gradient = getBrandGradient(product.name);

  const handleImgError = () => setImgFailed(true);

  const accountTypeLabel = product.account_type === 'Private'
    ? t.productCard.private
    : product.account_type === 'Shared'
      ? t.productCard.shared
      : product.account_type;

  const accountTypeStyles: Record<string, { bg: string; text: string }> = {
    'Private': { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
    'Shared': { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
  };
  const accStyle = product.account_type ? accountTypeStyles[product.account_type] : null;

  return (
    <div className={`solid-card rounded-2xl overflow-hidden flex flex-col relative group h-full animate-[fadeIn_0.35s_ease-out] ${inCart ? 'ring-1 ring-pink-400' : ''}`}>
      <div className="h-32 flex items-center justify-center bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-700/60 relative overflow-hidden">
        {inCart && (
          <span className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            <span className="text-[10px] font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider">{t.productCard.inCart}</span>
          </span>
        )}
        {product.hot && !inCart && (
          <span className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">{t.productCard.hot}</span>
          </span>
        )}
        {product.category && (
          <div className="absolute top-3 right-3 z-10">
            <CategoryBadge label={product.category} />
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className={`absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border shadow-sm hover:scale-110 active:scale-95 ${
            wishlisted
              ? 'bg-pink-500 border-pink-400 text-white shadow-pink-500/30'
              : 'bg-white/80 dark:bg-slate-800/80 border-white/80 dark:border-white/10 text-slate-400 hover:text-pink-500 dark:text-slate-500 dark:hover:text-pink-400'
          }`}
        >
          <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} strokeWidth={2.2} />
        </button>
        <div className="relative">
          <div className={`absolute -inset-2 rounded-3xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
          <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 bg-white dark:bg-white shadow-[0_4px_20px_-4px_rgba(15,23,42,0.15)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] ring-1 ring-slate-200/60 dark:ring-white/5 p-3">
            {logoUrl && !imgFailed ? (
              <img
                src={logoUrl}
                className="w-full h-full object-contain"
                alt={product.name}
                width={80}
                height={80}
                loading="lazy"
                onError={handleImgError}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xl rounded-xl shadow-inner`}>
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-slate-800 dark:text-slate-100 text-base font-bold mb-2 tracking-tight leading-snug line-clamp-2">{product.name}</h3>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {accStyle && (
            <span className={`${accStyle.bg} ${accStyle.text} text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full`}>
              {accountTypeLabel}
            </span>
          )}
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {product.features && product.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.features.slice(0, 3).map((feature, i) => (
              <span key={i} className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700/60">
                {feature}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100/60 dark:border-slate-700/60 w-full flex items-center justify-between">
          <div>
            <div className="text-2xl text-slate-800 dark:text-slate-100 font-display font-bold tabular-nums-p">
              {format(product.price)}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              /{product.duration?.toLowerCase().replace('_', ' ') || 'month'}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 'product')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              inCart
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-pink-500 dark:hover:bg-pink-500 dark:hover:text-white hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5'
            }`}
            aria-label={inCart ? `Add another ${product.name}` : `Add ${product.name} to cart`}
          >
            {inCart ? <Check size={14} /> : <ShoppingCart size={14} />}
            {inCart ? t.productCard.added : t.productCard.add}
          </button>
        </div>
      </div>
    </div>
  );
});
