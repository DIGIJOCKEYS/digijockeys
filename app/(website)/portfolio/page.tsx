import { PageIntro } from '@/components/website/sections/ContentSections';
import PortfolioGallery from '@/components/website/sections/PortfolioGallery';
import { getProjects } from '@/lib/supabase/public-data';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Portofolio Website & Desain | DigiJockeys',
  description: 'Lihat pilihan proyek website dan desain yang dikerjakan DigiJockeys untuk kebutuhan klien.',
  path: '/portfolio',
  keywords: ['portofolio website', 'portofolio desain', 'karya DigiJockeys'],
});

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <>
      <PageIntro
        eyebrow="PORTOFOLIO"
        title="Karya digital DigiJockeys"
        text="Jelajahi proyek website dan desain yang telah dikerjakan untuk klien."
      />

      <section className="relative isolate px-4 py-12 sm:px-6 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-1/3 -z-10 size-[32rem] rounded-full bg-emerald-400/10 blur-[130px]" />
        <div className="mx-auto max-w-7xl">
          <PortfolioGallery projects={projects} />
        </div>
      </section>
    </>
  );
}
