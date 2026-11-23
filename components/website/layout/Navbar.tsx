'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/shared/ThemeToggle';
import type { SiteSettings } from '@/lib/supabase/public-data';

const links = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang', href: '/about' },
  { label: 'Layanan', href: '/services' },
  { label: 'Portofolio', href: '/portfolio' },
  { label: 'Testimoni & Bukti', href: '/testimonials' },
];

export default function Navbar({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
    >
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-border/80 bg-background/85 px-3 py-2.5 shadow-lg shadow-black/[0.04] backdrop-blur-xl sm:px-5"
      >
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src={settings.logo_path || '/logo.png'}
            alt={settings.business_name}
            width={40}
            height={40}
            priority
            className="size-10 shrink-0 rounded-xl object-contain shadow-xs"
          />
          <span className="min-w-0">
            <span className="block truncate text-sm font-extrabold tracking-tight text-foreground sm:text-base">
              {settings.business_name || 'DIGI JOCKEYS'}
            </span>
            <span className="hidden text-[9px] font-bold tracking-[0.18em] text-primary sm:block">
              DIGITAL, CREATIVE &amp; ACADEMIC
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Button
                key={link.href}
                render={<Link href={link.href} />}
                variant="ghost"
                size="sm"
                className={`rounded-xl px-3.5 text-xs font-semibold transition-all xl:text-sm ${
                  isActive
                    ? 'bg-primary/10 text-primary hover:bg-primary/15'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Button>
            );
          })}
        </div>

        {/* Right Action & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            render={<Link href="/contact" />}
            size="sm"
            className="hidden rounded-xl bg-primary px-4.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-md sm:inline-flex"
          >
            Konsultasi Sekarang <ArrowUpRight className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-9 rounded-xl lg:hidden"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className="mx-auto mt-2 max-w-7xl rounded-2xl border border-border/80 bg-background/95 p-3.5 shadow-xl backdrop-blur-xl lg:hidden"
          >
            <div className="grid gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Button
                    key={link.href}
                    render={<Link href={link.href} onClick={() => setOpen(false)} />}
                    variant="ghost"
                    className={`h-11 justify-start rounded-xl px-4 text-sm font-semibold ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Button>
                );
              })}
              <div className="mt-2 border-t border-border/60 pt-2">
                <Button
                  render={<Link href="/contact" onClick={() => setOpen(false)} />}
                  className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
                >
                  Konsultasikan Kebutuhan Anda <ArrowUpRight className="size-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
