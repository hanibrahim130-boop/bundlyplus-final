import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductGridSkeleton } from '@/components/shared/ProductGridSkeleton';
import { PageLayout } from '@/components/shared/PageLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { useProducts } from '@/lib/firestore-hooks';
import { Product } from '@/types';
import { useI18n } from '@/lib/i18n';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(val), 300);
  }, []);
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

      <div className="w-full max-w-3xl mx-auto mb-16 space-y-8 animate-[fadeIn_0.4s_ease-out]">
        <div className="relative group">
          <Search className="absolute start-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-pink-400 transition-colors" size={20} />
          <input
            type="text"
            placeholder={t.products.searchPlaceholder}
            defaultValue=""
            onChange={handleSearchChange}
            className="w-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm rounded-full py-4 md:py-5 ps-14 pe-6 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-pink-400 dark:focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 dark:focus:ring-pink-500/20 transition-all font-medium"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 min-h-[44px] ${
                selectedCategory === category
                  ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md shadow-slate-800/20 scale-105'
                  : 'bg-white/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700/80 hover:shadow-sm'
              }`}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 320px' }}>
              <ProductCard product={product} />
            </div>
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
      </div>
    </PageLayout>
  );
}
