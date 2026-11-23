import Link from 'next/link';
import { ArrowDown, Check, Images, MessageSquareQuote, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageIntro, ReviewCards } from '@/components/website/sections/ContentSections';
import ProofGallery from '@/components/website/sections/ProofGallery';
import TestimonialForm from '@/components/website/sections/TestimonialForm';
import { Reveal } from '@/components/website/Motion';
import { getProofs, getServices, getTestimonials } from '@/lib/supabase/public-data';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Testimoni & Bukti Pengerjaan DigiJockeys',
  description: 'Baca ulasan pelanggan dan lihat dokumentasi pekerjaan DigiJockeys.',
  path: '/testimonials',
  keywords: ['testimoni DigiJockeys', 'bukti pengerjaan', 'ulasan pelanggan', 'review layanan digital'],
});

export default async function TestimonialsPage() {
  const [reviews, services, proofs] = await Promise.all([getTestimonials(), getServices(), getProofs()]);

  return (
    <>
      <PageIntro
        eyebrow="ULASAN & DOKUMENTASI"
        title="Pengalaman pelanggan dan bukti kerja"
        text="Baca ulasan pelanggan atau kirimkan pengalaman Anda. Dokumentasi pekerjaan tersedia di halaman ini."
      />

      <section id="bagikan-ulasan" className="scroll-mt-24 border-b border-border/70 bg-background px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-32">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquareQuote className="size-7" />
            </span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">BAGIKAN CERITA ANDA</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">Bagikan pengalaman Anda.</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">Ulasan ditinjau sebelum ditampilkan di website.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-2 shadow-xs"><ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" /> Ditinjau sebelum tayang</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-2 shadow-xs"><Star className="size-4 fill-amber-500 text-amber-500" /> Rating 1–5 bintang</span>
            </div>
            <Button render={<Link href="#hasil-testimoni" />} variant="ghost" className="mt-6 rounded-xl px-0 text-primary hover:bg-transparent hover:text-primary/80">
              Lihat hasil testimoni <ArrowDown className="size-4" />
            </Button>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-xl backdrop-blur-md">
              <CardHeader className="border-b border-border/70 p-6 sm:p-8">
                <CardTitle className="text-xl font-bold sm:text-2xl">Kirim ulasan</CardTitle>
                <CardDescription className="max-w-xl text-sm leading-relaxed">Ceritakan pengalaman Anda menggunakan layanan DigiJockeys.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <TestimonialForm services={services.map(({ id, name }) => ({ id, name }))} />
                <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><Check className="mt-0.5 size-3.5 shrink-0 text-primary" />Dengan mengirim ulasan, Anda mengizinkan DigiJockeys menampilkannya setelah proses verifikasi.</p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>

      <section id="hasil-testimoni" className="relative isolate overflow-hidden border-b border-border/70 bg-gradient-to-b from-muted/20 via-muted/35 to-muted/20 px-4 py-16 sm:px-6 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-1/2 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[120px]" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary"><Star className="size-3.5 fill-amber-500 text-amber-500" /> ULASAN PELANGGAN</div>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">Ulasan pelanggan</h2>
            </div>
          </div>
          <ReviewCards reviews={reviews} />
        </div>
      </section>

      <section id="bukti-pengerjaan" className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-0 -z-10 size-[32rem] rounded-full bg-emerald-400/10 blur-[130px]" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary"><Images className="size-3.5" /> DOKUMENTASI PROYEK</div>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">Bukti pengerjaan</h2>
            </div>
          </div>
          <ProofGallery proofs={proofs} />
        </div>
      </section>
    </>
  );
}
