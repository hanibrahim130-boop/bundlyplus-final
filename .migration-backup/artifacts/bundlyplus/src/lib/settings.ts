export { useSettings } from "./firestore-hooks";

export function getWhatsAppUrl(whatsappNumber?: string): string {
  return `https://wa.me/${whatsappNumber || ''}`;
}
