import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass, HeartHandshake, Layers3, Lightbulb, MoveUpRight } from 'lucide-react';
import { PageIntro, SectionHeading } from '@/components/website/sections/ContentSections';
import { Reveal } from '@/components/website/Motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Tentang DigiJockeys | Studio Kreatif Digital',
  description: 'Kenali DigiJockeys, partner digital untuk strategi, desain, dan pengembangan yang membantu bisnis tampil lebih meyakinkan.',
  openGraph: { title: 'Tentang DigiJockeys', description: 'Kami merancang pengalaman digital dari ide hingga siap digunakan.' },
};

const principles = [
  { icon: Compass, number: '01', title: 'Pahami sebelum merancang', text: 'Kami mulai dengan memahami tujuan, pengguna, dan tantangan bisnis. Arah yang jelas membuat setiap keputusan lebih berarti.' },
  { icon: Lightbulb, number: '02', title: 'Buat sederhana dan berguna', text: 'Desain yang baik tidak berhenti di estetika. Kami menyusun pengalaman yang mudah dipahami dan nyaman digunakan.' },
  { icon: Layers3, number: '03', title: 'Bangun dengan fondasi kuat', text: 'Teknologi dipilih untuk mendukung kebutuhan nyata, menjaga performa, dan memberi ruang untuk berkembang.' },
  { icon: HeartHandshake, number: '04', title: 'Kerja sebagai partner', text: 'Komunikasi terbuka dan proses yang jelas membantu semua pihak bergerak menuju hasil yang sama.' },
];

const glassCard = 'glass-panel border-white/55 bg-white/45 shadow-[0_18px_55px_-38px_rgba(23,60,57,0.4)] ring-0 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]';

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="Tentang DigiJockeys" title="Partner digital untuk ide yang layak diwujudkan." text="Kami menggabungkan strategi, desain, dan teknologi untuk membantu bisnis membangun kehadiran digital yang lebih kuat." />

      <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-1/4 -z-10 size-[32rem] rounded-full bg-emerald-300/10 blur-[120px]" />
        <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-32">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary"><span className="h-px w-8 bg-primary/60" /> Siapa kami</p>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.12] tracking-[-0.035em] sm:text-4xl">Kreativitas yang bertemu <span className="text-primary">tujuan bisnis.</span></h2>
            <p className="mt-5 max-w-lg leading-7 text-muted-foreground">Kami ingin setiap pengalaman digital tidak hanya terlihat menarik, tetapi juga terasa jelas, berguna, dan tepat sasaran.</p>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className={`${glassCard} rounded-[1.75rem]`}>
              <CardContent className="space-y-5 p-6 leading-7 text-muted-foreground sm:p-8 sm:text-[15px]">
                <p>DigiJockeys adalah studio kreatif digital yang berfokus membantu bisnis tampil lebih siap di dunia online. Kami percaya sebuah website dan identitas digital harus bekerja lebih jauh daripada sekadar terlihat menarik.</p>
                <p>Setiap proyek adalah kesempatan untuk membuat sesuatu yang jelas, berguna, dan terasa tepat bagi orang yang menggunakannya. Karena itu, kami mendengarkan lebih dulu, merancang dengan pertimbangan, lalu membangun dengan perhatian pada detail.</p>
                <p>Baik Anda baru memulai maupun ingin menyegarkan kehadiran digital, kami siap menjadi partner untuk merancang langkah berikutnya.</p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-y border-border/60 bg-gradient-to-b from-muted/20 via-muted/35 to-muted/20 px-4 py-16 sm:px-6 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -left-48 bottom-0 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[110px]" />
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Cara kami bekerja" title="Prinsip di balik setiap keputusan." text="Proses sederhana yang menjaga pekerjaan tetap terarah dari awal hingga selesai." />
          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map(({ icon: Icon, number, title, text }, index) => (
              <Reveal key={number} delay={index * 0.07} className="h-full">
                <Card className={`${glassCard} group h-full rounded-3xl transition duration-300 hover:-translate-y-1 hover:bg-white/65 dark:hover:bg-white/[0.07]`}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                      <span className="flex size-12 items-center justify-center rounded-2xl border border-primary/10 bg-primary/[0.07] text-primary transition-colors group-hover:bg-primary/10"><Icon className="size-5" /></span>
                      <span className="font-mono text-xs tracking-[0.16em] text-muted-foreground/70">{number}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold tracking-tight">{title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <Reveal className="mx-auto max-w-7xl">
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/20 px-6 py-10 text-primary-foreground shadow-[0_30px_90px_-45px_rgba(18,54,48,0.6)] backdrop-blur-2xl sm:px-10 sm:py-12 md:flex md:items-center md:justify-between md:gap-8" style={{ background: 'linear-gradient(135deg, rgba(27,66,66,0.94), rgba(32,75,70,0.9), rgba(18,51,48,0.94))' }}>
            <div aria-hidden="true" className="absolute -right-12 -top-32 -z-10 size-80 rounded-full border border-white/10" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/80">Mari berkenalan</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Ada ide yang ingin Anda bawa ke dunia digital?</h2>
            </div>
            <Button render={<Link href="/contact" />} variant="secondary" size="lg" className="mt-6 h-12 shrink-0 rounded-xl border border-white/35 bg-white/90 px-6 text-primary shadow-lg shadow-black/10 backdrop-blur-md hover:bg-white md:mt-0">Hubungi kami <MoveUpRight /></Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
