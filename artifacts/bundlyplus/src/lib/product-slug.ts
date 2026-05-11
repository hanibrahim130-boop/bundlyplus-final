import type { Product } from "@/types";

/**
 * URL-safe slug derived from product name. No DB migration required —
 * the catalog is small enough (149 entries) and every product name is
 * unique, so `kebab(name)` is collision-free in practice. If a future
 * collision appears, the first match in catalog order wins and you
 * can disambiguate by adding a numeric suffix to the product name.
 */
export function productSlug(nameOrProduct: string | Product): string {
  const name = typeof nameOrProduct === "string" ? nameOrProduct : nameOrProduct.name;
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\+/g, " plus ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findProductBySlug<T extends Product>(
  products: T[],
  slug: string,
): T | undefined {
  const target = slug.toLowerCase();
  return products.find((p) => productSlug(p.name) === target);
}

export function productHref(p: Product): string {
  return `/products/${productSlug(p.name)}`;
}
