import { Suspense } from 'react';

import Navbar from '@/components/website/layout/Navbar';
import Footer from '@/components/website/layout/Footer';
import WhatsAppButton from '@/components/website/layout/WhatsAppButton';
import { getSiteSettings } from '@/lib/supabase/public-data';
import { siteUrl } from '@/lib/seo';

async function WebsiteChrome({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const instagram = settings.instagram
    ? settings.instagram.startsWith('http')
      ? settings.instagram
      : `https://instagram.com/${settings.instagram.replace(/^@/, '')}`
    : null;
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.business_name,
    url: siteUrl,
    logo: settings.logo_path?.startsWith('http')
      ? settings.logo_path
      : new URL(settings.logo_path || '/logo.png', siteUrl).toString(),
    ...(settings.description ? { description: settings.description } : {}),
    ...(instagram ? { sameAs: [instagram] } : {}),
    ...(settings.email || settings.phone_number
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            ...(settings.phone_number ? { telephone: settings.phone_number } : {}),
            ...(settings.email ? { email: settings.email } : {}),
            contactType: 'customer support',
          },
        }
      : {}),
  };
  return (
    <>
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[100] rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground focus:not-sr-only"
      >
        Lewati ke konten utama
      </a>
      <Navbar settings={settings} />
      <main id="main-content" className="website-motion min-h-screen pt-24">{children}</main>

      <Footer settings={settings} />
      <WhatsAppButton number={settings.whatsapp || settings.phone_number} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }} />
    </>
  );
}

export default function WebsiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Suspense fallback={<main id="main-content" className="min-h-screen pt-24" aria-busy="true" />}><WebsiteChrome>{children}</WebsiteChrome></Suspense>;
}
