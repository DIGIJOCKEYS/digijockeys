import type { Metadata } from 'next';

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://digijockeys.vercel.app').replace(/\/$/, '');
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
    alternates: { canonical: new URL(path, siteUrl).toString() },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      siteName: 'DigiJockeys',
      title: fullTitle,
      description,
      url: new URL(path, siteUrl).toString(),
      images: [{ url: new URL('/logo.png', siteUrl).toString(), width: 512, height: 512, alt: 'DigiJockeys' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [new URL('/logo.png', siteUrl).toString()],
    },
  };
}
