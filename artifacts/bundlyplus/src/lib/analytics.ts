import posthog, { type PostHog } from 'posthog-js';

export const ANALYTICS_EVENTS = {
  PRODUCT_VIEWED: 'product_viewed',
  ADD_TO_CART: 'add_to_cart',
  CART_VIEWED: 'cart_viewed',
  WHATSAPP_CHECKOUT_CLICKED: 'whatsapp_checkout_clicked',
  WISHLIST_ADDED: 'wishlist_added',
  DISCOUNT_POPUP_SHOWN: 'discount_popup_shown',
  DISCOUNT_POPUP_DISMISSED: 'discount_popup_dismissed',
  DISCOUNT_POPUP_CTA_CLICKED: 'discount_popup_cta_clicked',
  CURRENCY_TOGGLED: 'currency_toggled',
  LANGUAGE_TOGGLED: 'language_toggled',
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  FAQ_OPENED: 'faq_opened',
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export interface ProductViewedProps {
  product_id: string;
  product_slug?: string;
  product_name: string;
  price_usd: number;
  currency: string;
  language: string;
  category?: string;
  account_type?: string;
  signed_in: boolean;
}

export interface AddToCartProps {
  product_id: string;
  product_name: string;
  price_usd: number;
  currency: string;
  language: string;
  category?: string;
  account_type?: string;
  quantity?: number;
  item_type: 'product' | 'bundle';
  signed_in: boolean;
}

export interface CartViewedProps {
  total_items: number;
  total_price_usd: number;
  currency: string;
  language: string;
  signed_in: boolean;
}

export interface WhatsappCheckoutProps {
  total_items: number;
  total_price_usd: number;
  currency: string;
  language: string;
  order_ref?: string;
  signed_in: boolean;
}

export interface WishlistAddedProps {
  product_id: string;
  product_name?: string;
  language?: string;
  signed_in: boolean;
}

export interface DiscountPopupProps {
  promotion_id: string;
  promotion_title?: string;
  discount_label?: string;
  language?: string;
}

export interface DiscountPopupCtaProps extends DiscountPopupProps {
  cta_path?: string;
}

export interface CurrencyToggledProps {
  from: string;
  to: string;
}

export interface LanguageToggledProps {
  from: string;
  to: string;
}

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
] as const;

let initialized = false;
let initAttempted = false;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function captureUtmSuperProperties() {
  if (!isBrowser()) return;
  try {
    const params = new URLSearchParams(window.location.search);
    const captured: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) captured[key] = value;
    }
    if (Object.keys(captured).length > 0) {
      posthog.register(captured);
    }
  } catch {
    /* no-op */
  }
}

export function initAnalytics(): void {
  if (initAttempted || !isBrowser()) return;
  initAttempted = true;

  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  const host =
    (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ||
    'https://us.i.posthog.com';

  if (!key) {
    if (import.meta.env.DEV) {
      console.info(
        '[analytics] VITE_POSTHOG_KEY not set — analytics disabled.',
      );
    }
    return;
  }

  try {
    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      disable_session_recording: true,
      ip: false,
      persistence: 'localStorage+cookie',
      loaded: () => {
        initialized = true;
        captureUtmSuperProperties();
      },
    });
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[analytics] init failed', err);
    }
  }
}

export function isAnalyticsEnabled(): boolean {
  return initialized;
}

export function getPostHog(): PostHog | null {
  return initialized ? posthog : null;
}

export function trackEvent<T extends Record<string, unknown>>(
  event: AnalyticsEvent,
  properties?: T,
): void {
  if (!isBrowser() || !initialized) return;
  try {
    posthog.capture(event, properties);
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn(`[analytics] capture failed for ${event}`, err);
    }
  }
}

export function identifyUser(
  userId: string,
  traits?: Record<string, unknown>,
): void {
  if (!isBrowser() || !initialized) return;
  try {
    posthog.identify(userId, traits);
  } catch {
    /* no-op */
  }
}

export function resetAnalyticsUser(): void {
  if (!isBrowser() || !initialized) return;
  try {
    posthog.reset();
  } catch {
    /* no-op */
  }
}

export function trackPageView(path?: string): void {
  if (!isBrowser() || !initialized) return;
  try {
    posthog.capture('$pageview', path ? { $current_url: path } : undefined);
  } catch {
    /* no-op */
  }
}
