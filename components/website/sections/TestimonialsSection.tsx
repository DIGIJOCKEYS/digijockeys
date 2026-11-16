import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewCards, SectionHeading } from '@/components/website/sections/ContentSections';
import type { getTestimonials } from '@/lib/supabase/public-data';

export default function TestimonialsSection({ reviews }: { reviews: Awaited<ReturnType<typeof getTestimonials>> }) {
  return (
    <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-0 -z-10 size-[30rem] rounded-full bg-emerald-300/10 blur-[110px]" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Dipercaya pelanggan" title="Kerja yang baik terasa dari pengalamannya." text="Baca cerita dari pelanggan yang telah bekerja bersama kami." />
        <ReviewCards reviews={reviews.slice(0, 3)} />
        <div className="mt-9 text-center"><Button render={<Link href="/testimonials" />} variant="outline" className="rounded-xl border-border/70 bg-background/45 backdrop-blur-md hover:bg-background/80">Baca semua ulasan <ArrowRight /></Button></div>
      </div>
    </section>
  );
}
