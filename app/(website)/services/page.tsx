import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { CallToAction, PageIntro, ServiceCards } from '@/components/website/sections/ContentSections';
import { servicePillars } from '@/components/website/sections/ServicesSection';
import { getServices } from '@/lib/supabase/public-data';
import { Reveal } from '@/components/website/Motion';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Layanan Digital, Kreatif & Akademik',
  description: 'Temukan solusi teknologi website, desain kreatif visual, dan pendampingan akademik terarah dalam satu tempat di DigiJockeys.',
  path: '/services',
  keywords: ['jasa pembuatan website', 'desain grafis', 'bimbingan skripsi', 'analisis data SPSS', 'pitch deck'],
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageIntro
        eyebrow="WHAT WE OFFER"
        title="Satu Tempat untuk Berbagai Kebutuhan."
        text="Temukan layanan yang sesuai dengan kebutuhan Anda. Kami menyediakan solusi yang fleksibel, mulai dari teknologi digital hingga kebutuhan kreatif dan akademik."
      />

      {/* CORE 3 PILLARS SECTION */}
      <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-1/4 -z-10 size-[32rem] rounded-full bg-emerald-400/10 blur-[130px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 bottom-1/4 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[120px]" />

        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center sm:mb-14">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              3 Kategori Layanan Utama Kami
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Dirancang secara terarah, praktis, dan dapat disesuaikan dengan anggaran Anda.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicePillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.key} delay={index * 0.08} className="h-full">
                  <Card id={pillar.key} className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/85 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/10 sm:p-7">
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

                      <div className="mt-6 border-t border-border/70 pt-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cakupan Layanan:</p>
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
                        className="group/btn h-11 w-full rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/95"
                      >
                        <span>Konsultasikan Kebutuhan Ini</span>
                        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </div>

          {/* If there are specific customized services in DB */}
          {services.length > 0 && (
            <div className="mt-20 border-t border-border/70 pt-16">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">KATALOG KHUSUS</span>
                <h3 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Paket &amp; Layanan Tambahan</h3>
                <p className="mt-1 text-sm text-muted-foreground">Layanan tematik yang sering dipesan pelanggan DigiJockeys.</p>
              </div>
              <ServiceCards services={services} />
            </div>
          )}
        </div>
      </section>

      <CallToAction />
    </>
  );
}
