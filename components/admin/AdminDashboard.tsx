'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BriefcaseBusiness, Eye, FolderKanban, MessageSquareQuote, Plus, ArrowUpRight } from 'lucide-react';

import PageHeader from '@/components/shared/PageHeader';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createClient } from '@/lib/supabase/client';

const statisticDefaults = [
  {
    title: 'Total Services',
    value: '08',
    description: 'Available business services',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Portfolio Projects',
    value: '24',
    description: 'Projects in your portfolio',
    icon: FolderKanban,
  },
  {
    title: 'Testimonials',
    value: '18',
    description: 'Customer testimonials',
    icon: MessageSquareQuote,
  },
  {
    title: 'Total Views',
    value: '1,284',
    description: 'Portfolio page views',
    icon: Eye,
  },
];

const recentProjects: { id: string; name: string; category: string; status: string; date: string }[] = [];

function getStatusVariant(status: string) {
  switch (status) {
    case 'Published':
      return 'default';
    case 'In Review':
      return 'secondary';
    default:
      return 'outline';
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [statistics, setStatistics] = useState(statisticDefaults.map((item) => ({ ...item, value: '0' })));
  const [projects, setProjects] = useState(recentProjects);
  useEffect(() => {
    void (async () => {
      const db = createClient();
      const [services, portfolio, reviews] = await Promise.all([
        db.from('services').select('id', { count: 'exact', head: true }),
        db.from('portfolio_projects').select('id, project_name, category, status, updated_at').order('updated_at', { ascending: false }).limit(4),
        db.from('testimonials').select('id', { count: 'exact', head: true }),
      ]);
      setStatistics((current) => current.map((item) => ({ ...item, value: item.title === 'Total Services' ? String(services.count ?? 0) : item.title === 'Portfolio Projects' ? String(portfolio.data?.length ?? 0) : item.title === 'Testimonials' ? String(reviews.count ?? 0) : '—' })));
      setProjects((portfolio.data ?? []).map((p) => ({ id: p.id, name: p.project_name, category: p.category, status: p.status === 'published' ? 'Published' : 'Draft', date: new Date(p.updated_at).toLocaleDateString() })));
    })();
  }, []);
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Dashboard Overview"
        description="Monitor your business performance and manage your content."
        action={
            <Button onClick={() => router.push('/admin/portfolio')}>
            <Plus className="size-4" />
            Add New
          </Button>
        }
      />

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>{item.title}</CardDescription>

                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon className="size-4" />
                </div>
              </CardHeader>

              <CardContent>
                <CardTitle className="text-2xl font-bold">{item.value}</CardTitle>

                <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Recent Projects */}
      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Overview of your latest portfolio projects.</CardDescription>
            </div>

              <Button variant="outline" size="sm" onClick={() => router.push('/admin/portfolio')}>
              View All
              <ArrowUpRight className="size-4" />
              </Button>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>

                      <TableCell className="text-muted-foreground">{project.category}</TableCell>

                      <TableCell>
                        <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                      </TableCell>

                      <TableCell className="text-muted-foreground">{project.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
