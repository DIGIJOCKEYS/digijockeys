import type { Metadata } from 'next';
import { PageIntro } from '@/components/website/sections/ContentSections';
import PortfolioGallery from '@/components/website/sections/PortfolioGallery';
import { getProjects } from '@/lib/supabase/public-data';

export const metadata: Metadata = {
  title: 'Portofolio Karya & Proyek | DigiJockeys',
  description: 'Lihat beberapa proyek dan hasil pekerjaan yang telah kami kerjakan. Dari pengembangan website hingga desain kreatif, setiap karya merupakan bentuk komitmen kami terhadap kualitas.',
  keywords: ['portofolio website', 'karya digital', 'project design', 'DigiJockeys', 'portofolio skripsi'],
  openGraph: { title: 'Portofolio DigiJockeys', description: 'Setiap karya memiliki cerita dan tujuan.' },
};

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <>
      <PageIntro
        eyebrow="SELECTED WORKS"
        title="Setiap Karya Memiliki Cerita dan Tujuan."
        text="Lihat beberapa proyek dan hasil pekerjaan yang telah kami kerjakan. Dari pengembangan website hingga desain kreatif, setiap karya merupakan bentuk komitmen kami terhadap kualitas."
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
