import React from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Seo } from "@/components/seo/Seo";

const POSTS: Record<string, { title: string; description: string; date: string; body: React.ReactNode }> = {
  "how-to-pay-for-subscriptions-in-lebanon": {
    title: "How to Pay for Netflix, Spotify & ChatGPT in Lebanon (2026): Whish, OMT & More",
    description: "Every way to pay for premium subscriptions from Lebanon — Whish Money, OMT, bank transfer, card, and MoneyGram — with instant WhatsApp delivery.",
    date: "2026-08-01",
    body: (
      <>
        <p className="lead text-lg text-slate-600 dark:text-slate-300 mb-6">
          Paying for Netflix, Spotify, or ChatGPT Plus from Lebanon is harder than it should be — international cards get declined, and dollar payments are complicated. BundlyPlus solves this: pay locally with <strong>Whish Money, OMT, bank transfer, card, or MoneyGram</strong>, and get your subscription delivered on WhatsApp in minutes.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">All Payment Methods We Accept</h2>
        <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-300">
          <li><strong>Whish Money</strong> — the fastest option in Lebanon; send from any Whish agent or the app</li>
          <li><strong>OMT</strong> — pay cash at any OMT branch across Lebanon</li>
          <li><strong>Bank transfer</strong> — local transfer, no international card needed</li>
          <li><strong>Credit / debit card</strong> — for cards that support online payments</li>
          <li><strong>MoneyGram</strong> — ideal if you're paying from abroad for family in Lebanon</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">How It Works (3 Steps)</h2>
        <ol className="space-y-2 list-decimal pl-5 text-slate-600 dark:text-slate-300">
          <li>Pick your subscription and tap "Get on WhatsApp"</li>
          <li>Choose your payment method — we'll send you the details</li>
          <li>Receive your account login on WhatsApp, usually within 5 minutes</li>
        </ol>

        <h2 className="text-2xl font-bold mt-10 mb-4">What Can You Get?</h2>
        <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-300">
          <li><a href="/products/netflix-premium" className="text-pink-500 hover:underline">Netflix Premium</a> — from $4.99/month instead of $15+</li>
          <li><a href="/products/spotify-premium" className="text-pink-500 hover:underline">Spotify Premium</a> — from $2.99/month instead of $10.99</li>
          <li><a href="/products/chatgpt-plus" className="text-pink-500 hover:underline">ChatGPT Plus</a> — from $6.99/month instead of $20</li>
          <li><a href="/products/adobe-creative-cloud" className="text-pink-500 hover:underline">Adobe Creative Cloud</a> — from $10.99/month instead of $54.99</li>
          <li>And 50+ more — see <a href="/products" className="text-pink-500 hover:underline">all products</a></li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">Why People in Lebanon Trust BundlyPlus</h2>
        <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-300">
          <li><strong>No international card needed</strong> — every method works locally</li>
          <li><strong>Instant WhatsApp delivery</strong> — no waiting, no emails</li>
          <li><strong>25-day money-back guarantee</strong></li>
          <li><strong>Support in Arabic and English</strong></li>
        </ul>

        <p className="mt-6 text-slate-600 dark:text-slate-300">
          Want the full guide on a specific service? Read <Link href="/blog/how-to-get-netflix-premium-cheap-worldwide" className="text-pink-500 hover:underline">how to get Netflix Premium cheap</Link> or <Link href="/blog/chatgpt-plus-subscription-best-deals" className="text-pink-500 hover:underline">the best ChatGPT Plus deals</Link>.
        </p>

        <div className="mt-8 flex gap-4">
          <a href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold">
            Browse All Subscriptions
          </a>
          <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold">
            Chat on WhatsApp
          </a>
        </div>
      </>
    ),
  },

  "chatgpt-plus-subscription-best-deals": {
    title: "ChatGPT Plus Subscription: Best Deals & Worldwide Access (2026)",
    description: "Get ChatGPT Plus for $6.99/month instead of $20. Instant delivery, worldwide access, multiple payment methods.",
    date: "2026-05-20",
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
    date: "2026-05-20",
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

  "adobe-creative-cloud-discount-deals": {
    title: "Adobe Creative Cloud Discount: Save Big on All 20+ Apps (2026)",
    description: "Get Adobe Creative Cloud for $10.99/month — all 20+ apps including Photoshop, Premiere Pro, Illustrator, and After Effects.",
    date: "2026-05-20",
    body: (
      <>
        <p className="lead text-lg text-slate-600 dark:text-slate-300 mb-6">
          Adobe Creative Cloud normally costs $54.99/month. Through BundlyPlus, get the entire suite for just <strong>$10.99/month</strong> — saving over 80%.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">All 20+ Apps Included</h2>
        <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300 mb-6">
          <ul className="space-y-1 list-disc pl-4">
            <li>Photoshop</li>
            <li>Illustrator</li>
            <li>Premiere Pro</li>
            <li>After Effects</li>
            <li>InDesign</li>
          </ul>
          <ul className="space-y-1 list-disc pl-4">
            <li>Lightroom</li>
            <li>Adobe XD</li>
            <li>Audition</li>
            <li>Dreamweaver</li>
            <li>+ 11 more</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">Why BundlyPlus?</h2>
        <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-300">
          <li><strong>Save 80%</strong> — $10.99 vs $54.99</li>
          <li><strong>Private account</strong> — fully yours</li>
          <li><strong>100GB cloud storage</strong></li>
          <li><strong>Instant WhatsApp delivery</strong></li>
        </ul>

        <div className="mt-8 flex gap-4">
          <a href="/products/adobe-creative-cloud" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold">
            Get Adobe CC
          </a>
          <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold">
            Chat on WhatsApp
          </a>
        </div>
      </>
    ),
  },

  "how-to-get-spotify-premium-cheap": {
    title: "How to Get Spotify Premium Cheap: Best Deals Worldwide (2026)",
    description: "Get Spotify Premium for $2.99/month instead of $10.99. Instant delivery, ad-free music, offline downloads, worldwide access.",
    date: "2026-05-20",
    body: (
      <>
        <p className="lead text-lg text-slate-600 dark:text-slate-300 mb-6">
          Spotify Premium normally costs $10.99/month. Through BundlyPlus, get it for just <strong>$2.99/month</strong> — over 70% off, delivered instantly via WhatsApp.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Why BundlyPlus for Spotify?</h2>
        <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-300">
          <li><strong>Save 73%</strong> — pay $2.99 instead of $10.99</li>
          <li><strong>Ad-free music</strong> — no interruptions</li>
          <li><strong>Offline downloads</strong> — listen anywhere</li>
          <li><strong>Works worldwide</strong></li>
          <li><strong>Instant WhatsApp delivery</strong></li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">What's Included</h2>
        <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-300">
          <li>Ad-free listening</li>
          <li>Offline downloads (up to 10,000 songs)</li>
          <li>On-demand playback</li>
          <li>High-quality audio (320kbps)</li>
          <li>Family plan also available</li>
        </ul>

        <div className="mt-8 flex gap-4">
          <a href="/products/spotify-premium" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold">
            Get Spotify Premium
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
        <Seo title="Post not found" noIndex canonical="/blog" />
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <a href="/blog" className="text-pink-500 hover:underline">← Back to blog</a>
      </div>
    );
  }

  const post = POSTS[slug];
  const postUrl = "https://bundlyplus.com/blog/" + slug;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Seo
        title={post.title}
        description={post.description}
        canonical={`/blog/${slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          url: postUrl,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": postUrl,
          },
          datePublished: post.date,
          inLanguage: "en",
          publisher: {
            "@type": "Organization",
            name: "BundlyPlus",
            logo: {
              "@type": "ImageObject",
              url: "https://bundlyplus.com/logo-icon.png",
            },
          },
        }}
      />

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
