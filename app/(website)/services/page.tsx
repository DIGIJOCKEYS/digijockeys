import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CallToAction, PageIntro, ServiceCards } from '@/components/website/sections/ContentSections';
import { getServices, getSiteSettings } from '@/lib/supabase/public-data';
import { Reveal } from '@/components/website/Motion';

export const metadata: Metadata = {
  title: 'Layanan Website, Desain & Digital | DigiJockeys',
  description: 'Jelajahi layanan aktif DigiJockeys untuk pengembangan website, desain kreatif, dan kebutuhan digital bisnis Anda.',
  keywords: ['jasa website', 'desain digital', 'layanan kreatif', 'pengembangan digital'],
};

const processSteps = ['Diskusi kebutuhan', 'Rencana yang terarah', 'Proses transparan'];

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettings()]);

  return (
    <>
      <PageIntro eyebrow="Layanan DigiJockeys" title="Dukungan digital yang mengikuti arah bisnis Anda." text="Pilih layanan yang dibutuhkan sekarang, lalu kembangkan lagi saat bisnis Anda siap melangkah lebih jauh." />
      <section className="relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-1/3 -z-10 size-[30rem] rounded-full bg-emerald-300/10 blur-[110px]" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col gap-2 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Pilih dukungan Anda</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Layanan untuk tahap bisnis Anda</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">Setiap layanan dapat disesuaikan dengan kebutuhan, tujuan, dan rencana pertumbuhan bisnis.</p>
          </div>

          <ServiceCards services={services} />

          <Reveal delay={0.1} className="mt-8">
            <Card className="glass-panel grid gap-4 rounded-3xl border-white/55 bg-white/40 p-5 shadow-sm ring-0 backdrop-blur-xl sm:grid-cols-3 sm:gap-3 sm:p-6 dark:border-white/10 dark:bg-white/[0.035]">
              {processSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 text-sm font-medium">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/10 bg-primary/[0.07] text-primary"><Check className="size-4" /></span>
                  <span className="text-muted-foreground"><span className="mr-2 font-mono text-xs text-primary/70">0{index + 1}</span>{step}</span>
                </div>
              ))}
            </Card>
          </Reveal>

          <div className="mt-9 text-center">
            <Button render={<Link href="/contact" />} className="h-12 rounded-xl px-6 shadow-lg shadow-primary/10 transition duration-300 hover:-translate-y-0.5">
              Ceritakan kebutuhan Anda <ArrowRight />
            </Button>
          </div>
        </div>
      </section>
      <CallToAction settings={settings} />
    </>
  );
}
