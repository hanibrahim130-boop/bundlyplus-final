import React from "react";
import { Heart } from "lucide-react";
import { ProductGridSkeleton } from "@/components/shared/ProductGridSkeleton";
import { Section } from "@/components/shared/Section";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductCard } from "@/components/shared/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Seo } from "@/components/seo/Seo";
import { useWishlist } from "@/hooks/use-wishlist";
import { useProducts } from "@/lib/firestore-hooks";
import type { Product } from "@/types";

export default function Wishlist() {
  const { ids, count } = useWishlist();
  const { data: productsData = [], isLoading } = useProducts();

  const products = (productsData as Product[]).filter((p) =>
    ids.includes(p.id),
  );

  return (
    <div className="pt-28 pb-20 animate-[fadeIn_0.3s_ease-out]">
      <Seo title="Wishlist" canonical="/wishlist" noIndex />
      <Section>
        <PageHeader
          title="Your"
          gradientWord="Wishlist"
          subtitle={
            count === 0
              ? "No items yet — tap the heart on any product to save it here."
              : `${count} item${count === 1 ? "" : "s"} saved`
          }
        />

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-12 h-12 text-pink-400" />}
            title="Your wishlist is empty"
            description="Browse our catalog and save your favorites here for later."
            actionLabel="Browse products"
            actionHref="/products"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
