import Link from 'next/link';
import { ArrowRight, Check, Code2, Palette, GraduationCap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Reveal } from '@/components/website/Motion';
import type { getServices } from '@/lib/supabase/public-data';

export const servicePillars = [
  {
    key: 'digital-tech',
    pillar: 'A. Digital & Technology',
    tag: 'Web & Digital System',
    icon: Code2,
    tagline: 'Membangun pengalaman digital yang fungsional, modern, dan sesuai kebutuhan.',
    badgeColor: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    items: [
      'Jasa Pembuatan Website',
      'Website Company Profile',
      'Website Bisnis & UMKM',
      'Landing Page & Portfolio',
      'Pengembangan Sistem Web',
      'UI/UX Design',
    ],
  },
  {
    key: 'creative-design',
    pillar: 'B. Creative & Design',
    tag: 'Visual & Branding',
    icon: Palette,
    tagline: 'Mengubah ide menjadi visual yang menarik, komunikatif, dan profesional.',
    badgeColor: 'border-teal-500/30 text-teal-600 dark:text-teal-400 bg-teal-500/10',
    items: [
      'Desain Grafis',
      'Poster & Flyer',
      'Banner & Konten Media Sosial',
      'Desain Presentasi (PPT)',
      'Infografis',
      'CV & Portofolio',
    ],
  },
  {
    key: 'academic-support',
    pillar: 'C. Academic Support',
    tag: 'Riset & Akademik',
    icon: GraduationCap,
    tagline: 'Mendukung proses belajar dan penyelesaian kebutuhan akademik melalui pendampingan yang terarah.',
    badgeColor: 'border-primary/30 text-primary bg-primary/10',
    items: [
      'Konsultasi Skripsi',
      'Pendampingan Thesis',
      'Konsultasi Proposal Penelitian',
      'Pengolahan & Analisis Data',
      'Editing dan Formatting Dokumen',
      'Bimbingan Tugas Sekolah dan Kuliah',
    ],
  },
];

export default function ServicesSection({
  services,
  preview = false,
}: {
  services?: Awaited<ReturnType<typeof getServices>>;
  preview?: boolean;
}) {
  return (
    <section id="services" className="relative isolate overflow-hidden scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-1/3 -z-10 size-[32rem] rounded-full bg-emerald-300/10 blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 bottom-10 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            WHAT WE OFFER
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Satu Tempat untuk Berbagai Kebutuhan.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Temukan layanan yang sesuai dengan kebutuhan Anda. Kami menyediakan solusi yang fleksibel, mulai dari teknologi digital hingga kebutuhan kreatif dan akademik.
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

                    {/* Services Checklist */}
                    <div className="mt-6 border-t border-border/70 pt-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Layanan Termasuk:</p>
                      <ul className="mt-3.5 space-y-2.5">
                        {pillar.items.map((item) => (
                          <li key={item} className="flex items-center gap-2.5 text-sm text-foreground/85">
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Check className="size-3" />
                            </span>
                            <span className="font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-border/60 pt-5">
                    <Button
                      render={<Link href="/contact" />}
                      variant="outline"
                      className="group/btn h-11 w-full rounded-xl border-border/80 bg-background/60 text-xs font-semibold hover:border-primary/50 hover:bg-primary hover:text-primary-foreground"
                    >
                      <span>Konsultasikan Kategori Ini</span>
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
            Lihat Semua Layanan
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
