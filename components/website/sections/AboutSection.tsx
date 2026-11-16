import Link from 'next/link';
import { ArrowRight, Compass, HeartHandshake, Layers3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Reveal } from '@/components/website/Motion';

const principles = [
  { icon: Compass, number: '01', title: 'Mulai dari tujuan', text: 'Setiap keputusan desain dan teknologi berangkat dari kebutuhan yang jelas.' },
  { icon: Layers3, number: '02', title: 'Rapi dari awal', text: 'Struktur yang matang membuat hasil mudah digunakan dan dikembangkan.' },
  { icon: HeartHandshake, number: '03', title: 'Kolaborasi terbuka', text: 'Proses yang komunikatif membuat Anda selalu tahu apa yang sedang dibangun.' },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative isolate scroll-mt-28 overflow-hidden border-y border-border/60 bg-gradient-to-b from-background via-muted/25 to-background px-4 py-20 sm:px-6 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-0 -z-10 size-[32rem] rounded-full bg-emerald-300/10 blur-[110px]" />
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <span className="h-px w-8 bg-primary/60" /> Tentang DigiJockeys
            </p>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.12] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
              Partner digital yang peduli pada <span className="text-primary">hasil nyata.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              DigiJockeys membantu bisnis membangun kehadiran online dengan strategi yang jelas, desain yang berkarakter, dan teknologi yang dapat diandalkan.
            </p>
            <Button render={<Link href="/about" />} variant="outline" className="mt-6 h-11 rounded-xl border-border/70 bg-background/45 px-5 backdrop-blur-md transition-colors hover:bg-background/80">
              Kenali cara kerja kami <ArrowRight className="size-4" />
            </Button>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {principles.map(({ icon: Icon, number, title, text }, index) => (
            <Reveal key={title} delay={index * 0.08} className="h-full">
              <Card className="glass-panel group relative h-full min-h-[230px] rounded-3xl border-white/60 bg-white/45 p-6 shadow-[0_16px_50px_-34px_rgba(23,60,57,0.38)] ring-0 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/65 hover:shadow-[0_24px_60px_-32px_rgba(23,60,57,0.32)] dark:border-white/10 dark:bg-white/[0.035] dark:hover:bg-white/[0.07]">
                <CardContent className="flex h-full flex-col gap-0 p-0">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-2xl border border-primary/10 bg-primary/[0.07] text-primary transition-colors group-hover:bg-primary/10">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-mono text-xs tracking-[0.16em] text-muted-foreground/70">{number}</span>
                  </div>
                  <h3 className="mt-8 text-lg font-semibold tracking-tight">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
