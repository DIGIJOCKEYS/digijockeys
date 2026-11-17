import { Suspense } from 'react';

import Navbar from '@/components/website/layout/Navbar';
import Footer from '@/components/website/layout/Footer';
import WhatsAppButton from '@/components/website/layout/WhatsAppButton';
import { getSiteSettings } from '@/lib/supabase/public-data';

async function WebsiteChrome({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  return (
    <>
      <Navbar settings={settings} />

      <main className="website-motion min-h-screen pt-24">{children}</main>

      <Footer settings={settings} />
      <WhatsAppButton number={settings.whatsapp || settings.phone_number} />
    </>
  );
}

export default function WebsiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Suspense fallback={<main className="min-h-screen pt-24" aria-busy="true" />}><WebsiteChrome>{children}</WebsiteChrome></Suspense>;
}
