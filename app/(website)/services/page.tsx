import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { PageIntro, ServiceCards } from '@/components/website/sections/ContentSections';
import { servicePillars } from '@/components/website/sections/ServicesSection';
import { getServices } from '@/lib/supabase/public-data';
import { Reveal } from '@/components/website/Motion';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Layanan Website, Desain & Pendampingan Akademik | DigiJockeys',
  description: 'Jelajahi katalog layanan DigiJockeys untuk kebutuhan website, desain kreatif, dan pendampingan akademik.',
  path: '/services',
  keywords: ['jasa pembuatan website', 'jasa desain grafis', 'pendampingan akademik', 'layanan DigiJockeys'],
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageIntro
        eyebrow="LAYANAN"
        title="Layanan DigiJockeys"
        text="Pilih bidang layanan, lalu lihat pilihan yang tersedia saat ini."
      />

      {/* CORE 3 PILLARS SECTION */}
      <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-1/4 -z-10 size-[32rem] rounded-full bg-emerald-400/10 blur-[130px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 bottom-1/4 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[120px]" />

        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center sm:mb-14">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Pilih bidang layanan
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Tiga bidang utama untuk kebutuhan yang berbeda.
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

                    </div>

                    <div className="mt-8 border-t border-border/60 pt-5">
                      <Button
                        render={<Link href="#katalog" />}
                        className="group/btn h-11 w-full rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/95"
                      >
                        <span>Lihat layanan tersedia</span>
                        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </div>

          <div id="katalog" className="mt-16 scroll-mt-28 border-t border-border/70 pt-12 sm:mt-20 sm:pt-16">
            <h2 className="mb-7 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Katalog layanan</h2>
            <ServiceCards services={services} />
          </div>
        </div>
      </section>
    </>
  );
}
