import { CallToAction } from '@/components/website/sections/ContentSections';
import type { SiteSettings } from '@/lib/supabase/public-data';

export default function CTASection({ settings }: { settings: SiteSettings }) {
  return <CallToAction settings={settings} />;
}
