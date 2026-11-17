import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageIntro } from '@/components/website/sections/ContentSections';
import ContactSection from '@/components/website/sections/ContactSection';
import { Reveal } from '@/components/website/Motion';
import { getSiteSettings } from '@/lib/supabase/public-data';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Hubungi Kami | DigiJockeys Digital Studio',
  description: 'Konsultasikan kebutuhan pembuatan website, desain grafis, dan pendampingan akademik bersama tim DigiJockeys.',
  keywords: ['kontak DigiJockeys', 'konsultasi website', 'jasa skripsi surabaya', 'desain grafis'],
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const whatsapp = getWhatsAppUrl(settings.whatsapp || settings.phone_number);

  return (
    <>
      <PageIntro
        eyebrow="LET'S CONNECT"
        title="Mari Bicarakan Ide &amp; Kebutuhan Anda."
        text="Konsultasikan kebutuhan digital, kreatif, atau akademik Anda bersama tim DigiJockeys. Kami siap membantu menemukan solusi yang tepat, praktis, dan sesuai anggaran."
      />

      <section className="relative isolate px-4 py-16 sm:px-6 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -right-36 top-1/4 -z-10 size-[32rem] rounded-full bg-emerald-400/10 blur-[130px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-36 bottom-10 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[120px]" />

        <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Left Column: Direct channels (no jam operasional box) */}
          <Reveal className="relative isolate flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/85 p-6 shadow-sm backdrop-blur-md sm:p-9">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                INFORMASI KONTAK
              </div>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Kanal Komunikasi Langsung
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Pilih saluran yang paling nyaman untuk Anda. Ceritakan ide atau permasalahan Anda, tim kami akan merespons dengan solusi terbaik.
              </p>

              <div className="mt-8">
                <ContactSection settings={settings} />
              </div>

              {!settings.email && !settings.phone_number && !settings.instagram && (
                <p className="mt-6 rounded-2xl border border-dashed border-border/80 bg-background/50 p-5 text-sm text-muted-foreground">
                  Informasi kontak sedang diperbarui. Anda tetap dapat berkonsultasi langsung melalui tombol WhatsApp di pojok kanan bawah.
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
                <Image src="/icon/whatsapp.svg" alt="" width={30} height={30} unoptimized />
              </div>

              <CardHeader className="p-0 pt-6">
                <CardTitle className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Satu Percakapan, Solusi Nyata.
                </CardTitle>
                <CardDescription className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
                  Tidak perlu ragu menyampaikan ide awal. Tim DigiJockeys siap membantu memetakan rencana kerja secara transparan dan solutif.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 pt-8">
                <ul className="mb-9 space-y-3.5 text-sm font-medium text-white/90">
                  {[
                    'Konsultasi kebutuhan awal bebas biaya & komitmen',
                    'Estimasi biaya transparan dan terjangkau',
                    'Arah solusi yang tepat & terukur',
                    'Pengerjaan didukung pembaruan progres',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-emerald-200">
                        <Check className="size-3.5" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {whatsapp ? (
                  <Button
                    render={<a href={whatsapp} target="_blank" rel="noreferrer" />}
                    size="lg"
                    className="group h-13 w-full rounded-2xl bg-white text-sm font-bold text-primary shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/95"
                  >
                    <Image src="/icon/whatsapp.svg" alt="" width={20} height={20} unoptimized />
                    <span>Mulai Chat via WhatsApp</span>
                    <ArrowUpRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                ) : (
                  <p className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center text-sm text-white/80">
                    Silakan gunakan kontak email di samping untuk menghubungi tim kami.
                  </p>
                )}

                {settings.email && (
                  <p className="mt-5 text-center text-xs text-white/70">
                    Atau kirimkan dokumen/brief ke{' '}
                    <a className="font-semibold text-white underline underline-offset-4 hover:text-emerald-200" href={`mailto:${settings.email}`}>
                      {settings.email}
                    </a>
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
