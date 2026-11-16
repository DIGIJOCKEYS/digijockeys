import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, AtSign, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SiteSettings } from '@/lib/supabase/public-data';

const links = [
  { label: 'Tentang', href: '/about' },
  { label: 'Layanan', href: '/services' },
  { label: 'Portofolio', href: '/portfolio' },
  { label: 'Testimoni', href: '/testimonials' },
  { label: 'Kontak', href: '/contact' },
];

async function getCurrentYear() {
  'use cache';
  return new Date().getFullYear();
}

export default async function Footer({ settings }: { settings: SiteSettings }) {
  const year = await getCurrentYear();
  const instagram = settings.instagram ? (settings.instagram.startsWith('http') ? settings.instagram : `https://instagram.com/${settings.instagram.replace(/^@/, '')}`) : null;
  return <footer className="border-t border-border/70 bg-muted/20 px-4 pb-8 pt-14 sm:px-6 sm:pt-16"><div className="mx-auto max-w-7xl"><div className="grid gap-10 border-b border-border/70 pb-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.9fr]">
    <div><Link href="/" className="inline-flex items-center gap-3"><Image src={settings.logo_path || '/logo.png'} alt={settings.business_name} width={44} height={44} unoptimized className="size-11 rounded-xl object-contain" /><span className="text-lg font-bold tracking-tight">{settings.business_name}</span></Link><p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">{settings.description || 'Studio kreatif digital untuk membangun kehadiran online yang jelas, berkarakter, dan siap berkembang.'}</p></div>
    <div><p className="text-sm font-semibold">Jelajahi</p><nav aria-label="Navigasi footer" className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">{links.map((link) => <Link key={link.href} href={link.href} className="py-1 text-sm text-muted-foreground transition-colors hover:text-primary">{link.label}</Link>)}</nav></div>
    <div><p className="text-sm font-semibold">Mari terhubung</p><p className="mt-4 text-sm leading-6 text-muted-foreground">Punya pertanyaan atau rencana proyek? Kami siap mendengarkan.</p><div className="mt-3 flex flex-wrap gap-2">{settings.email && <Button render={<a href={`mailto:${settings.email}`} />} variant="outline" size="sm" className="rounded-lg"><Mail /> Email</Button>}{instagram && <Button render={<a href={instagram} target="_blank" rel="noreferrer" />} variant="outline" size="sm" className="rounded-lg"><AtSign /> Instagram <ArrowUpRight /></Button>}</div></div>
  </div><div className="flex flex-col gap-2 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><p>&copy; {year} {settings.business_name}. Hak cipta dilindungi.</p><p>Dibuat dengan perhatian pada setiap detail.</p></div></div></footer>;
}
