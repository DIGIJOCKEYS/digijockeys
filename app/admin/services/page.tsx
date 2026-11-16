import ServicesPageClient from '@/components/admin/pages/ServicesPageClient';

// Admin data is fetched from authenticated Supabase client state after mount.
export const instant = false;

export default function ServicesPage() {
  return <ServicesPageClient />;
}
