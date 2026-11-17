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

export const metadata: Metadata = {
  title: 'DIGI JOCKEYS — Digital Creative & Academic Solutions',
  description: 'Digijockeys hadir membantu kebutuhan digital, kreatif, dan akademik melalui solusi yang dirancang secara profesional, praktis, dan sesuai kebutuhan Anda.',
  keywords: [
    'jasa pembuatan website',
    'desain grafis',
    'bimbingan skripsi',
    'pendampingan thesis',
    'analisis data',
    'studio kreatif digital',
    'DigiJockeys',
  ],
  openGraph: {
    title: 'DIGI JOCKEYS — Digital Creative & Academic Solutions',
    description: 'Solusi digital, kreatif, dan akademik dalam satu tempat.',
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
