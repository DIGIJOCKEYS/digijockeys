import type { Metadata } from 'next';
import { PageIntro } from '@/components/website/sections/ContentSections';
import PortfolioGallery from '@/components/website/sections/PortfolioGallery';
import { getProjects } from '@/lib/supabase/public-data';

export const metadata: Metadata = {
  title: 'Portofolio Website & Digital | DigiJockeys',
  description: 'Jelajahi proyek website, desain, dan karya digital DigiJockeys. Buka setiap proyek untuk melihat galeri dan detailnya.',
  keywords: ['portofolio website', 'karya digital', 'project design', 'DigiJockeys'],
  openGraph: { title: 'Portofolio DigiJockeys', description: 'Kumpulan proyek digital pilihan DigiJockeys.' },
};

export default async function PortfolioPage() {
  const projects = await getProjects();
  return <>
    <PageIntro eyebrow="Portofolio DigiJockeys" title="Karya yang dibuat dengan arah dan perhatian." text="Lihat proyek-proyek pilihan kami. Telusuri berdasarkan kategori, cari proyek, lalu buka galeri untuk melihat lebih dekat." />
    <section className="px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/60 bg-white/35 p-4 shadow-[0_24px_80px_-48px_rgba(23,60,57,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.025] sm:p-7 lg:p-9">
        <PortfolioGallery projects={projects} />
      </div>
    </section>
  </>;
}
