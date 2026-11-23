import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { Suspense } from 'react';
import Navbar from '@/components/website/layout/Navbar';
import Footer from '@/components/website/layout/Footer';
import WhatsAppButton from '@/components/website/layout/WhatsAppButton';
import HeroSection from '@/components/website/sections/HeroSection';
import AboutSection from '@/components/website/sections/AboutSection';
import ServicesSection from '@/components/website/sections/ServicesSection';
import PortfolioSection from '@/components/website/sections/PortfolioSection';
import TestimonialsSection from '@/components/website/sections/TestimonialsSection';
import CTASection from '@/components/website/sections/CTASection';
import { getProjects, getSiteSettings, getTestimonials } from '@/lib/supabase/public-data';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  'use cache';
  cacheLife('minutes');
  const settings = await getSiteSettings();
  const title = settings.meta_title?.trim() || `${settings.business_name} | Jasa Website & Solusi Digital Kreatif`;
  const description = settings.meta_description?.trim() || settings.description?.trim() || 'DigiJockeys membantu bisnis, individu, dan mahasiswa melalui layanan website, desain kreatif, dan pendampingan akademik.';
  const metadata = pageMetadata({
    title,
    description,
    path: '/',
    keywords: settings.keywords.length ? settings.keywords : ['jasa pembuatan website', 'desain grafis', 'studio digital kreatif', 'DigiJockeys'],
  });

  return {
    ...metadata,
    title: { absolute: title },
    openGraph: { ...metadata.openGraph, title, siteName: settings.business_name },
    twitter: { ...metadata.twitter, title },
  };
}

async function HomeContent() {
  const [settings, projects, reviews] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getTestimonials(),
  ]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[100] rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground focus:not-sr-only"
      >
        Lewati ke konten utama
      </a>
      <Navbar settings={settings} />
      <main id="main-content" className="website-motion">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection projects={projects} />
        <TestimonialsSection reviews={reviews} />
        <CTASection />
      </main>
      <Footer settings={settings} />
      <WhatsAppButton number={settings.whatsapp || settings.phone_number} />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<main id="main-content" className="min-h-screen pt-24" aria-busy="true" />}>
      <HomeContent />
    </Suspense>
  );
}
