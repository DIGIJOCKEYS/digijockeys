import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import AdminShell from '@/components/admin/AdminShell';

// Admin routes load their session and data in client components, so they cannot
// produce a fully static instant-navigation shell yet.
export const instant = false;
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, noarchive: true },
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminShell>{children}</AdminShell>;
}
