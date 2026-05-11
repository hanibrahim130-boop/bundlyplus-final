import { CartItem } from "@/types";

const cleanPhone = (phoneNumber: string) => phoneNumber.replace(/[^0-9]/g, "");

export const generateWhatsAppLink = (
  phoneNumber: string,
  items: CartItem[],
  total: number,
  formatAmount: (usd: number) => string = (usd) => `$${usd.toFixed(2)}`,
  orderRef?: string,
): string => {
  const cleanNumber = cleanPhone(phoneNumber);

  let message = "*Hello! I would like to place an order on BundlyPlus:*\n\n";

  if (orderRef) {
    message += `*Order ref:* ${orderRef}\n\n`;
  }

  items.forEach(item => {
    message += `${item.quantity}x *${item.name}*`;
    if (item.duration) message += ` (${item.duration})`;
    message += ` - ${formatAmount(item.price * item.quantity)}\n`;
  });

  message += `\n*Total: ${formatAmount(total)}*\n\n`;
  message += "Please confirm availability and payment instructions before I pay. Thank you!";

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Builds a single-product pre-filled WhatsApp link used by the Apple
 * rebuild's product cards and detail pages. The template mirrors the
 * brief the user signed off on:
 *
 *    "Hi, I want to order [Product Name] from BundlyPlus"
 *
 * When a `duration` is provided (e.g. "1 Month", "6 Months"), the
 * link asks the store to confirm that specific tier. Callers can pass
 * a custom `template` for Arabic copy or promo campaigns — use
 * `{name}` and `{duration}` as substitution tokens.
 */
export const generateWhatsAppOrderLink = (
  phoneNumber: string,
  productName: string,
  duration?: string,
  template?: string,
): string => {
  const cleanNumber = cleanPhone(phoneNumber);

  const defaultTemplate = duration
    ? "Hi, I want to order {name} ({duration}) from BundlyPlus"
    : "Hi, I want to order {name} from BundlyPlus";

  const raw = (template ?? defaultTemplate)
    .replace(/\{name\}/g, productName)
    .replace(/\{duration\}/g, duration ?? "");

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(raw)}`;
};
