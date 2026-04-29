import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductGridSkeleton } from '@/components/shared/ProductGridSkeleton';
import { PageLayout } from '@/components/shared/PageLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { useProducts } from '@/lib/firestore-hooks';
import { Product } from '@/types';
import { fadeUp, staggerContainerFast, DURATION, EASE } from '@/lib/motion';
import { useI18n } from '@/lib/i18n';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { t } = useI18n();

  const { data: products = [], isLoading } = useProducts();

  const categories = useMemo(
    () => ['All', ...Array.from(new Set((products as Product[]).map(p => p.category).filter(Boolean)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return (products as Product[]).filter(product => {
      const matchesSearch = !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const allLabel = t.products.all;

  const getCategoryLabel = (cat: string) => cat === 'All' ? allLabel : cat;

  const isSelectedAll = selectedCategory === 'All';

  if (isLoading) {
    return (
      <PageLayout>
        <PageHeader title={t.products.title} gradientWord={t.products.gradientWord} subtitle={t.products.subtitle} />
        <ProductGridSkeleton count={8} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={t.products.title}
        gradientWord={t.products.gradientWord}
        subtitle={t.products.subtitle}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.normal, delay: 0.15, ease: EASE.smooth }}
        className="w-full max-w-3xl mx-auto mb-16 space-y-8"
      >
        <div className="relative group">
          <Search className="absolute start-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-pink-400 transition-colors" size={20} />
          <input
            type="text"
            placeholder={t.products.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-sm rounded-full py-4 md:py-5 ps-14 pe-6 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-pink-400 dark:focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 dark:focus:ring-pink-500/20 transition-all font-medium"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.normal, delay: 0.25 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 min-h-[44px] ${
                selectedCategory === category
                  ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md shadow-slate-800/20 scale-105'
                  : 'bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-sm hover:scale-[1.02]'
              }`}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggerContainerFast}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch"
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <motion.div key={product.id} variants={fadeUp} transition={{ duration: DURATION.normal, ease: EASE.smooth }}>
              <ProductCard product={product} index={0} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              icon={<Search className="w-10 h-10 text-slate-300 dark:text-slate-600" />}
              title={t.products.noResults}
              description={t.products.noResultsDesc}
            />
          </div>
        )}
      </motion.div>
    </PageLayout>
  );
}
