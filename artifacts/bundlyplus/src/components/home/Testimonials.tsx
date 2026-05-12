import { Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/**
 * Testimonials — WhatsApp-style review cards with Lebanese names,
 * star ratings, and the product they bought. Signals trust to new
 * visitors who haven't ordered yet.
 */

interface Review {
  name: string;
  location: string;
  product: string;
  text: string;
  stars: number;
}

const REVIEWS_EN: Review[] = [
  {
    name: "Karim H.",
    location: "Beirut",
    product: "Netflix Premium",
    text: "Got my Netflix account in 5 minutes on WhatsApp. Way cheaper than paying with my card directly. Already renewed twice.",
    stars: 5,
  },
  {
    name: "Nour A.",
    location: "Tripoli",
    product: "ChatGPT Plus",
    text: "I couldn't pay for ChatGPT Plus from Lebanon. BundlyPlus solved it instantly — paid in LBP via Whish and got access same day.",
    stars: 5,
  },
  {
    name: "Elie M.",
    location: "Jounieh",
    product: "Spotify Premium",
    text: "Spotify for $2.49/month? I was skeptical but it's been working perfectly for 4 months now. Support replies fast too.",
    stars: 5,
  },
  {
    name: "Rima S.",
    location: "Saida",
    product: "Adobe Creative Cloud",
    text: "Saved over $40/month compared to the official price. The account works on all my devices. Highly recommend for designers.",
    stars: 4,
  },
];

const REVIEWS_AR: Review[] = [
  {
    name: "كريم ح.",
    location: "بيروت",
    product: "Netflix Premium",
    text: "وصلني حساب Netflix بـ5 دقائق عالواتساب. أرخص بكتير من الدفع بالكارد. جددت مرتين.",
    stars: 5,
  },
  {
    name: "نور أ.",
    location: "طرابلس",
    product: "ChatGPT Plus",
    text: "ما كنت قادر ادفع لـ ChatGPT Plus من لبنان. BundlyPlus حلّولي المشكلة — دفعت بالليرة عبر Whish واستلمت نفس اليوم.",
    stars: 5,
  },
  {
    name: "إيلي م.",
    location: "جونيه",
    product: "Spotify Premium",
    text: "Spotify بـ$2.49 بالشهر؟ كنت شاكك بس صار إلي 4 أشهر وشغّال تمام. والدعم بيردّو بسرعة.",
    stars: 5,
  },
  {
    name: "ريما س.",
    location: "صيدا",
    product: "Adobe Creative Cloud",
    text: "وفّرت أكتر من $40 بالشهر مقارنة بالسعر الرسمي. الحساب شغّال على كل أجهزتي. بنصح فيه لكل مصمم.",
    stars: 4,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < count ? "#FBBF24" : "transparent"}
          stroke={i < count ? "#FBBF24" : "var(--bp-ink-faint)"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="bp-card p-5 sm:p-6 flex flex-col h-full">
      <StarRating count={review.stars} />
      <p
        className="mt-3 text-[14px] leading-relaxed flex-grow"
        style={{ color: "var(--bp-ink)" }}
      >
        "{review.text}"
      </p>
      <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--bp-border)" }}>
        <div
          className="text-[13px] font-semibold"
          style={{ color: "var(--bp-ink)" }}
        >
          {review.name}
        </div>
        <div
          className="text-[11px] font-medium"
          style={{ color: "var(--bp-ink-faint)" }}
        >
          {review.location} · {review.product}
        </div>
      </div>
    </article>
  );
}

export function Testimonials() {
  const { t, lang } = useI18n();
  const reviews = lang === "ar" ? REVIEWS_AR : REVIEWS_EN;

  return (
    <section
      className="relative w-full"
      style={{ background: "var(--bp-bg-soft)" }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-20 sm:py-28">
        <header className="mb-10 sm:mb-14 max-w-2xl">
          <div className="bp-overline mb-3">{t.testimonials.subtitle}</div>
          <h2
            className="bp-display"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            {t.testimonials.title}
          </h2>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {reviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
