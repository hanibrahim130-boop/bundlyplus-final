import { CartItem } from "@/types";

export const generateWhatsAppLink = (phoneNumber: string, items: CartItem[], total: number): string => {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  
  let message = "👋 *Hello! I would like to place an order on BundlyPlus:*\n\n";
  
  items.forEach(item => {
    message += `🛒 ${item.quantity}x *${item.name}*`;
    if (item.duration) message += ` (${item.duration})`;
    message += ` - $${(item.price * item.quantity).toFixed(2)}\n`;
  });
  
  message += `\n💰 *Total: $${total.toFixed(2)}*\n\n`;
  message += "Please let me know the payment details and next steps. Thank you!";
  
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};
