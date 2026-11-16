import Link from 'next/link';
import { ArrowDownRight, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/website/Motion';

export default function HeroSection() {
  return (
    <section id="home" className="relative isolate overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pb-28 sm:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-36 top-10 size-[30rem] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -left-40 bottom-0 size-[28rem] rounded-full bg-emerald-400/10 blur-[110px]" />
        <div className="hero-glow absolute left-1/2 top-12 h-[min(75vw,38rem)] w-[min(90vw,58rem)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(90,173,156,0.2)_0%,rgba(90,173,156,0.08)_40%,transparent_72%)] blur-2xl" />
        <div className="hero-orbit absolute left-1/2 top-16 size-[min(78vw,38rem)] -translate-x-1/2 rounded-full border border-primary/[0.055]" />
        <div className="hero-orbit hero-orbit-delayed absolute left-1/2 top-28 size-[min(58vw,28rem)] -translate-x-1/2 rounded-full border border-primary/[0.045]" />
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_0.7px,transparent_0.7px)] bg-[size:24px_24px] opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <Reveal>
          <Badge variant="secondary" className="glass-panel mb-7 gap-2 rounded-full border-white/60 bg-white/45 px-4 py-2 text-xs font-semibold tracking-wide shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
            <Sparkles className="size-3.5 text-primary" /> DIGITAL STUDIO · INDONESIA
          </Badge>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mx-auto max-w-5xl text-[clamp(2.8rem,7vw,6rem)] font-semibold leading-[0.99] tracking-[-0.055em] text-[#244e49]">
            Solusi digital yang membuat bisnis Anda{' '}
            <span className="bg-gradient-to-r from-[#438d7f] to-[#1b5550] bg-clip-text text-transparent">lebih meyakinkan.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            DigiJockeys membantu bisnis membangun website, identitas visual, dan pengalaman digital yang jelas, modern, serta siap berkembang.
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button render={<Link href="/contact" />} size="lg" className="h-12 rounded-xl px-6">
              Diskusikan proyek <ArrowRight className="size-4" />
            </Button>
            <Button render={<Link href="/portfolio" />} size="lg" variant="outline" className="h-12 rounded-xl px-6">
              Lihat hasil karya <ArrowDownRight className="size-4" />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {['Strategi yang terarah', 'Desain yang bermakna', 'Pengembangan yang rapi'].map((point) => (
              <span key={point} className="glass-panel inline-flex items-center gap-2 rounded-full border-white/55 bg-white/40 px-3.5 py-2 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-lg sm:text-sm dark:border-white/10 dark:bg-white/[0.035]">
                <Check className="size-4 text-primary" />{point}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
