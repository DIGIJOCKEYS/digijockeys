import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectCards } from '@/components/website/sections/ContentSections';
import { Reveal } from '@/components/website/Motion';
import type { getProjects } from '@/lib/supabase/public-data';

export default function PortfolioSection({
  projects,
}: {
  projects: Awaited<ReturnType<typeof getProjects>>;
}) {
  return (
    <section className="relative isolate overflow-hidden border-t border-border/70 bg-gradient-to-b from-muted/20 via-muted/35 to-muted/20 px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-52 top-1/4 -z-10 size-[34rem] rounded-full bg-primary/10 blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 bottom-10 -z-10 size-[30rem] rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            SELECTED WORKS
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Setiap Karya Memiliki Cerita dan Tujuan.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Lihat beberapa proyek dan hasil pekerjaan yang telah kami kerjakan. Dari pengembangan website hingga desain kreatif, setiap karya merupakan bentuk komitmen kami terhadap kualitas.
          </p>
        </Reveal>

        <div className="mt-14">
          <ProjectCards projects={projects.slice(0, 6)} />
        </div>

        <Reveal delay={0.2} className="mt-12 text-center">
          <Button
            render={<Link href="/portfolio" />}
            size="lg"
            className="group h-13 rounded-2xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-lg"
          >
            Jelajahi Portofolio
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
