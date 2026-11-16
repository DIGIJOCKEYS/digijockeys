import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/website/layout/Navbar';
import Footer from '@/components/website/layout/Footer';
import WhatsAppButton from '@/components/website/layout/WhatsAppButton';
import HeroSection from '@/components/website/sections/HeroSection';
import AboutSection from '@/components/website/sections/AboutSection';
import ServicesSection from '@/components/website/sections/ServicesSection';
import PortfolioSection from '@/components/website/sections/PortfolioSection';
import TestimonialsSection from '@/components/website/sections/TestimonialsSection';
import { ProofCards, SectionHeading } from '@/components/website/sections/ContentSections';
import CTASection from '@/components/website/sections/CTASection';
import { Button } from '@/components/ui/button';
import { getProjects, getProofs, getServices, getSiteSettings, getTestimonials } from '@/lib/supabase/public-data';
import { Reveal } from '@/components/website/Motion';

export const metadata: Metadata = {
  title: 'DigiJockeys — Studio Kreatif Digital untuk Bisnis Bertumbuh',
  description: 'DigiJockeys membantu bisnis membangun website, identitas visual, dan pengalaman digital melalui strategi, desain, dan teknologi yang terarah.',
  keywords: ['jasa pembuatan website', 'studio kreatif digital', 'desain website', 'digital branding', 'DigiJockeys'],
  openGraph: {
    title: 'DigiJockeys — Studio Kreatif Digital',
    description: 'Strategi, desain, dan teknologi untuk bisnis yang ingin tampil lebih meyakinkan.',
    type: 'website',
  },
};

async function HomeContent() {
  const [settings, services, projects, reviews, proofs] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getProjects(),
    getTestimonials(),
    getProofs(),
  ]);

  return (
    <>
      <Navbar settings={settings} />
      <main id="main-content" className="website-motion">
        <HeroSection />
        <AboutSection />
        <ServicesSection services={services} preview />
        <PortfolioSection projects={projects} />
        <TestimonialsSection reviews={reviews} />

        {proofs.length > 0 && (
          <section className="relative isolate overflow-hidden bg-gradient-to-b from-muted/20 via-muted/35 to-muted/20 px-4 py-20 sm:px-6 sm:py-28">
            <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-0 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[110px]" />
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Dokumentasi terpilih"
                title="Proses dan hasil yang bisa dilihat."
                text="Beberapa dokumentasi kerja yang telah dipublikasikan."
              />
              <ProofCards proofs={proofs.slice(0, 3)} />
              <Reveal className="mt-8 text-center">
                <Button render={<Link href="/contact" />} variant="outline" className="rounded-xl border-border/70 bg-background/45 backdrop-blur-md hover:bg-background/80">
                  Tanyakan tentang proyek serupa <ArrowRight />
                </Button>
              </Reveal>
            </div>
          </section>
        )}

        <CTASection settings={settings} />
      </main>
      <Footer settings={settings} />
      <WhatsAppButton number={settings.whatsapp || settings.phone_number} />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<main className="min-h-screen pt-24" aria-busy="true" />}>
      <HomeContent />
    </Suspense>
  );
}
