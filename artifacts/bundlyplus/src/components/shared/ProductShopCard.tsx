import { useState } from "react";
import { Link } from "wouter";
import { Heart, MessageCircle } from "lucide-react";
import type { Product } from "@/types";
import { useCurrency } from "@/lib/currency";
import { useWishlist } from "@/hooks/use-wishlist";
import { getLogoUrl } from "@/utils/logoUtils";
import { getBrandGradient, getInitials } from "@/lib/brand-theme";
import { getCategoryTheme } from "@/lib/category-theme";
import { generateWhatsAppOrderLink } from "@/utils/whatsapp";
import { productHref } from "@/lib/product-slug";

interface ProductShopCardProps {
  product: Product;
  whatsappNumber: string;
}

/**
 * Apple-style product card used on the listing page.
 *
 * - Flat card with hairline border + subtle lift on hover
 * - Category pill tinted by the category-theme palette
 * - Bold price + "/ month" caption
 * - Primary CTA: "Order on WhatsApp" (green) deep-linking into wa.me
 * - Secondary: heart toggle for wishlist
 * - Whole-card link navigates to the product detail page
 */
export function ProductShopCard({ product, whatsappNumber }: ProductShopCardProps) {
  const { format } = useCurrency();
  const { isWishlisted, toggle } = useWishlist();
  const [failed, setFailed] = useState(false);
  const wishlisted = isWishlisted(product.id);
  const url = getLogoUrl(product.name);
  const theme = getCategoryTheme(product.category);
  const outOfStock = !!product.out_of_stock;

  const orderLink = generateWhatsAppOrderLink(
    whatsappNumber,
    product.name,
    product.duration || "1 Month",
  );

  return (
    <article className="bp-card relative flex flex-col h-full overflow-hidden">
      {/* Header — logo + category pill + wishlist */}
      <div
        className="relative flex items-center justify-center h-32"
        style={{
          background: "var(--bp-bg-muted)",
          borderBottom: "1px solid var(--bp-border)",
        }}
      >
        {/* top chips */}
        <span
          className="absolute top-3 start-3 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
          style={{
            background: `${theme.hex}14`,
            color: theme.hex,
          }}
        >
          {theme.label}
        </span>

        {outOfStock && (
          <span
            className="absolute top-3 end-3 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
            style={{
              background: "rgba(244,63,94,0.1)",
              color: "#E11D48",
            }}
          >
            Out of stock
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="absolute bottom-3 end-3 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          style={{
            background: "var(--bp-bg)",
            color: wishlisted ? "var(--bp-pink)" : "var(--bp-ink-faint)",
            border: "1px solid var(--bp-border)",
          }}
        >
          <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
        </button>

        {/* Logo tile */}
        <div className="relative h-16 w-16 rounded-2xl bg-white p-2.5 ring-1 ring-black/5 shadow-sm">
          {url && !failed ? (
            <img
              src={url}
              alt={product.name}
              className="h-full w-full object-contain"
              onError={() => setFailed(true)}
              loading="lazy"
              decoding="async"
              width={64}
              height={64}
            />
          ) : (
            <div
              className={`h-full w-full rounded-xl bg-gradient-to-br ${getBrandGradient(product.name)} flex items-center justify-center text-white font-semibold text-sm`}
            >
              {getInitials(product.name)}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-grow p-5">
        <Link href={productHref(product)} className="block">
          <h3
            className="text-[15px] font-semibold tracking-tight leading-snug line-clamp-1 mb-1"
            style={{ color: "var(--bp-ink)" }}
          >
            {product.name}
          </h3>
          {product.description && (
            <p
              className="text-[13px] leading-relaxed line-clamp-2"
              style={{ color: "var(--bp-ink-soft)" }}
            >
              {product.description}
            </p>
          )}
        </Link>

        {product.features && product.features.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {product.features.slice(0, 3).map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[12px]"
                style={{ color: "var(--bp-ink-soft)" }}
              >
                <span
                  className="mt-1 h-1 w-1 rounded-full shrink-0"
                  style={{ background: theme.hex }}
                />
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <div
          className="mt-auto pt-4 flex items-end justify-between gap-3"
          style={{ borderTop: "1px solid var(--bp-border)" }}
        >
          <div>
            <div
              className="text-[22px] font-semibold tracking-tight tabular-nums-p"
              style={{ color: "var(--bp-ink)" }}
            >
              {format(product.price)}
            </div>
            <div
              className="text-[11px] font-medium"
              style={{ color: "var(--bp-ink-faint)" }}
            >
              / month
            </div>
          </div>

          {!outOfStock && (
            <a
              href={orderLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "#25D366",
                color: "#fff",
              }}
            >
              <MessageCircle size={13} />
              <span>Order</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
