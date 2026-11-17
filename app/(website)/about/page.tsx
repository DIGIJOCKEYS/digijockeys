import Link from 'next/link';
import { ArrowRight, CheckCircle2, MessageSquareCheck, SlidersHorizontal, Sparkles, Target, Users } from 'lucide-react';
import { PageIntro, SectionHeading } from '@/components/website/sections/ContentSections';
import { Reveal } from '@/components/website/Motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Tentang Kami',
  description: 'Kenali DigiJockeys, studio digital kreatif yang membantu bisnis, individu, dan mahasiswa melalui layanan teknologi, desain, serta pendampingan akademik.',
  path: '/about',
  keywords: ['tentang DigiJockeys', 'studio digital kreatif', 'layanan digital Indonesia'],
});

const pillars = [
  {
    icon: SlidersHorizontal,
    number: '01',
    title: 'Pendekatan Fleksibel',
    text: 'Setiap kebutuhan unik. Kami tidak memaksakan template kaku, melainkan menyusun solusi yang paling pas dengan tujuan dan anggaran Anda.',
  },
  {
    icon: MessageSquareCheck,
    number: '02',
    title: 'Komunikasi Terbuka & Jelas',
    text: 'Koordinasi transparan tanpa istilah teknis yang membingungkan. Anda selalu mengetahui progres dan arah pengerjaan setiap saat.',
  },
  {
    icon: Sparkles,
    number: '03',
    title: 'Perhatian Penuh pada Detail',
    text: 'Kerapian tata bahasa, keindahan visual, hingga keandalan fungsional web. Kualitas tinggi adalah standar utama hasil kerja kami.',
  },
  {
    icon: Target,
    number: '04',
    title: 'Solusi Tepat Sasaran',
    text: 'Kami fokus pada apa yang benar-benar memberikan dampak bernilai bagi kebutuhan Anda, baik untuk bisnis, karier, maupun akademik.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="WHO WE ARE"
        title="Lebih dari Sekadar Jasa, Kami Adalah Partner untuk Setiap Kebutuhan."
        text="Digijockeys hadir membantu individu, mahasiswa, pelajar, hingga pelaku bisnis menyelesaikan kebutuhan mereka dengan lebih efektif."
      />

      {/* Narrative Section */}
      <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-1/4 -z-10 size-[32rem] rounded-full bg-emerald-400/10 blur-[130px]" />
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              TENTANG DIGIJOCKEYS
            </div>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-4xl">
              Partner Kolaboratif untuk Langkah Maju Anda.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              Mulai dari pengembangan website, desain visual, hingga pendampingan akademik. Kami siap membantu setiap ide berkembang menjadi sesuatu yang bernilai.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="space-y-6">
              <Card className="rounded-3xl border border-border/80 bg-card/90 p-7 shadow-sm backdrop-blur-md sm:p-9">
                <CardContent className="space-y-5 p-0 text-base leading-relaxed text-foreground/85">
                  <p>
                    <strong>Digijockeys</strong> merupakan digital creative studio yang menyediakan berbagai layanan di bidang teknologi, desain kreatif, dan pendampingan akademik.
                  </p>
                  <p>
                    Kami percaya bahwa setiap kebutuhan memiliki tantangan dan solusi yang berbeda. Karena itu, kami mengutamakan pendekatan yang fleksibel, komunikasi yang jelas, serta hasil pekerjaan yang memperhatikan detail.
                  </p>
                  <p>
                    Kami hadir untuk membantu individu, mahasiswa, pelajar, hingga pelaku bisnis menyelesaikan kebutuhan mereka dengan lebih efektif tanpa proses birokrasi yang berbelit-belit.
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/80 bg-card/70 p-5">
                  <p className="text-2xl font-black text-primary">100%</p>
                  <p className="mt-1 text-xs font-semibold text-foreground">Personalisasi Kebutuhan</p>
                  <p className="mt-1 text-xs text-muted-foreground">Solusi disesuaikan per individu dan per proyek.</p>
                </div>
                <div className="rounded-2xl border border-border/80 bg-card/70 p-5">
                  <p className="text-2xl font-black text-primary">Transparan</p>
                  <p className="mt-1 text-xs font-semibold text-foreground">Timeline &amp; Biaya Jelas</p>
                  <p className="mt-1 text-xs text-muted-foreground">Tidak ada biaya tersembunyi selama pengerjaan.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values & Principles Section */}
      <section className="relative isolate overflow-hidden border-y border-border/70 bg-gradient-to-b from-muted/20 via-muted/35 to-muted/20 px-4 py-16 sm:px-6 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -left-48 bottom-0 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[120px]" />
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="NILAI &amp; PRINSIP"
            title="Prinsip di Balik Setiap Karya Kami."
            text="Komitmen yang selalu kami pegang teguh dalam setiap kolaborasi bersama Anda."
          />
          <div className="grid gap-6 sm:grid-cols-2">
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
              <h2 className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight sm:text-4xl">
                Ada ide atau tugas yang ingin Anda selesaikan bersama kami?
              </h2>
            </div>
            <Button
              render={<Link href="/contact" />}
              size="lg"
              className="mt-6 h-13 shrink-0 rounded-2xl bg-white px-8 text-sm font-bold text-primary shadow-xl hover:bg-white/95 md:mt-0"
            >
              Konsultasikan Kebutuhan Anda <ArrowRight className="size-4" />
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
