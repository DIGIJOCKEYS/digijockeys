import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

import ThemeProvider from '@/components/providers/ThemeProvider';
import { googleVerificationToken, siteUrl } from '@/lib/seo';

const siteName = 'DigiJockeys';
const siteDescription = 'DigiJockeys membantu bisnis, individu, dan mahasiswa melalui layanan website, desain kreatif, dan pendampingan akademik.';

export const metadata: Metadata = {
  metadataBase: siteUrl,
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
    images: [{ url: '/logo.png', width: 512, height: 512, alt: siteName }],
  },
  twitter: { card: 'summary', title: `${siteName} | Jasa Website & Solusi Digital Kreatif`, description: siteDescription, images: ['/logo.png'] },
  icons: { icon: '/logo.png', shortcut: '/logo.png', apple: '/logo.png' },
};

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
