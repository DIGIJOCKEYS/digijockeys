import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

import ThemeProvider from '@/components/providers/ThemeProvider';

export const metadata: Metadata = {
  title: {
    default: 'DigiJockeys | Digital Creative Studio',
    template: '%s | DigiJockeys',
  },
  description: 'DigiJockeys - Digital Solutions, Web Development, Design, and Creative Services.',
  applicationName: 'DigiJockeys',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
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
