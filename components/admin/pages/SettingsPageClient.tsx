'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Globe, Mail, Share2, Search, Save, RotateCcw, Building2, Phone, CheckCircle2, Camera, LoaderCircle } from 'lucide-react';

import PageHeader from '@/components/shared/PageHeader';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import { notify } from '@/components/shared/ActionToast';

// ==========================================
// SETTINGS INTERFACE
// ==========================================

interface SettingsData {
  // General
  siteName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;

  // Contact
  email: string;
  phone: string;
  whatsapp: string;

  // Social Media
  instagram: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string;

  // Website
  maintenanceMode: boolean;
  websitePublished: boolean;
}

// ==========================================
// INITIAL SETTINGS
// ==========================================

const initialSettings: SettingsData = {
  // General
  siteName: 'DigiJockeys',
  tagline: 'Digital Solutions for Your Business',
  description: 'DigiJockeys provides digital services including web development, design, branding, and academic assistance.',
  logoUrl: '/logo.png',
  faviconUrl: '/logo.png',

  // Contact
  email: 'hello@digijockeys.com',
  phone: '',
  whatsapp: '',

  // Social Media
  instagram: '',

  // SEO
  metaTitle: 'DigiJockeys - Digital Solutions',
  metaDescription: 'Professional digital services for your business. Web development, creative design, and digital solutions.',
  keywords: 'DigiJockeys, web development, website design, graphic design, branding',

  // Website
  maintenanceMode: false,
  websitePublished: true,
};

// ==========================================
// SETTINGS PAGE
// ==========================================

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    ...initialSettings,
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    void (async () => {
      const { data, error } = await createClient().from('site_settings').select('*').eq('id', 1).maybeSingle();
      if (error) { setSaveError(error.message); return; }
      if (!data) return;
      setSettings((current) => ({ ...current, siteName: data.business_name, tagline: data.tagline ?? '', description: data.description ?? '', logoUrl: '/logo.png', faviconUrl: '/logo.png', email: data.email ?? '', phone: data.phone_number ?? '', whatsapp: data.whatsapp ?? '', instagram: data.instagram ?? '', metaTitle: data.meta_title ?? '', metaDescription: data.meta_description ?? '', keywords: data.keywords.join(', '), maintenanceMode: data.maintenance_mode, websitePublished: data.website_published }));
    })();
  }, []);

  // ==========================================
  // UPDATE SETTINGS
  // ==========================================

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  };

  // ==========================================
  // SAVE SETTINGS
  // ==========================================

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setSaveError('');
    const { error } = await createClient().from('site_settings').update({ business_name: settings.siteName, tagline: settings.tagline || null, description: settings.description || null, logo_path: '/logo.png', favicon_path: '/logo.png', email: settings.email || null, phone_number: settings.phone || null, whatsapp: settings.whatsapp || null, instagram: settings.instagram || null, meta_title: settings.metaTitle || null, meta_description: settings.metaDescription || null, keywords: settings.keywords.split(',').map((item) => item.trim()).filter(Boolean), maintenance_mode: settings.maintenanceMode, website_published: settings.websitePublished }).eq('id', 1);
    if (error) { setSaveError(error.message); notify(error.message, 'error'); } else { setSaved(true); notify('Site settings saved successfully.'); }
    setSaving(false);
  };

  // ==========================================
  // RESET SETTINGS
  // ==========================================

  const handleReset = () => {
    setSettings({ ...initialSettings });
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <PageHeader
        title="Settings"
        description="Manage your website configuration and business information."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="size-4" />
              Reset
            </Button>

            <Button onClick={handleSave} disabled={saving}>
              {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
              {saving ? 'Menyimpan…' : 'Save Changes'}
            </Button>
          </div>
        }
      />

      {/* SAVE STATUS */}
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          Settings saved to the website configuration.
        </div>
      )}

      {/* ====================================== */}
      {/* GENERAL INFORMATION */}
      {/* ====================================== */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="size-5" />
            </div>

            <div>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Manage your business identity and website information.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            {/* BUSINESS NAME */}
            <div className="space-y-2">
              <Label htmlFor="site-name">Business Name</Label>

              <Input id="site-name" value={settings.siteName} onChange={(event) => updateSetting('siteName', event.target.value)} placeholder="DigiJockeys" />
            </div>

            {/* TAGLINE */}
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>

              <Input id="tagline" value={settings.tagline} onChange={(event) => updateSetting('tagline', event.target.value)} placeholder="Your business tagline" />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="business-description">Business Description</Label>

            <Textarea id="business-description" value={settings.description} onChange={(event) => updateSetting('description', event.target.value)} rows={4} placeholder="Describe your business..." />
          </div>

          <Separator />

          <div className="grid gap-5 md:grid-cols-2">
            {/* LOGO */}
            <div className="space-y-2">
              <Label htmlFor="logo-url">Logo URL</Label>

              <Input id="logo-url" value="/logo.png" readOnly />

              <p className="text-xs text-muted-foreground">Public image URL for your business logo.</p>
            </div>

            {/* FAVICON */}
            <div className="space-y-2">
              <Label htmlFor="favicon-url">Favicon URL</Label>

              <Input id="favicon-url" value="/logo.png" readOnly />
            </div>
          </div>

          {/* LOGO PREVIEW */}
          {settings.logoUrl && (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex size-14 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
                <Image
                  src={settings.logoUrl}
                  alt="Business logo preview"
                  width={56}
                  height={56}
                  unoptimized
                  className="size-full object-contain"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display = 'block';
                  }}
                />
      {saveError && <p role="alert" className="text-sm text-destructive">{saveError}</p>}
              </div>

              <div>
                <p className="text-sm font-medium">Logo Preview</p>
                <p className="text-xs text-muted-foreground">Your business logo.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ====================================== */}
      {/* CONTACT INFORMATION */}
      {/* ====================================== */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail className="size-5" />
            </div>

            <div>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Manage the contact details displayed on your website.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            {/* EMAIL */}
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email Address</Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input id="contact-email" type="email" value={settings.email} onChange={(event) => updateSetting('email', event.target.value)} className="pl-9" placeholder="hello@example.com" />
              </div>
            </div>

            {/* PHONE */}
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone Number</Label>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input id="contact-phone" value={settings.phone} onChange={(event) => updateSetting('phone', event.target.value)} className="pl-9" placeholder="+62 812 xxxx xxxx" />
              </div>
            </div>

            {/* WHATSAPP */}
            <div className="space-y-2">
              <Label htmlFor="contact-whatsapp">WhatsApp Number</Label>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input id="contact-whatsapp" value={settings.whatsapp} onChange={(event) => updateSetting('whatsapp', event.target.value)} className="pl-9" placeholder="62812xxxxxxxx" />
              </div>

              <p className="text-xs text-muted-foreground">Use international format without the + sign.</p>
            </div>

          </div>

        </CardContent>
      </Card>

      {/* ====================================== */}
      {/* SOCIAL MEDIA */}
      {/* ====================================== */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Share2 className="size-5" />
            </div>

            <div>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Connect your social media profiles.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2">
          {/* INSTAGRAM */}
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>

            <div className="relative">
              <Camera className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input id="instagram" value={settings.instagram} onChange={(event) => updateSetting('instagram', event.target.value)} className="pl-9" placeholder="https://instagram.com/youraccount" />
            </div>
          </div>

        </CardContent>
      </Card>

      {/* ====================================== */}
      {/* SEO SETTINGS */}
      {/* ====================================== */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Search className="size-5" />
            </div>

            <div>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize your website for search engines.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* META TITLE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="meta-title">Meta Title</Label>

              <span className="text-xs text-muted-foreground">{settings.metaTitle.length}/60</span>
            </div>

            <Input id="meta-title" value={settings.metaTitle} onChange={(event) => updateSetting('metaTitle', event.target.value)} maxLength={60} placeholder="Your website title" />
          </div>

          {/* META DESCRIPTION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="meta-description">Meta Description</Label>

              <span className="text-xs text-muted-foreground">{settings.metaDescription.length}/160</span>
            </div>

            <Textarea id="meta-description" value={settings.metaDescription} onChange={(event) => updateSetting('metaDescription', event.target.value)} maxLength={160} rows={3} placeholder="Describe your website for search engines..." />
          </div>

          {/* KEYWORDS */}
          <div className="space-y-2">
            <Label htmlFor="meta-keywords">Keywords</Label>

            <Textarea id="meta-keywords" value={settings.keywords} onChange={(event) => updateSetting('keywords', event.target.value)} rows={2} placeholder="keyword one, keyword two, keyword three" />

            <p className="text-xs text-muted-foreground">Separate keywords with commas.</p>
          </div>

          {/* SEARCH PREVIEW */}
          <div className="space-y-2">
            <Label>Search Engine Preview</Label>

            <div className="rounded-lg border border-border bg-background p-4">
              <p className="truncate text-lg font-medium text-blue-600 dark:text-blue-400">{settings.metaTitle || 'Website Title'}</p>

              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">www.digijockeys.com</p>

              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{settings.metaDescription || 'Your website description will appear here.'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ====================================== */}
      {/* WEBSITE CONFIGURATION */}
      {/* ====================================== */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Globe className="size-5" />
            </div>

            <div>
              <CardTitle>Website Configuration</CardTitle>
              <CardDescription>Manage your website availability and maintenance settings.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* WEBSITE PUBLISHED */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Website Published</p>

              <p className="text-xs text-muted-foreground">Control whether your website is publicly available.</p>
            </div>

            <input type="checkbox" checked={settings.websitePublished} onChange={(event) => updateSetting('websitePublished', event.target.checked)} className="size-4 cursor-pointer accent-primary" aria-label="Website published" />
          </div>

          <Separator />

          {/* MAINTENANCE MODE */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Maintenance Mode</p>

                {settings.maintenanceMode && <Badge variant="destructive">Enabled</Badge>}
              </div>

              <p className="text-xs text-muted-foreground">Temporarily display a maintenance page to visitors.</p>
            </div>

            <input type="checkbox" checked={settings.maintenanceMode} onChange={(event) => updateSetting('maintenanceMode', event.target.checked)} className="size-4 cursor-pointer accent-primary" aria-label="Maintenance mode" />
          </div>

          {/* MAINTENANCE NOTICE */}
          {settings.maintenanceMode && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-700 dark:text-amber-400">
              Maintenance mode is enabled in the saved website configuration.
            </div>
          )}
        </CardContent>
      </Card>

      {/* ====================================== */}
      {/* BOTTOM ACTIONS */}
      {/* ====================================== */}

      <div className="flex flex-col-reverse justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
        <p className="text-xs text-muted-foreground">Website settings are saved to Supabase.</p>

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="size-4" />
            Reset
          </Button>

          <Button onClick={handleSave}>
            <Save className="size-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
