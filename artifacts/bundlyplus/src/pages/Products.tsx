import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductGridSkeleton } from '@/components/shared/ProductGridSkeleton';
import { PageLayout } from '@/components/shared/PageLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { useProducts } from '@/lib/firestore-hooks';
import { Product } from '@/types';
import { useI18n } from '@/lib/i18n';
import { Seo } from '@/components/seo/Seo';

type AccountTypeFilter = 'All' | 'Private' | 'Shared';
type ProductSort = 'popular' | 'price-asc' | 'price-desc' | 'name';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAccountType, setSelectedAccountType] = useState<AccountTypeFilter>('All');
  const [sortBy, setSortBy] = useState<ProductSort>('popular');

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
    const query = searchQuery.trim().toLowerCase();

    const visibleProducts = (products as Product[]).filter(product => {
      const matchesSearch = !searchQuery ||
        product.name.toLowerCase().includes(query) ||
        (product.description || '').toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesAccountType = selectedAccountType === 'All' || product.account_type === selectedAccountType;
      return matchesSearch && matchesCategory && matchesAccountType;
    });

    return [...visibleProducts].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);

      const aPopular = Number(Boolean(a.hot || a.featured));
      const bPopular = Number(Boolean(b.hot || b.featured));
      if (aPopular !== bPopular) return bPopular - aPopular;
      return a.name.localeCompare(b.name);
    });
  }, [products, searchQuery, selectedCategory, selectedAccountType, sortBy]);

  const allLabel = t.products.all;
  const resultLabel = filteredProducts.length === 1
    ? t.products.resultSingular
    : t.products.resultPlural.replace('{count}', String(filteredProducts.length));

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
      <Seo
        title="All Products — Digital Subscriptions"
        description="Browse 50+ premium digital subscriptions: Netflix, Spotify, ChatGPT, Adobe & more. Best prices in Lebanon & MENA, instant WhatsApp delivery."
        canonical="/products"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Digital Subscriptions Catalog",
          "description": "Browse 50+ premium digital subscriptions at unbeatable prices",
          "url": "https://bundlyplus.com/products",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bundlyplus.com/" },
              { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://bundlyplus.com/products" }
            ]
          }
        }}
      />
      <PageHeader
        title={t.products.title}
        gradientWord={t.products.gradientWord}
        subtitle={t.products.subtitle}
      />

      <div className="w-full max-w-5xl mx-auto mb-12 space-y-6 animate-[fadeIn_0.4s_ease-out]">
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

        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" aria-label={t.products.accountTypeFilter}>
            {(['All', 'Private', 'Shared'] as AccountTypeFilter[]).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedAccountType(type)}
                className={`min-h-[44px] rounded-full px-4 text-sm font-semibold transition-all ${
                  selectedAccountType === type
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
                aria-pressed={selectedAccountType === type}
              >
                {type === 'All' ? t.products.allTypes : type === 'Private' ? t.productCard.private : t.productCard.shared}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <SlidersHorizontal className="h-4 w-4" />
              <span>{resultLabel}</span>
            </div>
            <label className="sr-only" htmlFor="product-sort">{t.products.sortProducts}</label>
            <select
              id="product-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as ProductSort)}
              className="min-h-[44px] rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-pink-500"
            >
              <option value="popular">{t.products.sortPopular}</option>
              <option value="price-asc">{t.products.sortPriceAsc}</option>
              <option value="price-desc">{t.products.sortPriceDesc}</option>
              <option value="name">{t.products.sortName}</option>
            </select>
          </div>
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
