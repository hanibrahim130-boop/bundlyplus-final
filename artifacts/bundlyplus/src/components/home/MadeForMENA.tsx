import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Bot, BrainCircuit, Sparkles, WandSparkles } from 'lucide-react';
import productsData from '@/data/products.json';
import { Product } from '@/types';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion/ScrollReveal';
import { ProductCard } from '@/components/shared/ProductCard';
import { useI18n } from '@/lib/i18n';

const FEATURED_AI_TOOLS = [
  'ChatGPT Plus',
  'Perplexity AI',
  'Midjourney',
  'Google Gemini Advanced',
  'GitHub Copilot Pro',
  'Cursor IDE Pro',
  'Notion AI',
  'Canva Pro',
];

const AI_NAME_PATTERN = /ai|chatgpt|gemini|copilot|midjourney|perplexity|cursor|notion|canva|grammarly|jasper|copy|writesonic|synthesia|runway|descript/i;

export function MadeForMENA() {
  const { isRTL } = useI18n();
  const all = productsData as unknown as Product[];
  const curatedAiTools = FEATURED_AI_TOOLS
    .map(name => all.find(p => p.name === name))
    .filter((p): p is Product => Boolean(p));

  const fallbackAiTools = all.filter(product =>
    product.category === 'Software & AI' &&
    AI_NAME_PATTERN.test(`${product.name} ${product.description} ${(product.features || []).join(' ')}`) &&
    !curatedAiTools.some(curated => curated.id === product.id)
  );

  const aiProducts = [...curatedAiTools, ...fallbackAiTools].slice(0, 8);

  if (aiProducts.length === 0) return null;

  const viewAll = 'Explore all AI tools';

  return (
    <section className="relative w-full px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-700 dark:text-cyan-300 mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI picks for work, code, content, and design</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-800 dark:text-slate-100 leading-[1.05] tracking-tight">
                Best AI tools
                <span className="block text-gradient mt-1">ready in minutes.</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl text-sm sm:text-base leading-relaxed">
                Premium AI subscriptions for writing, research, coding, design, and video creation, curated from the software catalog and priced for easy monthly access.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { icon: Bot, label: 'Chat assistants' },
                  { icon: BrainCircuit, label: 'Research and coding' },
                  { icon: WandSparkles, label: 'Creative generation' },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    <Icon className="h-3.5 w-3.5 text-pink-500" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all whitespace-nowrap shadow-sm"
            >
              {viewAll} <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5" staggerDelay={0.08}>
          {aiProducts.map((product, i) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal className="mt-8 text-center md:hidden" delay={0.2}>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            {viewAll} <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
