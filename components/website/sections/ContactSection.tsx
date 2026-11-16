import { ContactDetails } from '@/components/website/sections/ContentSections';
import type { SiteSettings } from '@/lib/supabase/public-data';

export default function ContactSection({ settings }: { settings: SiteSettings }) {
  return <ContactDetails settings={settings} />;
}
