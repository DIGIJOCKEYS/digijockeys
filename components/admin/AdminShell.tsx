'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { createClient } from '@/lib/supabase/client';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import ActionToast from '@/components/shared/ActionToast';

interface AdminShellProps {
  children: ReactNode;
}

interface AdminProfile {
  fullName: string;
  email: string;
  avatarUrl: string;
}

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/services': 'Services',
  '/admin/portfolio': 'Portfolio',
  '/admin/testimonials': 'Testimonials',
  '/admin/settings': 'Settings',
};

export default function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({ fullName: 'Administrator', email: '', avatarUrl: '' });
  useEffect(() => {
    let active = true;
    const supabase = createClient();
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }
      const { data: profile } = await supabase.from('profiles').select('id,full_name,email,avatar_path').eq('id', user.id).maybeSingle();
      if (!profile) { await supabase.auth.signOut(); router.replace('/login'); return; }
      if (active) {
        setAdminProfile({ fullName: profile.full_name ?? user.user_metadata.full_name ?? 'Administrator', email: profile.email ?? user.email ?? '', avatarUrl: profile.avatar_path ? (profile.avatar_path.startsWith('http') ? profile.avatar_path : supabase.storage.from('site-media').getPublicUrl(profile.avatar_path).data.publicUrl) : '' });
        setAuthorized(true);
      }
    })();
    return () => { active = false; };
  }, [router]);

  const currentPage = Object.keys(pageTitles)
    .filter((path) => pathname === path || (path !== '/admin' && pathname.startsWith(`${path}/`)))
    .sort((a, b) => b.length - a.length)[0];

  const pageTitle = currentPage ? pageTitles[currentPage] : 'Dashboard';

  if (!authorized) return <div className="flex min-h-screen items-center justify-center bg-background"><div role="status" className="flex items-center gap-3 text-sm text-muted-foreground"><span className="size-5 animate-spin rounded-full border-2 border-muted border-t-primary" />Loading admin workspace…</div></div>;
  return (
    <LanguageProvider>
    <div className="min-h-screen bg-background text-foreground">
      <ActionToast />
      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 max-w-[80vw] border-0 p-0 shadow-none">
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>

          <SheetDescription className="sr-only">Navigate between DigiJockeys admin pages.</SheetDescription>

          <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Area */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <AdminHeader profile={adminProfile} title={pageTitle} onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
    </LanguageProvider>
  );
}
