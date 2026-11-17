const defaultWhatsAppMessage = 'Halo Admin Digijockeys👋';

export function getWhatsAppUrl(number: string | null | undefined) {
  const digits = number?.replace(/\D/g, '');
  if (!digits) return null;
  const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(defaultWhatsAppMessage)}`;
}
