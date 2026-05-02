import { CartItem } from "@/types";

export const generateWhatsAppLink = (
  phoneNumber: string,
  items: CartItem[],
  total: number,
  formatAmount: (usd: number) => string = (usd) => `$${usd.toFixed(2)}`
): string => {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');

  let message = "*Hello! I would like to place an order on BundlyPlus:*\n\n";

  items.forEach(item => {
    message += `${item.quantity}x *${item.name}*`;
    if (item.duration) message += ` (${item.duration})`;
    message += ` - ${formatAmount(item.price * item.quantity)}\n`;
  });

  message += `\n*Total: ${formatAmount(total)}*\n\n`;
  message += "Please confirm availability and payment instructions before I pay. Thank you!";

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};
