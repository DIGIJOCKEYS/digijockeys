import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SiteSettings } from '@/lib/supabase/public-data';
import { getWhatsAppUrl } from '@/lib/whatsapp';

const quickLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang Kami', href: '/about' },
  { label: 'Layanan Lengkap', href: '/services' },
  { label: 'Portofolio', href: '/portfolio' },
  { label: 'Testimoni & Bukti', href: '/testimonials' },
  { label: 'Hubungi Kami', href: '/contact' },
];

const serviceCategories = [
  { label: 'Digital & Teknologi', href: '/services#digital-tech' },
  { label: 'Desain Kreatif', href: '/services#creative-design' },
  { label: 'Pendampingan Akademik', href: '/services#academic-support' },
];

async function getCurrentYear() {
  'use cache';
  return new Date().getFullYear();
}

export default async function Footer({ settings }: { settings: SiteSettings }) {
  const year = await getCurrentYear();
  const instagram = settings.instagram
    ? settings.instagram.startsWith('http')
      ? settings.instagram
      : `https://instagram.com/${settings.instagram.replace(/^@/, '')}`
    : null;
  const whatsapp = getWhatsAppUrl(settings.whatsapp || settings.phone_number);

  return (
    <footer className="border-t border-border/70 bg-gradient-to-b from-muted/20 to-muted/40 px-4 pb-10 pt-16 sm:px-6 sm:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-border/70 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
          {/* Brand Info */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src={settings.logo_path || '/logo.png'}
                alt={settings.business_name}
                width={44}
                height={44}
                className="size-11 rounded-xl object-contain shadow-xs"
              />
              <div>
                <span className="block text-lg font-extrabold tracking-tight text-foreground">
                  {settings.business_name || 'DIGI JOCKEYS'}
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  Digital, Creative &amp; Academic
                </span>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {settings.description ||
                'Studio digital untuk bisnis, individu, dan mahasiswa.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">Jelajahi</p>
            <nav aria-label="Navigasi footer" className="mt-4 flex flex-col space-y-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Core Pillars */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">Pilar Layanan</p>
            <div className="mt-4 flex flex-col space-y-2.5">
              {serviceCategories.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect & Social */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">Hubungi Kami</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Pilih kanal yang nyaman untuk menghubungi kami.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {settings.email && (
                <Button
                  render={<a href={`mailto:${settings.email}`} />}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-border/80 text-xs font-semibold hover:border-primary hover:text-primary"
                >
                  <Image src="/icon/email.svg" alt="" width={16} height={16} /> Email
                </Button>
              )}
              {whatsapp && (
                <Button
                  render={<a href={whatsapp} target="_blank" rel="noreferrer" />}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-border/80 text-xs font-semibold hover:border-primary hover:text-primary"
                >
                  <Image src="/icon/whatsapp.svg" alt="" width={16} height={16} /> WhatsApp <ArrowUpRight className="size-3" />
                </Button>
              )}
              {instagram && (
                <Button
                  render={<a href={instagram} target="_blank" rel="noreferrer" />}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-border/80 text-xs font-semibold hover:border-primary hover:text-primary"
                >
                  <Image src="/icon/instagram.svg" alt="" width={16} height={16} /> Instagram <ArrowUpRight className="size-3" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="flex flex-col gap-3 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} {settings.business_name || 'Digijockeys'}. Seluruh hak cipta dilindungi.</p>
          <p className="font-medium text-foreground/80">Ide Anda, Solusi Kami.</p>
        </div>
      </div>
    </footer>
  );
}
