import React from "react";
import { Link } from "wouter";
import { Seo } from "@/components/seo/Seo";
import { useI18n } from "@/lib/i18n";

const POSTS = [
  {
    slug: "chatgpt-plus-subscription-best-deals",
    title: "ChatGPT Plus Subscription: Best Deals & Worldwide Access (2026)",
    description: "Get ChatGPT Plus for $6.99/month instead of $20. Instant delivery, worldwide access, multiple payment methods.",
    category: "AI",
    date: "2026-05-20",
  },
  {
    slug: "how-to-get-netflix-premium-cheap-worldwide",
    title: "How to Get Netflix Premium Cheap Worldwide (2026 Guide)",
    description: "Save up to 80% on Netflix Premium. Compare prices, payment methods, and instant delivery options available worldwide.",
    category: "Streaming",
    date: "2026-05-20",
  },
  {
    slug: "how-to-get-spotify-premium-cheap",
    title: "How to Get Spotify Premium Cheap: Best Deals Worldwide (2026)",
    description: "Get Spotify Premium for $2.99/month instead of $10.99. Instant delivery, ad-free music, offline downloads, worldwide access.",
    category: "Music",
    date: "2026-05-20",
  },
  {
    slug: "adobe-creative-cloud-discount-deals",
    title: "Adobe Creative Cloud Discount: Save Big on All 20+ Apps (2026)",
    description: "Get Adobe Creative Cloud for $10.99/month — all 20+ apps including Photoshop, Premiere Pro, Illustrator, and After Effects.",
    category: "Design & Creative",
    date: "2026-05-20",
  },
];

export default function Blog() {
  const { lang } = useI18n();
  const isAr = lang === "ar";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Seo
        title={isAr ? "المدونة" : "Blog"}
        description={isAr ? "نصائح وعروض الاشتراكات الرقمية" : "Tips, guides, and deals for digital subscriptions"}
        canonical="/blog"
      />

      <h1 className="text-4xl font-bold mb-2">
        {isAr ? "المدونة" : "Blog"}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-10">
        {isAr ? "نصائح وعروض وحيل للاشتراكات الرقمية" : "Tips, deals, and guides for digital subscriptions"}
      </p>

      <div className="grid gap-6">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block group rounded-2xl border border-slate-200/60 dark:border-slate-700/40 p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider">{post.category}</span>
              <span>·</span>
              <time>{post.date}</time>
            </div>
            <h2 className="text-xl font-semibold group-hover:text-pink-500 transition-colors mb-2">
              {post.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
