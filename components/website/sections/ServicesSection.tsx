import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading, ServiceCards } from '@/components/website/sections/ContentSections';
import type { getServices } from '@/lib/supabase/public-data';

export default function ServicesSection({ services, preview = false }: { services: Awaited<ReturnType<typeof getServices>>; preview?: boolean }) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background px-4 py-20 sm:px-6 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-1/3 -z-10 size-[30rem] rounded-full bg-emerald-300/10 blur-[110px]" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Apa yang kami kerjakan" title="Solusi digital untuk langkah bisnis berikutnya." text="Dari fondasi brand sampai produk digital, pilih dukungan yang sesuai dengan tujuan Anda." />
        <ServiceCards services={preview ? services.slice(0, 3) : services} />
        {preview && <div className="mt-9 text-center"><Button render={<Link href="/services" />} variant="outline" className="rounded-xl border-border/70 bg-background/45 backdrop-blur-md hover:bg-background/80">Jelajahi semua layanan <ArrowRight /></Button></div>}
      </div>
    </section>
  );
}
