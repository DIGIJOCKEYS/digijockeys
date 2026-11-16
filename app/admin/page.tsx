import AdminDashboard from '@/components/admin/AdminDashboard';

// The admin dashboard loads authenticated Supabase data in the browser.
// Keep instant-navigation validation scoped out at this route boundary.
export const instant = false;

export default function DashboardPage() {
  return <AdminDashboard />;
}
