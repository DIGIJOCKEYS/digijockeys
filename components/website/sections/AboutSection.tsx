import Link from 'next/link';
import { ArrowRight, CheckCircle2, MessageSquareCheck, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Reveal } from '@/components/website/Motion';

const coreValues = [
  {
    icon: SlidersHorizontal,
    number: '01',
    title: 'Pendekatan Fleksibel',
    text: 'Setiap kebutuhan memiliki tantangan dan solusi yang berbeda. Kami menyesuaikan langkah kerja sesuai prioritas dan anggaran Anda.',
  },
  {
    icon: MessageSquareCheck,
    number: '02',
    title: 'Komunikasi yang Jelas',
    text: 'Koordinasi transparan, konsultasi santai namun terarah, dan pembaruan berkala memastikan hasil akhir tepat sasaran.',
  },
  {
    icon: Sparkles,
    number: '03',
    title: 'Perhatian pada Detail',
    text: 'Mulai dari kerapian kode, ketepatan estetika desain, hingga validitas data akademik, setiap elemen dikerjakan sepenuh hati.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative isolate scroll-mt-28 overflow-hidden border-y border-border/70 bg-gradient-to-b from-background via-muted/30 to-background px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-0 -z-10 size-[32rem] rounded-full bg-primary/10 blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 bottom-0 -z-10 size-[28rem] rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              WHO WE ARE
            </div>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Lebih dari Sekadar Jasa, Kami Adalah{' '}
              <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">
                Partner untuk Setiap Kebutuhan.
              </span>
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                Digijockeys merupakan digital creative studio yang menyediakan berbagai layanan di bidang teknologi, desain kreatif, dan pendampingan akademik.
              </p>
              <p>
                Kami percaya bahwa setiap kebutuhan memiliki tantangan dan solusi yang berbeda. Karena itu, kami mengutamakan pendekatan yang fleksibel, komunikasi yang jelas, serta hasil pekerjaan yang memperhatikan detail.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-border/80 bg-card/85 p-6 shadow-xl backdrop-blur-md sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex size-3 rounded-full bg-primary" />
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Komitmen Kami</p>
              </div>
              <p className="mt-4 text-base leading-relaxed text-foreground/90">
                Kami hadir untuk membantu individu, mahasiswa, pelajar, hingga pelaku bisnis menyelesaikan kebutuhan mereka dengan lebih efektif.
              </p>
              <div className="mt-6 border-t border-border/70 pt-6">
                <Button
                  render={<Link href="/about" />}
                  className="group h-12 w-full rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/95 sm:w-auto"
                >
                  Kenali Digijockeys
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* 3 Value Pillars */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {coreValues.map(({ icon: Icon, number, title, text }, index) => (
            <Reveal key={title} delay={index * 0.08} className="h-full">
              <Card className="group relative h-full rounded-3xl border-border/75 bg-card/90 p-7 shadow-xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-xl hover:shadow-primary/5">
                <CardContent className="flex h-full flex-col p-0">
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-mono text-sm font-bold tracking-widest text-muted-foreground/60">{number}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
