import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageIntro } from '@/components/website/sections/ContentSections';
import ContactSection from '@/components/website/sections/ContactSection';
import { Reveal } from '@/components/website/Motion';
import { getSiteSettings } from '@/lib/supabase/public-data';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Kontak DigiJockeys | Konsultasi Layanan',
  description: 'Hubungi DigiJockeys melalui WhatsApp, email, atau Instagram untuk membahas kebutuhan Anda.',
  path: '/contact',
  keywords: ['kontak DigiJockeys', 'konsultasi website', 'konsultasi desain', 'kontak layanan digital'],
});

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const whatsapp = getWhatsAppUrl(settings.whatsapp || settings.phone_number);

  return (
    <>
      <PageIntro
        eyebrow="KONTAK"
        title="Hubungi DigiJockeys"
        text="Pilih WhatsApp, email, atau Instagram untuk memulai percakapan."
      />

      <section className="relative isolate px-4 py-16 sm:px-6 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -right-36 top-1/4 -z-10 size-[32rem] rounded-full bg-emerald-400/10 blur-[130px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-36 bottom-10 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[120px]" />

        <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Left Column: Direct channels (no jam operasional box) */}
          <Reveal className="relative isolate flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/85 p-6 shadow-sm backdrop-blur-md sm:p-9">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                HUBUNGI KAMI
              </div>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Pilih kanal komunikasi
              </h2>
              <div className="mt-8">
                <ContactSection settings={settings} />
              </div>

              {!settings.email && !settings.phone_number && !settings.instagram && (
                <p className="mt-6 rounded-2xl border border-dashed border-border/80 bg-background/50 p-5 text-sm text-muted-foreground">
                  Informasi kontak belum tersedia. Silakan kunjungi kembali halaman ini nanti.
                </p>
              )}
            </div>
          </Reveal>

          {/* Right Column: WhatsApp Direct Callout */}
          <Reveal delay={0.1}>
            <Card
              className="relative isolate overflow-hidden rounded-3xl border border-white/20 p-8 text-white shadow-2xl backdrop-blur-2xl sm:p-10"
              style={{
                background:
                  'linear-gradient(135deg, rgba(27,66,66,0.98) 0%, rgba(35,82,76,0.94) 50%, rgba(18,48,45,0.98) 100%)',
              }}
            >
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 -z-10 size-72 rounded-full border border-white/10" />
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-20 -z-10 size-72 rounded-full bg-emerald-400/20 blur-3xl" />

              <div className="flex size-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-emerald-200 shadow-inner">
                <Image src="/icon/whatsapp.svg" alt="" width={30} height={30} />
              </div>

              <CardHeader className="p-0 pt-6">
                <CardTitle className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Ceritakan kebutuhan Anda.
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 pt-8">
                {whatsapp ? (
                  <Button
                    render={<a href={whatsapp} target="_blank" rel="noreferrer" />}
                    size="lg"
                    className="group h-13 w-full rounded-2xl bg-white text-sm font-bold text-primary shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/95"
                  >
                    <Image src="/icon/whatsapp.svg" alt="" width={20} height={20} />
                    <span>Mulai Chat via WhatsApp</span>
                    <ArrowUpRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                ) : (
                  <p className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center text-sm text-white/80">
                    Silakan gunakan kontak email di samping untuk menghubungi tim kami.
                  </p>
                )}
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
