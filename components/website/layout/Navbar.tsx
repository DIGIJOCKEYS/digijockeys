'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/shared/ThemeToggle';
import type { SiteSettings } from '@/lib/supabase/public-data';

const links = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang', href: '/about' },
  { label: 'Layanan', href: '/services' },
  { label: 'Portofolio', href: '/portfolio' },
  { label: 'Testimoni', href: '/testimonials' },
];

export default function Navbar({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  return <motion.header initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
    <nav aria-label="Navigasi utama" className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-border/70 bg-background/85 px-3 py-2.5 shadow-lg shadow-black/[0.035] backdrop-blur-xl sm:px-5">
      <Link href="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}><Image src={settings.logo_path || '/logo.png'} alt={settings.business_name} width={40} height={40} unoptimized priority className="size-10 shrink-0 rounded-xl object-contain" /><span className="min-w-0"><span className="block truncate text-sm font-bold tracking-tight sm:text-base">{settings.business_name}</span><span className="hidden text-[9px] tracking-[0.16em] text-muted-foreground sm:block">DIGITAL CREATIVE STUDIO</span></span></Link>
      <div className="hidden items-center gap-0.5 lg:flex">{links.map((link) => <Button key={link.href} render={<Link href={link.href} />} variant="ghost" size="sm" className="rounded-lg px-3 text-xs text-muted-foreground hover:text-foreground xl:text-sm">{link.label}</Button>)}</div>
      <div className="flex items-center gap-2"><ThemeToggle /><Button render={<Link href="/contact" />} size="sm" className="hidden rounded-xl px-4 sm:inline-flex">Konsultasi <ArrowUpRight className="size-4" /></Button><Button variant="outline" size="icon" className="size-9 rounded-xl lg:hidden" aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button></div>
    </nav>
    <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.18 }} className="mx-auto mt-2 max-w-7xl rounded-2xl border border-border/70 bg-background/95 p-3 shadow-xl backdrop-blur-xl lg:hidden"><div className="grid gap-1">{links.map((link) => <Button key={link.href} render={<Link href={link.href} onClick={() => setOpen(false)} />} variant="ghost" className="h-11 justify-start rounded-xl px-4 text-muted-foreground">{link.label}</Button>)}<Button render={<Link href="/contact" onClick={() => setOpen(false)} />} className="mt-1 h-11 rounded-xl">Hubungi kami <ArrowUpRight /></Button></div></motion.div>}</AnimatePresence>
  </motion.header>;
}
