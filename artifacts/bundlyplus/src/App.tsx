import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useUser } from "@clerk/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { ClerkProvider } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";

import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/lib/theme";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { CurrencyProvider } from "@/lib/currency";
import { CartProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { initAnalytics, identifyUser, resetAnalyticsUser } from "@/lib/analytics";
import { SocialProofToasts } from "@/components/layout/SocialProofToasts";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { buildClerkAppearance, basePath, getClerkLocalization } from "@/lib/clerk-appearance";

initAnalytics();

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
const SignInPage = lazy(() => import("@/pages/SignIn"));
const SignUpPage = lazy(() => import("@/pages/SignUp"));
const AccountPage = lazy(() => import("@/pages/Account"));
const AccountSubscriptionsPage = lazy(() => import("@/pages/AccountSubscriptions"));
const AccountOrdersPage = lazy(() => import("@/pages/AccountOrders"));
const ComingSoon = lazy(() => import("@/pages/ComingSoon"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const RefundPolicy = lazy(() => import("@/pages/RefundPolicy"));
const Contact = lazy(() => import("@/pages/Contact"));

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

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

function Router() {
  useScrollToTop();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/coming-soon" component={ComingSoon} />
          <Route path="/cart" component={Cart} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          <Route path="/account" component={AccountPage} />
          <Route path="/account/subscriptions" component={AccountSubscriptionsPage} />
          <Route path="/account/orders" component={AccountOrdersPage} />
          <Route path="/admin" component={Admin} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/refund-policy" component={RefundPolicy} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AnimatePresence>
  );
}

function AnalyticsIdentityBridge() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user) {
      identifyUser(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName || undefined,
      });
    } else {
      resetAnalyticsUser();
    }
  }, [isLoaded, isSignedIn, user?.id]);

  return null;
}

function ClerkAppShell() {
  const [, setLocation] = useLocation();
  const { lang } = useI18n();
  const appearance = buildClerkAppearance();
  const localization = getClerkLocalization(lang);

  if (!clerkPubKey) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center text-slate-700 dark:text-slate-200">
        <p>
          Missing <code>VITE_CLERK_PUBLISHABLE_KEY</code>. Authentication is unavailable.
        </p>
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={appearance}
      localization={localization}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      signInFallbackRedirectUrl={`${basePath}/account`}
      signUpFallbackRedirectUrl={`${basePath}/account`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <CartProvider>
        <WishlistProvider>
          <AnalyticsIdentityBridge />
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
        </WishlistProvider>
      </CartProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <I18nProvider>
          <CurrencyProvider>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                <WouterRouter base={basePath}>
                  <ClerkAppShell />
                </WouterRouter>
                <Toaster />
              </TooltipProvider>
            </QueryClientProvider>
          </CurrencyProvider>
        </I18nProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
