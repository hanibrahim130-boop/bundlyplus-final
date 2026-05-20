import React from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Seo } from "@/components/seo/Seo";

const POSTS: Record<string, { title: string; description: string; body: React.ReactNode }> = {
  "chatgpt-plus-subscription-best-deals": {
    title: "ChatGPT Plus Subscription: Best Deals & Worldwide Access (2026)",
    description: "Get ChatGPT Plus for $6.99/month instead of $20. Instant delivery, worldwide access, multiple payment methods.",
    body: (
      <>
        <p className="lead text-lg text-slate-600 dark:text-slate-300 mb-6">
          ChatGPT Plus normally costs $20/month directly from OpenAI. Through BundlyPlus, get it for <strong>$6.99/month</strong> — instant access via WhatsApp.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Why Get ChatGPT Plus from BundlyPlus?</h2>
        <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-300">
          <li><strong>Save 65%</strong> — pay $6.99 instead of $20</li>
          <li><strong>Instant delivery</strong> — no waiting, no credit card needed</li>
          <li><strong>Works worldwide</strong></li>
          <li><strong>Pay your way</strong> — Card, Whish Money, OMT, Bank Transfer, MoneyGram</li>
          <li><strong>25-day guarantee</strong></li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">What You Get</h2>
        <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-300">
          <li>GPT-4o and GPT-5 access</li>
          <li>Priority during peak times</li>
          <li>DALL·E image generation</li>
          <li>Advanced data analysis</li>
          <li>2x faster response times</li>
        </ul>

        <div className="mt-8 flex gap-4">
          <a href="/products/chatgpt-plus" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold">
            Subscribe to ChatGPT Plus
          </a>
          <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold">
            Chat on WhatsApp
          </a>
        </div>
      </>
    ),
  },

  "how-to-get-netflix-premium-cheap-worldwide": {
    title: "How to Get Netflix Premium Cheap Worldwide (2026 Guide)",
    description: "Save up to 80% on Netflix Premium. Compare prices, payment methods, and instant delivery options available worldwide.",
    body: (
      <>
        <p className="lead text-lg text-slate-600 dark:text-slate-300 mb-6">
          Netflix Premium costs $15–$23/month in most countries when subscribed directly. But with BundlyPlus, you can get Netflix Premium for as low as <strong>$4.99/month</strong> — saving up to 80%.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Why BundlyPlus?</h2>
        <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-300">
          <li><strong>Instant WhatsApp delivery</strong> — get your account in minutes</li>
          <li><strong>Global access</strong> — works worldwide</li>
          <li><strong>Multiple payment options</strong> — Card, Whish Money, OMT, Bank Transfer, MoneyGram</li>
          <li><strong>25-day money-back guarantee</strong></li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">How It Works</h2>
        <ol className="space-y-2 list-decimal pl-5 text-slate-600 dark:text-slate-300">
          <li>Browse our Netflix Premium listing</li>
          <li>Click "Get on WhatsApp" to message us</li>
          <li>Choose your payment method</li>
          <li>Receive your login details within 5 minutes</li>
        </ol>

        <div className="mt-8 flex gap-4">
          <a href="/products/netflix-premium" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold">
            Browse Netflix Plans
          </a>
          <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold">
            Chat on WhatsApp
          </a>
        </div>
      </>
    ),
  },
};

export default function BlogPost() {
  const [, params] = useRoute<{ slug: string }>("/blog/:slug");
  const slug = params?.slug;

  if (!slug || !POSTS[slug]) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <a href="/blog" className="text-pink-500 hover:underline">← Back to blog</a>
      </div>
    );
  }

  const post = POSTS[slug];

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Seo title={post.title} description={post.description} canonical={`/blog/${slug}`} />

      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-pink-500 mb-6 transition-colors">
        <ArrowLeft size={14} />
        Back to blog
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">{post.title}</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        {post.body}
      </div>
    </article>
  );
}
