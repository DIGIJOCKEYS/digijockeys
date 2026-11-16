'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Menu, Bell, UserRound, Settings, LogOut, ChevronDown, MessageSquareQuote, Info, CheckCheck, Circle, CheckCircle2, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

import ThemeToggle from '@/components/shared/ThemeToggle';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { createClient } from '@/lib/supabase/client';

// ==========================================
// TYPES
// ==========================================

type NotificationType = 'review' | 'info' | 'success' | 'warning';

interface Notification {
  id: string;
  title: string;
  message: string | null;
  link: string | null;
  created_at: string;
  type: NotificationType;
  is_read: boolean;
}

// ==========================================
// INITIAL NOTIFICATIONS
// ==========================================

// ==========================================
// ADMIN HEADER PROPS
// ==========================================

interface AdminHeaderProps {
  title?: string;
  onMenuClick?: () => void;
  profile: { fullName: string; email: string; avatarUrl: string };
}

// ==========================================
// ADMIN HEADER
// ==========================================

export default function AdminHeader({ title = 'Dashboard', onMenuClick, profile }: AdminHeaderProps) {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  const translatedTitle: Record<string, string> = {
    Dashboard: 'Dasbor',
    Services: 'Layanan',
    Portfolio: 'Portofolio',
    Testimonials: 'Testimoni',
    Settings: 'Pengaturan',
    Profile: 'Profil',
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [logoutError, setLogoutError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const [adminProfile, setAdminProfile] = useState(profile ?? { fullName: 'Administrator', email: '', avatarUrl: '' });

  useEffect(() => {
    const onProfileUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ avatarUrl: string | null; fullName: string; email: string }>).detail;
      setAdminProfile((current) => ({ ...current, ...detail, avatarUrl: detail.avatarUrl ?? '' }));
    };
    window.addEventListener('profile-updated', onProfileUpdate);
    return () => window.removeEventListener('profile-updated', onProfileUpdate);
  }, []);

  useEffect(() => {
    const db = createClient();
    const load = async () => {
      const { data, error } = await db.from('notifications').select('id,title,message,link,created_at,type,is_read').order('created_at', { ascending: false }).limit(30);
      if (error) { console.error('Unable to load notifications:', error.message); return; }
      setNotifications((data ?? []) as Notification[]);
    };
    void load();
    const channel = db.channel('admin-notifications').on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => { void load(); }).subscribe();
    return () => { void db.removeChannel(channel); };
  }, []);

  // ==========================================
  // NOTIFICATION HELPERS
  // ==========================================

  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  const markAsRead = async (notification: Notification) => {
    if (!notification.is_read) {
      setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, is_read: true } : item));
      const { error } = await createClient().from('notifications').update({ is_read: true }).eq('id', notification.id);
      if (error) console.error('Unable to mark notification as read:', error.message);
    }
    if (notification.link) router.push(notification.link);
  };

  const markAllAsRead = async () => {
    setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));
    const { error } = await createClient().from('notifications').update({ is_read: true }).eq('is_read', false);
    if (error) console.error('Unable to mark notifications as read:', error.message);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'review':
        return MessageSquareQuote;
      case 'success': return CheckCircle2;
      case 'warning': return TriangleAlert;

      default:
        return Info;
    }
  };

  const notificationCopy = (notification: Notification) => {
    const customer = notification.message?.match(/submitted by\s+(.+)/i)?.[1]?.trim();
    if (notification.type === 'review' || notification.title === 'New Customer Review') {
      return {
        title: 'Ulasan Pelanggan Baru',
        message: customer ? `Ulasan baru dikirim oleh ${customer}.` : 'Ada ulasan baru yang menunggu peninjauan.',
      };
    }
    const titles: Record<string, string> = { info: 'Informasi', success: 'Berhasil', warning: 'Peringatan' };
    return { title: titles[notification.type] ?? 'Notifikasi', message: notification.message ?? 'Ada informasi baru.' };
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError('');

    const { error } = await createClient().auth.signOut();

    if (error) {
      setLogoutError(error.message);
      setLoggingOut(false);
      return;
    }

    window.location.replace('/login');
  };

  // ==========================================
  // LANGUAGE HELPER
  // ==========================================

  const currentLanguage = {
    id: {
      name: 'Indonesia',
      icon: '/icon/id.svg',
      label: 'Pilih Bahasa',
    },
    en: {
      name: 'English',
      icon: '/icon/eng.svg',
      label: 'Choose Language',
    },
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      {/* ================================== */}
      {/* LEFT SECTION */}
      {/* ================================== */}

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Open navigation menu">
          <Menu className="size-5" />
        </Button>

        <div>
          <h1 className="text-sm font-semibold sm:text-base">{language === 'id' ? (translatedTitle[title] ?? title) : title}</h1>

          <p className="hidden text-xs text-muted-foreground sm:block">{language === 'en' ? 'Welcome back to DigiJockeys CMS' : 'Selamat datang kembali di CMS DigiJockeys'}</p>
        </div>
      </div>

      {/* ================================== */}
      {/* RIGHT SECTION */}
      {/* ================================== */}

      <div className="flex items-center gap-2">
        {/* ================================== */}
        {/* LANGUAGE DROPDOWN */}
        {/* ================================== */}

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="gap-2" aria-label={currentLanguage[language].label} />}>
            <Image src={currentLanguage[language].icon} alt={currentLanguage[language].name} width={20} height={20} className="size-5 rounded-full object-cover" />

            <span className="hidden sm:inline">{currentLanguage[language].name}</span>

            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={8} className="w-48 p-2 shadow-lg">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{language === 'en' ? 'Choose Language' : 'Pilih Bahasa'}</DropdownMenuLabel>

              {/* ENGLISH */}
              <DropdownMenuItem onClick={() => setLanguage('en')} className="gap-3 py-2.5">
                <Image src="/icon/eng.svg" alt="English" width={20} height={20} className="size-5 rounded-full object-cover" />

                <span>English</span>

                {language === 'en' && <span className="ml-auto text-xs text-primary">✓</span>}
              </DropdownMenuItem>

              {/* INDONESIA */}
              <DropdownMenuItem onClick={() => setLanguage('id')} className="gap-3 py-2.5">
                <Image src="/icon/id.svg" alt="Indonesia" width={20} height={20} className="size-5 rounded-full object-cover" />

                <span>Indonesia</span>

                {language === 'id' && <span className="ml-auto text-xs text-primary">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ================================== */}
        {/* NOTIFICATION DROPDOWN */}
        {/* ================================== */}

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="relative" aria-label="Notifications" />}>
            <Bell className="size-5" />

            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-[18px] items-center justify-center rounded-full border-2 border-background bg-destructive text-[9px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={10} className="w-[340px] max-w-[calc(100vw-2rem)] p-0">
            {/* HEADER */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{language === 'en' ? 'Notifications' : 'Notifikasi'}</p>

                    <p className="mt-1 text-xs font-normal text-muted-foreground">{language === 'en' ? `You have ${unreadCount} unread notifications` : `Ada ${unreadCount} notifikasi belum dibaca`}</p>
                  </div>

                  {unreadCount > 0 && <Badge variant="secondary">{unreadCount} Baru</Badge>}
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* MARK ALL AS READ */}
            {unreadCount > 0 && (
              <div className="flex justify-end px-3 py-2">
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllAsRead}>
                  <CheckCheck className="mr-1.5 size-3.5" />

                  {language === 'en' ? 'Mark all as read' : 'Tandai semua telah dibaca'}
                </Button>
              </div>
            )}

            {/* NOTIFICATION LIST */}
            <div className="max-h-[360px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const copy = notificationCopy(notification);

                  return (
                    <DropdownMenuItem key={notification.id} onClick={() => void markAsRead(notification)} className="flex cursor-pointer items-start gap-3 rounded-none px-4 py-3">
                      {/* ICON */}
                      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </div>

                      {/* CONTENT */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{copy.title}</p>

                          {!notification.is_read && <Circle className="size-2 shrink-0 fill-primary text-primary" />}
                        </div>

                        <p className="line-clamp-2 text-xs text-muted-foreground">{copy.message}</p>

                        <p className="text-[11px] text-muted-foreground">{new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(notification.created_at))}</p>
                      </div>
                    </DropdownMenuItem>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                  <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-muted">
                    <Bell className="size-5 text-muted-foreground" />
                  </div>

                  <p className="text-sm font-medium">{language === 'en' ? 'All caught up!' : 'Semua sudah terbaca!'}</p>

                  <p className="mt-1 text-xs text-muted-foreground">{language === 'en' ? "You don't have any notifications." : 'Tidak ada notifikasi.'}</p>
                </div>
              )}
            </div>

            <DropdownMenuSeparator />

            {/* FOOTER */}
            <div className="p-2">
              <p className="py-1 text-center text-[11px] text-muted-foreground">DigiJockeys CMS Notifications</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mx-1 h-7" />

        {/* ================================== */}
        {/* THEME TOGGLE */}
        {/* ================================== */}

        <ThemeToggle />

        <Separator orientation="vertical" className="mx-1 hidden h-7 sm:block" />

        {/* ================================== */}
        {/* ADMIN PROFILE DROPDOWN */}
        {/* ================================== */}

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="h-auto gap-2 px-2 py-1.5 hover:bg-muted" />}>
            <div className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-primary-foreground">{adminProfile.avatarUrl ? <Image src={adminProfile.avatarUrl} alt="Profile avatar" width={36} height={36} unoptimized className="size-full object-cover" /> : adminProfile.fullName.slice(0, 1).toUpperCase()}</div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight">{adminProfile.fullName}</p>

              <p className="mt-1 text-xs text-muted-foreground">Admin</p>
            </div>

            <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={8} className="w-56">
            {logoutError && (
              <p role="alert" className="px-2 py-1.5 text-xs text-destructive">
                {logoutError}
              </p>
            )}

            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">{adminProfile.fullName}</p>

                  <p className="text-xs text-muted-foreground">{adminProfile.email}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* PROFILE */}
            <DropdownMenuItem
              render={
                <Link href="/admin/profile">
                  <UserRound className="mr-2 size-4" />
                  {language === 'en' ? 'My Profile' : 'Profil Saya'}
                </Link>
              }
            />

            {/* SETTINGS */}
            <DropdownMenuItem
              render={
                <Link href="/admin/settings">
                  <Settings className="mr-2 size-4" />
                  {language === 'en' ? 'Account Settings' : 'Pengaturan Akun'}
                </Link>
              }
            />

            <DropdownMenuSeparator />

            {/* LOGOUT */}
            <DropdownMenuItem onClick={handleLogout} disabled={loggingOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 size-4" />

              {loggingOut ? (language === 'en' ? 'Logging out…' : 'Sedang keluar…') : language === 'en' ? 'Logout' : 'Keluar'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
