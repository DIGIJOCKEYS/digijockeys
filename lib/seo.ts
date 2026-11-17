import type { Metadata } from 'next';

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.digijockeys.com').replace(/\/$/, '');
export const googleVerificationToken = 'slnqBhkw2UGauEfaS5uK3vlUEoGPbI9RVU05LtA8E2o';

export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const fullTitle = `${title} | DigiJockeys`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      siteName: 'DigiJockeys',
      title: fullTitle,
      description,
      url: path,
      images: [{ url: '/logo.png', width: 512, height: 512, alt: 'DigiJockeys' }],
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
      images: ['/logo.png'],
    },
  };
}
