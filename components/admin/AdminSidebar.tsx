'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BriefcaseBusiness, FolderKanban, MessageSquareQuote, Settings } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';

const navigation = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Services',
    href: '/admin/services',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Portfolio',
    href: '/admin/portfolio',
    icon: FolderKanban,
  },
  {
    title: 'Testimonials',
    href: '/admin/testimonials',
    icon: MessageSquareQuote,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export default function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const labels: Record<string, string> = language === 'en' ? {} : { Dashboard: 'Dasbor', Services: 'Layanan', Portfolio: 'Portofolio', Testimonials: 'Testimoni', Settings: 'Pengaturan' };

  return (
    <aside className="flex h-full w-64 flex-col bg-card">
      {/* Brand */}
      <div className="flex h-20 items-center gap-3 border-b border-border px-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Image src="/logo.png" alt="DigiJockeys" width={40} height={40} className="size-10 rounded-xl object-contain" priority />
        </div>

        <div>
          <h2 className="text-base font-bold tracking-tight">DigiJockeys</h2>
          <p className="text-xs text-muted-foreground">{language === 'en' ? 'Admin Dashboard' : 'Dasbor Admin'}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{language === 'en' ? 'Workspace' : 'Ruang Kerja'}</p>

        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}
            >
              <Icon className="size-[18px]" />
              <span>{labels[item.title] ?? item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">DigiJockeys CMS</p>
        <p className="mt-1 text-xs text-muted-foreground">Version 1.0.0</p>
      </div>
    </aside>
  );
}
