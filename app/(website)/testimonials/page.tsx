import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, Check, MessageSquareQuote, ShieldCheck, Star, Images, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageIntro, ReviewCards } from '@/components/website/sections/ContentSections';
import ProofGallery from '@/components/website/sections/ProofGallery';
import TestimonialForm from '@/components/website/sections/TestimonialForm';
import { Reveal } from '@/components/website/Motion';
import { getProofs, getServices, getTestimonials } from '@/lib/supabase/public-data';

export const metadata: Metadata = {
  title: 'Testimoni & Bukti Pengerjaan | DigiJockeys',
  description: 'Lihat dokumentasi bukti pengerjaan riil dan baca ulasan asli dari pelanggan DigiJockeys untuk layanan website, desain kreatif, dan akademik.',
  keywords: ['testimoni DigiJockeys', 'bukti pengerjaan', 'ulasan jasa website', 'review bimbingan skripsi', 'portfolio bukti'],
};

export default async function TestimonialsPage() {
  const [reviews, services, proofs] = await Promise.all([
    getTestimonials(),
    getServices(),
    getProofs(),
  ]);

  return (
    <>
      <PageIntro
        eyebrow="CLIENT EXPERIENCES &amp; PROOFS"
        title="Kepercayaan Dibangun dari Bukti &amp; Pengalaman Nyata."
        text="Transparansi adalah prioritas kami. Lihat dokumentasi pengerjaan proyek riil kami dan baca langsung pengalaman pelanggan yang telah mempercayakan kebutuhannya kepada DigiJockeys."
      />

      {/* SECTION 1: PROOFS OF WORK (BUKTI PENGERJAAN DENGAN DETAIL MODAL) */}
      <section id="bukti-pengerjaan" className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-0 -z-10 size-[32rem] rounded-full bg-emerald-400/10 blur-[130px]" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Images className="size-3.5" /> DOKUMENTASI PROYEK
              </div>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Bukti Pengerjaan &amp; Serah Terima
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Klik pada setiap kartu bukti untuk melihat gambar resolusi penuh, rincian pengerjaan, dan catatan verifikasi proyek.
            </p>
          </div>

          {/* Interactive Proof Gallery with Lightbox Dialog */}
          <ProofGallery proofs={proofs} />
        </div>
      </section>

      {/* SECTION 2: TESTIMONIAL REVIEWS */}
      <section className="relative isolate overflow-hidden border-t border-border/70 bg-gradient-to-b from-muted/20 via-muted/35 to-muted/20 px-4 py-16 sm:px-6 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-1/2 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[120px]" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Star className="size-3.5 fill-amber-500 text-amber-500" /> ULASAN PELANGGAN
              </div>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Cerita dari Klien Kami
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Setiap ulasan murni datang dari pengalaman nyata bekerja sama dengan tim DigiJockeys.
            </p>
          </div>

          <ReviewCards reviews={reviews} />
        </div>
      </section>

      {/* SECTION 3: SUBMIT REVIEW FORM */}
      <section id="bagikan-ulasan" className="scroll-mt-24 border-t border-border/70 bg-background px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-32">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquareQuote className="size-7" />
            </span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">BAGIKAN CERITA ANDA</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
              Pengalaman Anda Sangat Berharga bagi Kami.
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
              Pernah menggunakan layanan website, desain kreatif, atau pendampingan akademik DigiJockeys? Berikan ulasan Anda untuk membantu kami terus berkembang.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-2 shadow-xs">
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" /> Ditinjau sebelum tayang
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-2 shadow-xs">
                <Star className="size-4 fill-amber-500 text-amber-500" /> Penilaian 1–5 bintang
              </span>
            </div>
            <Button
              render={<Link href="#form-ulasan" />}
              variant="ghost"
              className="mt-6 rounded-xl px-0 text-primary hover:bg-transparent hover:text-primary/80"
            >
              Langsung ke formulir <ArrowDown className="size-4" />
            </Button>
          </Reveal>

          <Reveal delay={0.1}>
            <Card id="form-ulasan" className="scroll-mt-28 overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-xl backdrop-blur-md">
              <CardHeader className="border-b border-border/70 p-6 sm:p-8">
                <CardTitle className="text-xl font-bold sm:text-2xl">Kirim Ulasan Pelanggan</CardTitle>
                <CardDescription className="max-w-xl text-sm leading-relaxed">
                  Isi formulir berikut dengan pengalaman Anda. Ulasan akan diperiksa terlebih dahulu oleh tim kami demi menjaga orisinalitas.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <TestimonialForm services={services.map(({ id, name }) => ({ id, name }))} />
                <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  Dengan mengirim ulasan, Anda mengizinkan DigiJockeys menampilkannya di halaman ini setelah proses verifikasi.
                </p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
