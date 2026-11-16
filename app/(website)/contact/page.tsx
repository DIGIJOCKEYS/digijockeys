import type { Metadata } from 'next';
import { ArrowUpRight, Check, MessageCircleMore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageIntro } from '@/components/website/sections/ContentSections';
import ContactSection from '@/components/website/sections/ContactSection';
import { Reveal } from '@/components/website/Motion';
import { getSiteSettings } from '@/lib/supabase/public-data';

export const metadata: Metadata = {
  title: 'Hubungi DigiJockeys | Konsultasi Proyek Digital',
  description: 'Hubungi DigiJockeys untuk berdiskusi tentang website, desain, branding, dan kebutuhan digital bisnis Anda.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const normalized = settings.whatsapp?.replace(/\D/g, '');
  const whatsapp = normalized?.startsWith('0') ? `62${normalized.slice(1)}` : normalized;
  return <>
    <PageIntro eyebrow="Hubungi kami" title="Mari bicarakan ide Anda." text="Ceritakan apa yang ingin Anda bangun. Kami akan membantu menemukan arah dan langkah yang paling sesuai." />
    <section className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-6 shadow-[0_24px_80px_-48px_rgba(23,60,57,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.025] sm:p-9">
          <div aria-hidden="true" className="absolute -right-24 -top-28 -z-10 size-72 rounded-full bg-primary/10 blur-[80px]" />
          <div className="mb-7 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Informasi kontak</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Pilih cara yang paling nyaman.</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Hubungi kami lewat salah satu kanal berikut. Ceritakan kebutuhan Anda, lalu kita tentukan langkah yang paling sesuai.</p>
          </div>
          <ContactSection settings={settings} />
          {!settings.email && !settings.phone_number && !settings.instagram && <p className="rounded-2xl border border-dashed border-border/80 bg-background/40 p-5 text-sm text-muted-foreground">Informasi kontak sedang diperbarui. Anda tetap dapat menghubungi kami melalui WhatsApp.</p>}
        </Reveal>
        <Reveal delay={0.1}>
          <Card className="relative isolate h-full overflow-hidden rounded-[2rem] border-white/20 bg-gradient-to-br from-primary via-primary to-emerald-950 text-primary-foreground shadow-[0_30px_90px_-45px_rgba(18,54,48,0.65)]">
            <div aria-hidden="true" className="absolute -right-16 -top-24 -z-10 size-72 rounded-full border border-white/10" />
            <div aria-hidden="true" className="absolute -bottom-28 -left-20 -z-10 size-72 rounded-full bg-emerald-300/10 blur-3xl" />
            <CardHeader className="p-7 sm:p-9">
              <span className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-100 backdrop-blur"><MessageCircleMore className="size-6" /></span>
              <CardTitle className="max-w-md text-3xl tracking-tight sm:text-4xl">Satu percakapan bisa jadi awal yang baik.</CardTitle>
              <CardDescription className="mt-1 text-sm leading-7 text-white/70">Sampaikan gambaran proyek Anda. Kami siap membantu merancang solusi digital yang tepat.</CardDescription>
            </CardHeader>
            <CardContent className="px-7 pb-8 sm:px-9 sm:pb-10">
              <ul className="mb-8 grid gap-3 text-sm text-white/85">
                {['Diskusi kebutuhan tanpa komitmen', 'Arah solusi yang sesuai tujuan', 'Langkah berikutnya yang jelas'].map((item) => <li key={item} className="flex items-center gap-3"><span className="flex size-6 items-center justify-center rounded-full bg-white/10 text-emerald-100"><Check className="size-3.5" /></span>{item}</li>)}
              </ul>
              {whatsapp ? <Button render={<a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" />} size="lg" variant="secondary" className="h-12 w-full rounded-xl border border-white/20 bg-white/95 text-primary shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-white">Mulai chat WhatsApp <ArrowUpRight /></Button> : <p className="rounded-xl border border-white/15 bg-white/10 p-4 text-sm leading-6 text-white/75">Nomor WhatsApp belum tersedia. Silakan gunakan email untuk menghubungi kami.</p>}
              {settings.email && <p className="mt-5 text-center text-xs text-white/65">atau kirim email ke <a className="font-medium text-white underline underline-offset-4" href={`mailto:${settings.email}`}>{settings.email}</a></p>}
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  </>;
}
