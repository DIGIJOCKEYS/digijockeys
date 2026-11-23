import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cacheLife } from 'next/cache';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const publicDb = url && key
  ? createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

export type SiteSettings = {
  business_name: string;
  tagline: string | null;
  description: string | null;
  logo_path: string | null;
  email: string | null;
  phone_number: string | null;
  whatsapp: string | null;
  instagram: string | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[];
  favicon_path: string | null;
};

export const defaultSettings: SiteSettings = {
  business_name: 'DigiJockeys', tagline: null, description: null, logo_path: '/logo.png',
  email: 'digijockeys@gmail.com', phone_number: '082241826598', whatsapp: '6282241826598', instagram: 'https://www.instagram.com/digijockeys__/',
  meta_title: null, meta_description: null, keywords: [], favicon_path: '/logo.png',
};

export { extractServiceName } from './client-utils';

function mediaUrl(path: string | null) {
  if (!path) return null;
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('/')) return path;
  return publicDb?.storage.from('site-media').getPublicUrl(path).data.publicUrl ?? path;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  'use cache';
  cacheLife('seconds');
  if (!publicDb) return defaultSettings;
  const { data } = await publicDb.from('site_settings').select('business_name,tagline,description,logo_path,favicon_path,email,phone_number,whatsapp,instagram,meta_title,meta_description,keywords').eq('id', 1).maybeSingle();
  const settings = {
    ...defaultSettings,
    ...(data ?? {}),
    email: data?.email || defaultSettings.email,
    phone_number: data?.phone_number || defaultSettings.phone_number,
    whatsapp: data?.whatsapp || defaultSettings.whatsapp,
    instagram: data?.instagram || defaultSettings.instagram,
  };
  return { ...settings, logo_path: mediaUrl(settings.logo_path), favicon_path: mediaUrl(settings.favicon_path) };
}

export async function getServices() {
  'use cache';
  cacheLife('seconds');
  if (!publicDb) return [];
  const { data } = await publicDb.from('services').select('id,name,category,description,cover_image').eq('status', 'active').order('created_at', { ascending: false });
  return (data ?? []).map((service) => ({ ...service, cover_image: mediaUrl(service.cover_image) }));
}

export async function getProjects() {
  'use cache';
  cacheLife('seconds');
  if (!publicDb) return [];
  const { data } = await publicDb.from('portfolio_projects').select('id,project_name,category,description,cover_image,project_url,service_id,portfolio_images(id,image_path,alt_text,sort_order)').eq('status', 'published').order('created_at', { ascending: false });
  return (data ?? []).map((project) => ({
    ...project,
    cover_image: mediaUrl(project.cover_image),
    portfolio_images: [...(project.portfolio_images ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => ({ ...image, image_path: mediaUrl(image.image_path) ?? image.image_path })),
  }));
}

export async function getTestimonials() {
  'use cache';
  cacheLife('seconds');
  if (!publicDb) return [];
  const { data } = await publicDb.from('testimonials').select('id,customer_name,service_id,rating,description,created_at,services(name)').eq('status', 'published').order('created_at', { ascending: false });
  return data ?? [];
}

export async function getProofs() {
  'use cache';
  cacheLife('seconds');
  if (!publicDb) return [];
  const { data } = await publicDb.from('customer_proofs').select('id,image_path,description,proof_date,services(name)').eq('status', 'published').order('proof_date', { ascending: false });
  return (data ?? []).map((proof) => ({ ...proof, image_path: mediaUrl(proof.image_path) ?? proof.image_path }));
}
