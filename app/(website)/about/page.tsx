import Link from 'next/link';
import { ArrowRight, MessageSquareCheck, SlidersHorizontal, Sparkles } from 'lucide-react';
import { PageIntro } from '@/components/website/sections/ContentSections';
import { Reveal } from '@/components/website/Motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Tentang DigiJockeys | Studio Digital Kreatif',
  description: 'Kenali pendekatan DigiJockeys dalam mengerjakan solusi teknologi, desain kreatif, dan kebutuhan akademik.',
  path: '/about',
  keywords: ['tentang DigiJockeys', 'studio digital kreatif', 'solusi digital'],
});

const pillars = [
  {
    icon: SlidersHorizontal,
    number: '01',
    title: 'Fokus pada kebutuhan',
    text: 'Kami memahami tujuan sebelum menentukan pendekatan yang sesuai.',
  },
  {
    icon: MessageSquareCheck,
    number: '02',
    title: 'Komunikasi jelas',
    text: 'Ruang lingkup, progres, dan masukan dibahas secara terbuka.',
  },
  {
    icon: Sparkles,
    number: '03',
    title: 'Cermat pada detail',
    text: 'Fungsi, visual, dan kerapian diperhatikan selama pengerjaan.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="TENTANG KAMI" title="Tentang DigiJockeys" text="Studio digital kreatif untuk kebutuhan teknologi, desain, dan akademik." />

      {/* Narrative Section */}
      <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-1/4 -z-10 size-[32rem] rounded-full bg-emerald-400/10 blur-[130px]" />
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">PENDEKATAN KAMI</div>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-4xl">Mulai dari memahami konteks.</h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">Kami bekerja bersama individu, mahasiswa, dan bisnis untuk memperjelas kebutuhan sebelum menentukan langkah.</p>
          </Reveal>
        </div>
      </section>

      {/* Values & Principles Section */}
      <section className="relative isolate overflow-hidden border-y border-border/70 bg-gradient-to-b from-muted/20 via-muted/35 to-muted/20 px-4 py-16 sm:px-6 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -left-48 bottom-0 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[120px]" />
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">PRINSIP KERJA</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Kolaborasi yang jelas dan cermat.</h2>
          </Reveal>
          <div className="grid gap-3 md:grid-cols-3">
            {pillars.map(({ icon: Icon, number, title, text }, index) => (
              <Reveal key={number} delay={index * 0.07} className="h-full">
                <Card className="group h-full rounded-3xl border border-border/80 bg-card/90 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/5 sm:p-8">
                  <CardContent className="p-0">
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

      {/* Bottom CTA */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <Reveal className="mx-auto max-w-7xl">
          <div
            className="relative isolate overflow-hidden rounded-[2.5rem] border border-white/20 px-6 py-12 text-white shadow-2xl backdrop-blur-2xl sm:px-12 sm:py-16 md:flex md:items-center md:justify-between md:gap-8"
            style={{
              background: 'linear-gradient(135deg, rgba(27,66,66,0.96), rgba(35,82,76,0.92), rgba(18,48,45,0.97))',
            }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">KOLABORASI SEKARANG</p>
              <h2 className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight sm:text-4xl">Mari bahas kebutuhan Anda.</h2>
            </div>
            <Button render={<Link href="/contact" />} size="lg" className="mt-6 h-13 shrink-0 rounded-2xl bg-white px-8 text-sm font-bold text-primary shadow-xl hover:bg-white/95 md:mt-0">
              Konsultasikan Kebutuhan Anda <ArrowRight className="size-4" />
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
