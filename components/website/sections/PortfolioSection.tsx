import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectCards, SectionHeading } from '@/components/website/sections/ContentSections';
import type { getProjects } from '@/lib/supabase/public-data';

export default function PortfolioSection({ projects }: { projects: Awaited<ReturnType<typeof getProjects>> }) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-muted/20 via-muted/35 to-muted/20 px-4 py-20 sm:px-6 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-52 top-1/4 -z-10 size-[34rem] rounded-full bg-primary/10 blur-[120px]" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Karya pilihan" title="Dibuat dengan tujuan. Dirancang untuk bertahan." text="Lihat beberapa proyek yang telah dipublikasikan oleh tim DigiJockeys." />
        <ProjectCards projects={projects.slice(0, 3)} />
        <div className="mt-9 text-center"><Button render={<Link href="/portfolio" />} variant="outline" className="rounded-xl border-border/70 bg-background/45 backdrop-blur-md hover:bg-background/80">Lihat semua proyek <ArrowRight /></Button></div>
      </div>
    </section>
  );
}
