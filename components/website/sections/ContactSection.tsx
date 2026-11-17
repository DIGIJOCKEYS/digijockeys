'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/website/Motion';
import type { SiteSettings } from '@/lib/supabase/public-data';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export default function ContactSection({ settings }: { settings: SiteSettings }) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const whatsappNumber = settings.whatsapp || settings.phone_number;
  const whatsappUrl = getWhatsAppUrl(whatsappNumber);

  const instagramHref = settings.instagram
    ? settings.instagram.startsWith('http')
      ? settings.instagram
      : `https://instagram.com/${settings.instagram.replace(/^@/, '')}`
    : null;

  return (
    <div className="flex flex-col gap-4">
      {/* WhatsApp Card */}
      {whatsappNumber && (
        <Reveal delay={0.05}>
          <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-emerald-500/[0.08] hover:shadow-lg hover:shadow-emerald-500/5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-sm transition-transform group-hover:scale-105">
                  <Image src="/icon/whatsapp.svg" alt="" width={26} height={26} unoptimized />
                </span>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    WhatsApp Resmi
                  </span>
                  <p className="truncate text-base font-bold text-foreground sm:text-lg">
                    {whatsappNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">Konsultasi cepat &amp; respon langsung</p>
                </div>
              </div>
              <Button
                render={<a href={whatsappUrl || '#'} target="_blank" rel="noreferrer" />}
                size="sm"
                className="shrink-0 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all text-xs font-semibold"
              >
                <span>Chat Sekarang</span>
                <ArrowUpRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </Reveal>
      )}

      {/* Email Card */}
      {settings.email && (
        <Reveal delay={0.1}>
          <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/85 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm transition-transform group-hover:scale-105">
                  <Image src="/icon/email.svg" alt="" width={26} height={26} unoptimized />
                </span>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Email Kontak
                  </span>
                  <p className="truncate text-base font-bold text-foreground sm:text-lg">
                    {settings.email}
                  </p>
                  <p className="text-xs text-muted-foreground">Kirim brief, proposal, atau dokumen</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyEmail(settings.email!)}
                  className="rounded-xl border-border/80 text-xs font-semibold hover:border-primary hover:text-primary transition-all"
                  aria-label="Salin email"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="size-3.5 text-emerald-500" />
                      <span className="hidden sm:inline text-emerald-500">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span className="hidden sm:inline">Salin</span>
                    </>
                  )}
                </Button>
                <Button
                  render={<a href={`mailto:${settings.email}`} />}
                  size="sm"
                  className="rounded-xl bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all"
                >
                  <span>Kirim Email</span>
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* Instagram Card */}
      {settings.instagram && (
        <Reveal delay={0.15}>
          <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/85 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/15 via-rose-500/15 to-purple-500/15 text-rose-500 shadow-sm transition-transform group-hover:scale-105">
                  <Image src="/icon/instagram.svg" alt="" width={26} height={26} unoptimized />
                </span>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
                    Instagram Resmi
                  </span>
                  <p className="truncate text-base font-bold text-foreground sm:text-lg">
                    {settings.instagram}
                  </p>
                  <p className="text-xs text-muted-foreground">Kabar terbaru, portofolio &amp; edukasi</p>
                </div>
              </div>
              {instagramHref && (
                <Button
                  render={<a href={instagramHref} target="_blank" rel="noreferrer" />}
                  variant="outline"
                  size="sm"
                  className="shrink-0 rounded-xl border-border/80 text-xs font-semibold hover:border-primary hover:text-primary transition-all"
                >
                  <span>Ikuti Kami</span>
                  <ArrowUpRight className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
