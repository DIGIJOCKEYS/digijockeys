import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/website/Motion';

export default function AboutSection() {
  return (
    <section id="about" className="relative isolate scroll-mt-28 overflow-hidden border-y border-border/70 bg-gradient-to-b from-background via-muted/30 to-background px-4 py-16 sm:px-6 sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-0 -z-10 size-[32rem] rounded-full bg-primary/10 blur-[130px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">TENTANG DIGI JOCKEYS</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Solusi yang baik dimulai dari kebutuhan yang jelas.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            DigiJockeys bekerja dari tujuan yang Anda sampaikan, lalu membantu menemukan langkah yang sesuai.
          </p>
          <Button
            render={<Link href="/about" />}
            variant="outline"
            className="mt-6 rounded-xl border-border/80 bg-card/70 px-5 font-semibold transition-colors hover:border-primary/40 hover:text-primary"
          >
            Tentang DigiJockeys <ArrowRight className="size-4" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
