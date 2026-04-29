import React, { lazy, Suspense } from 'react';
import { Link } from 'wouter';
import { Hero } from '@/components/home/Hero';
import { LocalTrust } from '@/components/home/LocalTrust';
import { MadeForMENA } from '@/components/home/MadeForMENA';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductGridSkeleton } from '@/components/shared/ProductGridSkeleton';
import { Section } from '@/components/shared/Section';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { useProducts } from '@/lib/firestore-hooks';
import { useSettings } from '@/lib/settings';
import { Product } from '@/types';
import { useI18n } from '@/lib/i18n';

const Pricing = lazy(() => import('@/components/home/Pricing').then((m) => ({ default: m.Pricing })));
const Testimonials = lazy(() => import('@/components/home/Testimonials').then((m) => ({ default: m.Testimonials })));
const FAQ = lazy(() => import('@/components/home/FAQ').then((m) => ({ default: m.FAQ })));

const SectionFallback = () => (
  <div className="py-16 flex justify-center">
    <div className="w-8 h-8 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
  </div>
);

export default function Home() {
  const { data: productsData = [], isLoading: productsLoading } = useProducts({ featured: true });
  const { siteSettings } = useSettings();
  const { t } = useI18n();

  const featuredProducts = (productsData as Product[]).slice(0, 8);

  return (
    <div className="pb-20">
      <Hero settings={siteSettings} />

      <Section>
        <ScrollReveal>
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-3">{t.home.topToolsLabel}</h2>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-slate-100">{t.home.topToolsTitle}</h3>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium hover:text-pink-600 dark:hover:text-pink-400 transition-colors group">
              {t.home.viewAll} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>

        {productsLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <ScrollReveal className="mt-10 text-center sm:hidden" delay={0.3}>
          <Link href="/products" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
            {t.home.viewAllProducts} <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>
      </Section>

      <LocalTrust />
      <MadeForMENA />
      <WhyChooseUs />
      <Suspense fallback={<SectionFallback />}>
        <Pricing />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FAQ />
      </Suspense>
    </div>
  );
}
