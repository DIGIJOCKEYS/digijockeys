import Link from 'next/link';
import { ArrowRight, Code2, Palette, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Reveal } from '@/components/website/Motion';

export const servicePillars = [
  {
    key: 'digital-tech',
    pillar: 'Digital & teknologi',
    tag: 'Website & sistem',
    icon: Code2,
    tagline: 'Website dan sistem digital untuk kebutuhan bisnis maupun personal.',
    badgeColor: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  },
  {
    key: 'creative-design',
    pillar: 'Desain kreatif',
    tag: 'Visual & konten',
    icon: Palette,
    tagline: 'Materi visual yang mendukung identitas dan komunikasi Anda.',
    badgeColor: 'border-teal-500/30 text-teal-600 dark:text-teal-400 bg-teal-500/10',
  },
  {
    key: 'academic-support',
    pillar: 'Pendampingan akademik',
    tag: 'Riset & penulisan',
    icon: GraduationCap,
    tagline: 'Dukungan untuk riset, analisis data, dan penyiapan dokumen akademik.',
    badgeColor: 'border-primary/30 text-primary bg-primary/10',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="relative isolate overflow-hidden scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-1/3 -z-10 size-[32rem] rounded-full bg-emerald-300/10 blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 bottom-10 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            LAYANAN
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Tiga bidang, satu langkah awal.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Pilih bidang yang paling dekat dengan kebutuhan Anda untuk melihat katalog layanan.
          </p>
        </Reveal>

        {/* 3 Core Category Pillars */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {servicePillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.key} delay={index * 0.08} className="h-full">
                <Card className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/85 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/10 sm:p-7">
                  {/* Subtle top accent bar */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex size-13 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="size-6" />
                      </span>
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide ${pillar.badgeColor}`}>
                        {pillar.tag}
                      </span>
                    </div>

                    <CardHeader className="p-0 pt-6">
                      <CardTitle className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        {pillar.pillar}
                      </CardTitle>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {pillar.tagline}
                      </p>
                    </CardHeader>

                  </div>

                  <div className="mt-8 border-t border-border/60 pt-5">
                    <Button
                      render={<Link href={`/services#${pillar.key}`} />}
                      variant="outline"
                      className="group/btn h-11 w-full rounded-xl border-border/80 bg-background/60 text-xs font-semibold hover:border-primary/50 hover:bg-primary hover:text-primary-foreground"
                    >
                      <span>Jelajahi bidang ini</span>
                      <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>

        {/* CTA to view all services */}
        <Reveal delay={0.25} className="mt-12 text-center">
          <Button
            render={<Link href="/services" />}
            size="lg"
            className="group h-13 rounded-2xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-lg"
          >
            Lihat katalog layanan
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
