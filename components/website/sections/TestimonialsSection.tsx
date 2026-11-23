import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewCards } from '@/components/website/sections/ContentSections';
import { Reveal } from '@/components/website/Motion';
import type { getTestimonials } from '@/lib/supabase/public-data';

type Review = Awaited<ReturnType<typeof getTestimonials>>[number];

export default function TestimonialsSection({ reviews = [] }: { reviews?: Review[] }) {
  return (
    <section id="testimonials" className="relative isolate overflow-hidden border-y border-border/70 bg-muted/20 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">ULASAN PELANGGAN</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Cerita dari pelanggan</h2>
          </div>
          <Button render={<Link href="/testimonials" />} variant="outline" className="w-fit rounded-xl">
            Baca semua ulasan <ArrowRight className="size-4" />
          </Button>
        </Reveal>
        <ReviewCards reviews={reviews.slice(0, 3)} />
      </div>
    </section>
  );
}
