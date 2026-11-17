import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navbar from '@/components/website/layout/Navbar';
import Footer from '@/components/website/layout/Footer';
import WhatsAppButton from '@/components/website/layout/WhatsAppButton';
import HeroSection from '@/components/website/sections/HeroSection';
import AboutSection from '@/components/website/sections/AboutSection';
import ServicesSection from '@/components/website/sections/ServicesSection';
import WhyChooseUsSection from '@/components/website/sections/WhyChooseUsSection';
import WorkProcessSection from '@/components/website/sections/WorkProcessSection';
import PortfolioSection from '@/components/website/sections/PortfolioSection';
import TestimonialsSection from '@/components/website/sections/TestimonialsSection';
import HomeProofsSection from '@/components/website/sections/HomeProofsSection';
import FAQSection from '@/components/website/sections/FAQSection';
import CTASection from '@/components/website/sections/CTASection';
import { getProjects, getProofs, getServices, getSiteSettings, getTestimonials } from '@/lib/supabase/public-data';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
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
        {/* 01. HERO SECTION */}
        <HeroSection />

        {/* 02. ABOUT SECTION */}
        <AboutSection />

        {/* 03. SERVICES SECTION */}
        <ServicesSection services={services} preview />

        {/* 04. WHY CHOOSE US */}
        <WhyChooseUsSection />

        {/* 05. WORK PROCESS */}
        <WorkProcessSection />

        {/* 06. PORTFOLIO SECTION */}
        <PortfolioSection projects={projects} />

        {/* 07. TESTIMONIAL SECTION (with infinite horizontal marquee from DB) */}
        <TestimonialsSection reviews={reviews} />

        {/* BUKTI TESTIMONI / DOKUMENTASI PROOFS DARI DATABASE */}
        <HomeProofsSection proofs={proofs} />

        {/* 08. FAQ SECTION */}
        <FAQSection />

        {/* 09. FINAL CTA */}
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
