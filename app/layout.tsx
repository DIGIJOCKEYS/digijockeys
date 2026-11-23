import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cacheLife } from 'next/cache';

import './globals.css';

import ThemeProvider from '@/components/providers/ThemeProvider';
import { googleVerificationToken, siteUrl } from '@/lib/seo';
import { getSiteSettings } from '@/lib/supabase/public-data';

const siteName = 'DigiJockeys';
const siteDescription = 'DigiJockeys membantu bisnis, individu, dan mahasiswa melalui layanan website, desain kreatif, dan pendampingan akademik.';

const defaultMetadata: Metadata = {
  title: { default: `${siteName} | Jasa Website & Solusi Digital Kreatif`, template: `%s | ${siteName}` },
  description: siteDescription,
  keywords: ['jasa pembuatan website', 'desain grafis', 'studio digital kreatif', siteName],
  applicationName: siteName,
  creator: siteName,
  publisher: siteName,
  verification: { google: googleVerificationToken },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName,
    title: `${siteName} | Jasa Website & Solusi Digital Kreatif`,
    description: siteDescription,
    url: siteUrl,
    images: [{ url: new URL('/logo.png', siteUrl).toString(), width: 512, height: 512, alt: siteName }],
  },
  twitter: { card: 'summary_large_image', title: `${siteName} | Jasa Website & Solusi Digital Kreatif`, description: siteDescription, images: [new URL('/logo.png', siteUrl).toString()] },
  icons: { icon: '/logo.png', shortcut: '/logo.png', apple: '/logo.png' },
};

export async function generateMetadata(): Promise<Metadata> {
  'use cache';
  cacheLife('minutes');
  const settings = await getSiteSettings();
  const title = settings.meta_title?.trim() || `${settings.business_name} | Jasa Website & Solusi Digital Kreatif`;
  const description = settings.meta_description?.trim() || settings.description?.trim() || siteDescription;
  const logoUrl = settings.logo_path?.startsWith('http')
    ? settings.logo_path
    : new URL(settings.logo_path || '/logo.png', siteUrl).toString();

  return {
    ...defaultMetadata,
    title: { default: title, template: `%s | ${settings.business_name}` },
    description,
    keywords: settings.keywords.length ? settings.keywords : defaultMetadata.keywords,
    applicationName: settings.business_name,
    creator: settings.business_name,
    publisher: settings.business_name,
    openGraph: {
      ...defaultMetadata.openGraph,
      siteName: settings.business_name,
      title,
      description,
      url: siteUrl,
      images: [{ url: logoUrl, width: 512, height: 512, alt: settings.business_name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [logoUrl] },
    icons: { icon: settings.favicon_path || '/logo.png', shortcut: settings.favicon_path || '/logo.png', apple: settings.favicon_path || '/logo.png' },
  };
}

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
