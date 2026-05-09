export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  features: string[];
  image_url?: string;
  created_at?: number;
  hot?: boolean;
  account_type?: string;
  price: number;
  featured?: boolean;
  out_of_stock?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'bundle';
  duration?: string;
}

export interface SiteSettings {
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta?: string;
  whatsapp_number?: string;
  site_name?: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  wasPrice: number;
  savePct: number;
  subs: number;
  description: string;
  perks: string[];
  popular: boolean;
}
