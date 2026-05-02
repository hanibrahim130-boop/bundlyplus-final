import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";

import { ThemeProvider } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n";
import { CurrencyProvider } from "@/lib/currency";
import { CartProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { SocialProofToasts } from "@/components/layout/SocialProofToasts";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Background } from "@/components/layout/Background";
import { Footer } from "@/components/layout/Footer";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { DiscountPopup } from "@/components/layout/DiscountPopup";

import Home from "@/pages/Home";
const Products = lazy(() => import("@/pages/Products"));
const Cart = lazy(() => import("@/pages/Cart"));
const Wishlist = lazy(() => import("@/pages/Wishlist"));
const Admin = lazy(() => import("@/pages/Admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-40 h-8 bg-slate-200/60 dark:bg-slate-700/40 rounded-lg relative overflow-hidden shimmer-bg" />
      <div className="w-72 h-4 bg-slate-200/60 dark:bg-slate-700/40 rounded-lg relative overflow-hidden shimmer-bg" />
      <div className="w-56 h-4 bg-slate-200/60 dark:bg-slate-700/40 rounded-lg relative overflow-hidden shimmer-bg" />
    </div>
  );
}

const queryClient = new QueryClient();

function Router() {
  useScrollToTop();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/cart" component={Cart} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <CurrencyProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <CartProvider>
              <WishlistProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <div className="relative min-h-screen flex flex-col font-sans text-slate-800 dark:text-slate-100 selection:bg-pink-200 dark:selection:bg-pink-900/50">
                  <Background />
                  <Navbar />

                  <main className="flex-grow pb-24 md:pb-0">
                    <Router />
                  </main>

                  <Footer />
                  <BottomNav />
                  <SocialProofToasts />
                  <DiscountPopup />
                  <CommandPalette />
                </div>
              </WouterRouter>
              <Toaster />
              </WishlistProvider>
            </CartProvider>
          </TooltipProvider>
        </QueryClientProvider>
        </CurrencyProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
