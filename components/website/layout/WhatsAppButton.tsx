import { Button } from '@/components/ui/button';

export default function WhatsAppButton({ number }: { number: string | null }) {
  const rawDigits = number?.replace(/\D/g, '');
  const digits = rawDigits?.startsWith('0') ? `62${rawDigits.slice(1)}` : rawDigits;
  if (!digits) return null;
  return <Button render={<a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" aria-label="Chat via WhatsApp" />} size="icon-lg" className="fixed bottom-5 right-5 z-40 size-14 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#1fbd5b]">
    <svg viewBox="0 0 32 32" aria-hidden="true" className="size-7 fill-current"><path d="M16 3.2A12.3 12.3 0 0 0 5.4 21.7L4 28l6.5-1.7A12.4 12.4 0 1 0 16 3.2Zm0 22.5c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.3-.4A10 10 0 1 1 16 25.7Zm5.5-7.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.3-.7.1a8.2 8.2 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.2-.7l.5-.6.3-.6c.1-.2 0-.5 0-.6l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.7 5.8 5.1.8.3 1.4.5 1.9.6.8.2 1.5.2 2 .1.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4 0-.2-.2-.3-.5-.4Z" /></svg>
  </Button>;
}
