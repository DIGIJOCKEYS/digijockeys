import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import type { ReactNode } from 'react';

import './globals.css';

import ThemeProvider from '@/components/providers/ThemeProvider';
import { getSiteSettings } from '@/lib/supabase/public-data';
import { googleVerificationToken, siteUrl } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  'use cache';
  cacheLife('minutes');
  const settings = await getSiteSettings();
  const title = settings.meta_title?.trim() || `${settings.business_name} | Jasa Website & Solusi Digital Kreatif`;
  const description = settings.meta_description?.trim() || settings.description?.trim() || 'DigiJockeys membantu bisnis, individu, dan mahasiswa melalui layanan website, desain kreatif, dan pendampingan akademik.';

  return {
    metadataBase: siteUrl,
    title: { default: title, template: `%s | ${settings.business_name}` },
    description,
    keywords: settings.keywords,
    applicationName: settings.business_name,
    creator: settings.business_name,
    publisher: settings.business_name,
    verification: { google: googleVerificationToken },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      siteName: settings.business_name,
      title,
      description,
      url: siteUrl,
      images: [{ url: '/logo.png', width: 512, height: 512, alt: settings.business_name }],
    },
    twitter: { card: 'summary', title, description, images: ['/logo.png'] },
    icons: {
      icon: settings.favicon_path || '/logo.png',
      shortcut: settings.favicon_path || '/logo.png',
      apple: settings.favicon_path || '/logo.png',
    },
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
