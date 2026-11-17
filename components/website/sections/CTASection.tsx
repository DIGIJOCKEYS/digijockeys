import Link from 'next/link';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/website/Motion';
import type { SiteSettings } from '@/lib/supabase/public-data';

export default function CTASection({ settings }: { settings?: SiteSettings }) {
  return (
    <section className="relative px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
      <Reveal className="mx-auto max-w-7xl">
        <div
          className="relative isolate overflow-hidden rounded-[2.5rem] border border-white/20 px-6 py-14 text-white shadow-2xl backdrop-blur-2xl sm:px-12 sm:py-20 lg:px-16"
          style={{
            background:
              'linear-gradient(135deg, rgba(27,66,66,0.96) 0%, rgba(35,82,76,0.92) 50%, rgba(18,48,45,0.97) 100%)',
          }}
        >
          {/* Ambient shapes & orbs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-36 -z-10 size-[32rem] rounded-full border border-white/10 opacity-70"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-20 -z-10 size-[24rem] rounded-full border border-white/10 opacity-50"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-36 left-1/3 -z-10 size-96 rounded-full bg-emerald-400/20 blur-[100px]"
          />

          <div className="relative mx-auto max-w-3xl text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-200 backdrop-blur-md">
              <Sparkles className="size-3.5" />
              LET&apos;S WORK TOGETHER
            </div>

            {/* Heading */}
            <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Punya Ide? Mari Wujudkan Bersama.
            </h2>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg sm:leading-8">
              Tidak perlu bingung mencari solusi untuk setiap kebutuhan Anda. Ceritakan apa yang sedang Anda rencanakan, dan biarkan kami membantu menemukan solusi yang tepat.
            </p>

            {/* Dual CTAs */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button
                render={<Link href="/contact" />}
                size="lg"
                className="group h-13 rounded-2xl bg-white px-8 text-sm font-bold text-primary shadow-xl shadow-black/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/95"
              >
                Mulai Konsultasi
                <ArrowRight className="size-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                render={<Link href="/services" />}
                size="lg"
                variant="outline"
                className="h-13 rounded-2xl border-white/30 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:text-white hover:border-white/50"
              >
                <Compass className="size-4" />
                Lihat Layanan Kami
              </Button>
            </div>

            {/* Brand Manifesto Badge */}
            <div className="mt-14 border-t border-white/15 pt-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-emerald-200">
                DIGI JOCKEYS
              </p>
              <p className="mt-1 text-sm font-medium text-white/90">
                Digital Creative &amp; Academic Solutions.
              </p>
              <p className="mt-1 text-xs text-white/70">
                Solusi digital, kreatif, dan akademik dalam satu tempat.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
