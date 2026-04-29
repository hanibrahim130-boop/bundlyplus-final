import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Home,
  ShoppingBag,
  Package,
  ShoppingCart,
  Heart,
  Sun,
  Moon,
  Search,
} from "lucide-react";
import { useProducts } from "@/lib/firestore-hooks";
import { useTheme } from "@/lib/theme";
import { useCurrency } from "@/lib/currency";
import type { Product } from "@/types";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Products", href: "/products", icon: ShoppingBag },
  { label: "Bundles", href: "/bundles", icon: Package },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const { data: products = [] } = useProducts();
  const { theme, toggleTheme } = useTheme();
  const { format } = useCurrency();

  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  const go = (href: string) => {
    navigate(href);
    setOpen(false);
  };

  const flipTheme = () => {
    toggleTheme();
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, products…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {NAV_ITEMS.map((item) => (
            <CommandItem key={item.href} onSelect={() => go(item.href)}>
              <item.icon className="mr-2 h-4 w-4 text-slate-400" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={flipTheme}>
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="mr-2 h-4 w-4 text-slate-400" />
            )}
            Toggle {theme === "dark" ? "Light" : "Dark"} Mode
          </CommandItem>
        </CommandGroup>

        {(products as Product[]).length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Products">
              {(products as Product[]).slice(0, 12).map((p) => (
                <CommandItem key={p.id} onSelect={() => go("/products")}>
                  <Search className="mr-2 h-4 w-4 text-slate-400" />
                  <span className="flex-1 truncate">{p.name}</span>
                  <span className="ml-auto text-xs text-slate-400 tabular-nums-p">
                    {format(p.price)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
