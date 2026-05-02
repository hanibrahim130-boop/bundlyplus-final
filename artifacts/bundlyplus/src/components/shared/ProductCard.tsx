import React, { useState } from 'react';
import { ShoppingCart, Check, Heart, Info } from 'lucide-react';
import { Product } from '@/types';
import { getBrandGradient, getInitials } from '@/lib/brand-theme';
import { getLogoUrl } from '@/utils/logoUtils';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { ProductDetailsDialog } from '@/components/shared/ProductDetailsDialog';
import { useI18n } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';
import { useUser } from '@clerk/react';
import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = React.memo(function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { t, lang } = useI18n();
  const { format, currency } = useCurrency();
  const { isSignedIn } = useUser();
  const wishlisted = isWishlisted(product.id);
  const [imgFailed, setImgFailed] = useState(false);
  const inCart = isInCart(product.id);
  const isOutOfStock = !!product.out_of_stock;

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
        {isOutOfStock ? (
          <span className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">{t.productCard.outOfStock}</span>
          </span>
        ) : inCart ? (
          <span className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            <span className="text-[10px] font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider">{t.productCard.inCart}</span>
          </span>
        ) : product.hot ? (
          <span className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">{t.productCard.hot}</span>
          </span>
        ) : null}
        {product.category && (
          <div className="absolute top-3 right-3 z-10">
            <CategoryBadge label={product.category} />
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className={`absolute bottom-3 right-3 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 border shadow-sm hover:scale-110 active:scale-95 ${
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

        <ProductDetailsDialog
          product={product}
          trigger={
            <button
              type="button"
              className="mb-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-500/10 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-pink-500/40 dark:hover:bg-pink-500/10 dark:hover:text-pink-300"
              aria-label={t.productCard.viewDetails.replace('{name}', product.name)}
            >
              <Info size={16} />
              {t.productCard.details}
            </button>
          }
        />

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
            onClick={() => {
              if (!isOutOfStock) {
                addToCart(product, 'product');
                trackEvent(ANALYTICS_EVENTS.ADD_TO_CART, {
                  product_id: product.id,
                  product_name: product.name,
                  price_usd: product.price,
                  currency,
                  language: lang,
                  category: product.category,
                  account_type: product.account_type,
                  quantity: 1,
                  item_type: 'product',
                  signed_in: !!isSignedIn,
                });
              }
            }}
            disabled={isOutOfStock}
            className={`flex min-h-[44px] items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              isOutOfStock
                ? 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                : inCart
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-pink-500 dark:hover:bg-pink-500 dark:hover:text-white hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5'
            }`}
            aria-label={isOutOfStock ? `${product.name} is out of stock` : inCart ? `Add another ${product.name}` : `Add ${product.name} to cart`}
          >
            {isOutOfStock ? null : inCart ? <Check size={14} /> : <ShoppingCart size={14} />}
            {isOutOfStock ? t.productCard.outOfStock : inCart ? t.productCard.added : t.productCard.add}
          </button>
        </div>
      </div>
    </div>
  );
});
