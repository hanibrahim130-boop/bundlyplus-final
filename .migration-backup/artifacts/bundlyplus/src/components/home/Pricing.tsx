import React from 'react';
import { Check, Star } from 'lucide-react';
import { useSettings } from '@/lib/settings';
import { Section } from '@/components/shared/Section';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion/ScrollReveal';
import { ProductGridSkeleton } from '@/components/shared/ProductGridSkeleton';
import { useI18n } from '@/lib/i18n';

export function Pricing() {
  const { pricingTiers, isLoading } = useSettings();
  const { t } = useI18n();

  if (isLoading) {
    return (
      <Section>
        <ProductGridSkeleton count={3} />
      </Section>
    );
  }

  if (pricingTiers.length === 0) return null;

  return (
    <Section>
      <ScrollReveal className="text-center mb-16">
        <SectionHeader subtitle={t.pricing.subtitle} title={t.pricing.title} />
      </ScrollReveal>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch" staggerDelay={0.12}>
        {pricingTiers.map((tier) => {
          const isPopular = tier.popular;
          return (
            <StaggerItem key={tier.id} animation="scaleIn">
              <div
                className={`relative rounded-3xl p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 ${
                  isPopular
                    ? 'bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white shadow-2xl shadow-slate-900/20 dark:shadow-black/40 md:-mt-4 md:mb-4 border border-slate-700 dark:border-slate-600 hover:shadow-3xl'
                    : 'glass-card'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center shadow-lg gap-1">
                    <Star size={12} className="fill-current" /> {t.pricing.mostPopular}
                  </div>
                )}

                <div className="mb-8">
                  <h4 className={`text-xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>{tier.name}</h4>
                  <p className={`text-sm h-10 ${isPopular ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>{tier.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-end mb-2 gap-1">
                    <span className={`text-5xl font-display font-bold ${isPopular ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>${tier.price}</span>
                    <span className={`text-lg mb-1 font-medium ${isPopular ? 'text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>{t.pricing.perMonth}</span>
                  </div>
                  <div className={`text-sm ${isPopular ? 'text-pink-400' : 'text-pink-500 dark:text-pink-400'} font-medium`}>
                    {t.pricing.save} {tier.savePct}% ({t.pricing.was} ${tier.wasPrice})
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {tier.perks.map((perk: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check size={18} className={`shrink-0 mt-0.5 ${isPopular ? 'text-pink-400' : 'text-pink-500 dark:text-pink-400'}`} />
                      <span className={`text-sm ${isPopular ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'}`}>{perk}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/products"
                  className={`w-full py-4 rounded-xl font-bold text-center transition-all duration-300 block ${
                    isPopular
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:shadow-pink-500/30 hover:-translate-y-1'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {t.pricing.choose} {tier.name}
                </a>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </Section>
  );
}
