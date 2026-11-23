import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export default function WhatsAppButton({ number }: { number: string | null }) {
  const href = getWhatsAppUrl(number);
  if (!href) return null;
  return <Button render={<a href={href} target="_blank" rel="noreferrer" aria-label="Chat via WhatsApp" />} size="icon-lg" className="fixed bottom-5 right-5 z-40 size-14 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#1fbd5b]">
    <Image src="/icon/whatsapp.svg" alt="" width={30} height={30} className="size-8" />
  </Button>;
}
