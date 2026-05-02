import React from 'react';
import { CheckCircle2, Clock3, KeyRound, RefreshCw, ShieldCheck } from 'lucide-react';
import { Product } from '@/types';
import { useCurrency } from '@/lib/currency';
import { useI18n } from '@/lib/i18n';
import { useUser } from '@clerk/react';
import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ProductDetailsDialogProps {
  product: Product;
  trigger: React.ReactNode;
}

function formatDuration(duration?: string) {
  return duration?.toLowerCase().replace('_', ' ') || 'month';
}

export function ProductDetailsDialog({ product, trigger }: ProductDetailsDialogProps) {
  const { format, currency } = useCurrency();
  const { t, lang } = useI18n();
  const { isSignedIn } = useUser();
  const accountType = product.account_type || t.productDetails.subscription;

  const handleOpenChange = (open: boolean) => {
    if (!open) return;
    trackEvent(ANALYTICS_EVENTS.PRODUCT_VIEWED, {
      product_id: product.id,
      product_name: product.name,
      price_usd: product.price,
      currency,
      language: lang,
      category: product.category,
      account_type: product.account_type,
      signed_in: !!isSignedIn,
    });
  };
  const accountTypeHelp = product.account_type === 'Private'
    ? t.productDetails.privateAccess
    : product.account_type === 'Shared'
      ? t.productDetails.sharedAccess
      : t.productDetails.accessConfirmed;
  const features = product.features || [];

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto rounded-2xl border-slate-200 bg-white p-0 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:max-w-xl">
        <div className="p-6 sm:p-7">
          <DialogHeader className="pe-8 text-start">
            <DialogTitle className="text-2xl font-display font-bold leading-tight text-slate-900 dark:text-white">
              {product.name}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {product.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <KeyRound className="h-4 w-4" />
                {t.productDetails.account}
              </div>
              <div className="mt-2 text-base font-bold text-slate-900 dark:text-white">{accountType}</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {accountTypeHelp}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <RefreshCw className="h-4 w-4" />
                {t.productDetails.renewal}
              </div>
              <div className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                {format(product.price)} / {formatDuration(product.duration)}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {t.productDetails.renewalHelp}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-800/70 dark:bg-emerald-900/20 dark:text-emerald-100">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <div className="text-sm font-bold">{t.productDetails.fastDelivery}</div>
                <p className="mt-1 text-xs leading-relaxed text-emerald-700 dark:text-emerald-200/80">
                  {t.productDetails.fastDeliveryHelp}
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-pink-200 bg-pink-50 p-4 text-pink-900 dark:border-pink-800/70 dark:bg-pink-900/20 dark:text-pink-100">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <div className="text-sm font-bold">{t.productDetails.guarantee}</div>
                <p className="mt-1 text-xs leading-relaxed text-pink-700 dark:text-pink-200/80">
                  {t.productDetails.guaranteeHelp}
                </p>
              </div>
            </div>
          </div>

          {features.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.productDetails.includedFeatures}</h4>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <li key={`${feature}-${index}`} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
