import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, Check, MessageSquareQuote, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageIntro, ReviewCards } from '@/components/website/sections/ContentSections';
import TestimonialForm from '@/components/website/sections/TestimonialForm';
import { Reveal } from '@/components/website/Motion';
import { getServices, getTestimonials } from '@/lib/supabase/public-data';

export const metadata: Metadata = {
  title: 'Testimoni Pelanggan DigiJockeys',
  description: 'Baca ulasan pelanggan DigiJockeys dan bagikan pengalaman Anda setelah menggunakan layanan kami.',
  keywords: ['testimoni DigiJockeys', 'ulasan jasa website', 'review layanan digital'],
};

export default async function TestimonialsPage() {
  const [reviews, services] = await Promise.all([getTestimonials(), getServices()]);

  return (
    <>
      <PageIntro eyebrow="Cerita pelanggan" title="Pengalaman nyata dari kolaborasi yang baik." text="Setiap proyek dimulai dari percakapan. Baca cerita pelanggan yang telah mengizinkan ulasannya ditampilkan." />

      <section className="relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-0 -z-10 size-[30rem] rounded-full bg-emerald-300/10 blur-[110px]" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Ulasan terpilih</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Cerita dari pelanggan kami</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">Setiap ulasan berasal dari pengalaman langsung bekerja bersama DigiJockeys.</p>
          </div>
          <ReviewCards reviews={reviews} />
        </div>
      </section>

      <section id="bagikan-ulasan" className="scroll-mt-24 border-y border-border/60 bg-gradient-to-b from-muted/20 via-muted/35 to-muted/20 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-32">
            <span className="flex size-12 items-center justify-center rounded-2xl border border-primary/10 bg-primary/[0.07] text-primary"><MessageSquareQuote className="size-6" /></span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Bagikan cerita Anda</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Pengalaman Anda membantu kami terus bertumbuh.</h2>
            <p className="mt-4 max-w-lg leading-7 text-muted-foreground">Ceritakan pengalaman menggunakan layanan kami. Ulasan akan diperiksa oleh admin sebelum dipublikasikan.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/45 px-3 py-2 backdrop-blur"><ShieldCheck className="size-4 text-primary" /> Ditinjau sebelum tayang</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/45 px-3 py-2 backdrop-blur"><Star className="size-4 text-amber-500" /> Penilaian 1–5 bintang</span>
            </div>
            <Button render={<Link href="#form-ulasan" />} variant="ghost" className="mt-5 rounded-xl px-0 text-primary hover:bg-transparent hover:text-primary/80">
              Langsung ke formulir <ArrowDown className="size-4" />
            </Button>
          </Reveal>

          <Reveal delay={0.1}>
            <Card id="form-ulasan" className="glass-panel scroll-mt-28 overflow-hidden rounded-[1.75rem] border-white/55 bg-white/45 shadow-[0_24px_70px_-40px_rgba(23,60,57,0.4)] ring-0 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.04]">
              <CardHeader className="border-b border-border/60 p-6 sm:p-8">
                <CardTitle className="text-xl sm:text-2xl">Kirim testimoni</CardTitle>
                <CardDescription className="max-w-xl leading-6">Isi beberapa detail berikut. Ulasan dikirim sebagai draf dan baru tampil setelah disetujui.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <TestimonialForm services={services.map(({ id, name }) => ({ id, name }))} />
                <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><Check className="mt-0.5 size-3.5 shrink-0 text-primary" />Dengan mengirim ulasan, Anda mengizinkan DigiJockeys menampilkannya setelah proses moderasi.</p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
