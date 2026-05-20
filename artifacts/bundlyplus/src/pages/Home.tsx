import { lazy, Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { SocialProofStrip } from "@/components/home/SocialProofStrip";
import { Selection } from "@/components/home/Selection";
import { CategoryRail } from "@/components/home/CategoryRail";
import { AppleTrust } from "@/components/home/AppleTrust";
import { Testimonials } from "@/components/home/Testimonials";
import { useSettings } from "@/lib/settings";
import { Seo } from "@/components/seo/Seo";

const FAQ = lazy(() =>
  import("@/components/home/FAQ").then((m) => ({ default: m.FAQ })),
);

const SectionFallback = () => (
  <div className="py-16 flex justify-center">
    <div
      className="h-8 w-8 rounded-full border-2 border-transparent animate-spin"
      style={{
        borderTopColor: "var(--bp-pink)",
        borderRightColor: "var(--bp-pink)",
      }}
    />
  </div>
);

export default function Home() {
  const { siteSettings } = useSettings();

  return (
    <div>
      <Seo
        canonical="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Store",
          name: "BundlyPlus",
          url: "https://bundlyplus.com",
          description:
            "Premium digital subscriptions marketplace available worldwide",
          priceRange: "$$",
          currenciesAccepted: "USD",
          paymentAccepted: "Card, Whish Money, OMT, Bank Transfer, MoneyGram",
        }}
      />
      <Hero settings={siteSettings} />
      <BrandMarquee />
      <SocialProofStrip />
      <Selection />
      <CategoryRail />
      <AppleTrust />
      <Testimonials />
      <Suspense fallback={<SectionFallback />}>
        <FAQ />
      </Suspense>
    </div>
  );
}
