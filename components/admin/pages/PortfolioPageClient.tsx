'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Search, FolderKanban, ExternalLink, Filter, Plus, Pencil, Trash2 } from 'lucide-react';

import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';

import PortfolioFormDialog, { type PortfolioFormData } from '@/components/admin/PortfolioFormDialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createClient } from '@/lib/supabase/client';
import { notify } from '@/components/shared/ActionToast';
import { compressImage } from '@/lib/images/compressImage';

// Portfolio Interface
interface Portfolio extends PortfolioFormData {
  id: string;
  updatedAt: string;
}

// Status Options
const statuses = ['All Status', 'Published', 'Draft'];

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All Status');

  // Form Dialog State
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

  // Delete Dialog State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(null);
  const loadPortfolio = async () => {
    const db = createClient();
    const [{ data, error }, { data: services }] = await Promise.all([
      db.from('portfolio_projects').select('*, portfolio_images(image_path,sort_order)').order('updated_at', { ascending: false }),
      db.from('services').select('category').eq('status', 'active').order('category'),
    ]);
    if (error) setError(error.message);
    else { setPortfolio((data ?? []).map((p) => { const images = (p.portfolio_images ?? []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order).map((image: { image_path: string }) => image.image_path.startsWith('http') ? image.image_path : db.storage.from('site-media').getPublicUrl(image.image_path).data.publicUrl); return { id: p.id, name: p.project_name, category: p.category, thumbnail: p.cover_image ? (p.cover_image.startsWith('http') ? p.cover_image : db.storage.from('site-media').getPublicUrl(p.cover_image).data.publicUrl) : '', galleryPaths: images, description: p.description ?? '', projectUrl: p.project_url ?? '', status: p.status === 'published' ? 'Published' : 'Draft', updatedAt: p.updated_at }; })); setServiceCategories([...new Set((services ?? []).map((item) => item.category))]); setError(''); }
  };
  useEffect(() => { const timer = window.setTimeout(() => { void loadPortfolio(); }, 0); return () => window.clearTimeout(timer); }, []);

  // Open Add Dialog
  const handleAddClick = () => {
    setSelectedPortfolio(null);
    setFormOpen(true);
  };

  // Add Portfolio
  const handleAddPortfolio = async (data: PortfolioFormData) => {
    return persistPortfolio(data);
  };

  // Open Edit Dialog
  const handleEditPortfolio = (project: Portfolio) => {
    setSelectedPortfolio(project);
    setFormOpen(true);
  };

  // Update Portfolio
  const handleUpdatePortfolio = async (data: PortfolioFormData) => {
    if (!selectedPortfolio) return false;

    return persistPortfolio(data, selectedPortfolio.id);
  };

  const persistPortfolio = async (data: PortfolioFormData, id?: string): Promise<boolean> => {
    setSaving(true); setError(''); setNotice('Uploading images and saving project…');
    const db = createClient();
    const uploaded: string[] = [];
    const upload = async (file: File, folder: string) => { const optimized = await compressImage(file); if (optimized.size > 5 * 1024 * 1024) throw new Error(`Compressed image ${file.name} is still above the 5 MB upload limit.`); const path = `${folder}/${crypto.randomUUID()}.webp`; const { error } = await db.storage.from('site-media').upload(path, optimized, { upsert: false, contentType: 'image/webp' }); if (error) throw error; uploaded.push(path); return path; };
    try {
      const thumbnailPath = data.thumbnailFile ? await upload(data.thumbnailFile, 'portfolio') : (id ? (await db.from('portfolio_projects').select('cover_image').eq('id', id).single()).data?.cover_image : null);
      const { data: service } = await db.from('services').select('id').eq('category', data.category).eq('status', 'active').limit(1).maybeSingle();
      const payload = { project_name: data.name, category: data.category, service_id: service?.id ?? null, cover_image: thumbnailPath, description: data.description || null, project_url: data.projectUrl || null, status: data.status.toLowerCase() };
      let projectId = id;
      const result = id ? await db.from('portfolio_projects').update(payload).eq('id', id) : await db.from('portfolio_projects').insert(payload).select('id').single();
      if (result.error) throw result.error;
      if (!id) { if (!result.data) throw new Error('The project was saved without returning its ID.'); projectId = result.data.id; }
      const newGallery = [];
      const galleryFiles = data.galleryFiles ?? [];
      for (let index = 0; index < galleryFiles.length; index += 3) {
        setNotice(`Optimizing and uploading gallery photos ${index + 1}–${Math.min(index + 3, galleryFiles.length)} of ${galleryFiles.length}…`);
        newGallery.push(...await Promise.all(galleryFiles.slice(index, index + 3).map((file) => upload(file, 'portfolio/gallery'))));
      }
      if (id) { const { error } = await db.from('portfolio_images').delete().eq('portfolio_id', projectId!); if (error) throw error; }
      const gallery = [...(data.galleryPaths ?? []), ...newGallery];
      if (gallery.length) { const { error } = await db.from('portfolio_images').insert(gallery.map((image_path, sort_order) => ({ portfolio_id: projectId!, image_path, sort_order }))); if (error) throw error; }
      await loadPortfolio(); setNotice(id ? 'Portfolio project updated successfully.' : 'Portfolio project created successfully.'); notify(id ? 'Portfolio project updated.' : 'Portfolio project created.'); setSaving(false); return true;
    } catch (cause) {
      if (uploaded.length) await db.storage.from('site-media').remove(uploaded);
      const message = cause instanceof Error ? cause.message : 'Unable to save portfolio project.'; setError(message); setNotice(''); notify(message, 'error'); setSaving(false); return false;
    }
  };

  // Handle Form Submit
  const handleFormSubmit = async (data: PortfolioFormData) => {
    if (selectedPortfolio) {
      return handleUpdatePortfolio(data);
    } else {
      return handleAddPortfolio(data);
    }
  };

  // Open Delete Confirmation
  const handleDeleteClick = (project: Portfolio) => {
    setPortfolioToDelete(project);
    setDeleteOpen(true);
  };

  // Delete Portfolio
  const handleDeletePortfolio = async () => {
    if (!portfolioToDelete) return;

    setDeleting(true);
    const { error } = await createClient().from('portfolio_projects').delete().eq('id', portfolioToDelete.id);
    if (error) { setError(error.message); notify(error.message, 'error'); setDeleting(false); return; }
    await loadPortfolio(); notify('Portfolio project deleted.'); setDeleting(false);

    setPortfolioToDelete(null);
    setDeleteOpen(false);
  };

  // Filter Portfolio
  const filteredPortfolio = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return portfolio.filter((project) => {
      const matchesSearch = [project.name, project.category, project.description].join(' ').toLowerCase().includes(keyword);

      const matchesCategory = category === 'All Categories' || project.category === category;

      const matchesStatus = status === 'All Status' || project.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [portfolio, search, category, status]);

  // Summary Statistics
  const publishedCount = portfolio.filter((project) => project.status === 'Published').length;

  const draftCount = portfolio.filter((project) => project.status === 'Draft').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Portfolio"
        description="Manage and showcase your completed projects."
        action={
          <Button onClick={handleAddClick}>
            <Plus className="size-4" />
            Add Project
          </Button>
        }
      />
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {notice && <p role="status" className="text-sm text-emerald-600">{notice}</p>}

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Projects</CardDescription>
            <FolderKanban className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <CardTitle className="text-2xl">{portfolio.length}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">All portfolio projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Published</CardDescription>
            <ExternalLink className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <CardTitle className="text-2xl">{publishedCount}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Visible on public website</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Drafts</CardDescription>
            <FolderKanban className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <CardTitle className="text-2xl">{draftCount}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Unpublished projects</p>
          </CardContent>
        </Card>
      </section>

      {/* Portfolio Listing */}
      <Card>
        <CardHeader>
          <div className="space-y-1">
            <CardTitle>All Projects</CardTitle>
            <CardDescription>Manage your portfolio projects and publication status.</CardDescription>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-3 pt-3 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects..." className="pl-9" />
            </div>

            {/* Category Filter */}
            <div className="relative flex-1 sm:flex-none">
              <Filter className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-10 w-full appearance-none rounded-md border border-input bg-background pl-9 pr-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 sm:w-48"
              >
                {['All Categories', ...serviceCategories].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 sm:w-36"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent>
          {filteredPortfolio.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Preview</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredPortfolio.map((project) => (
                    <TableRow key={project.id}>
                      {/* Project Information */}
                      <TableCell>
                        <div className="flex min-w-[230px] items-center gap-3">
                          <div className="size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                            <Image src={project.thumbnail} alt={project.name} width={56} height={56} unoptimized className="size-full object-cover" loading="lazy" />
                          </div>

                          <div className="min-w-0 space-y-1">
                            <p className="truncate font-medium">{project.name}</p>
                            <p className="text-xs text-muted-foreground">{project.projectUrl}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{project.category}</span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge variant={project.status === 'Published' ? 'default' : 'secondary'}>{project.status}</Badge>
                      </TableCell>

                      {/* Updated Date */}
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{project.updatedAt}</TableCell>

                      {/* Preview */}
                      <TableCell>
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Preview ${project.name}`}
                          className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditPortfolio(project)} aria-label={`Edit ${project.name}`}>
                            <Pencil className="size-4" />
                          </Button>

                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteClick(project)} aria-label={`Delete ${project.name}`}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={<FolderKanban className="size-6" />}
              title="No projects found"
              description={search || category !== 'All Categories' || status !== 'All Status' ? 'Try adjusting your search or filters.' : "You haven't added any portfolio projects yet."}
            />
          )}

          {/* Table Footer */}
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Showing {filteredPortfolio.length} of {portfolio.length} projects
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Portfolio Dialog */}
      <PortfolioFormDialog
        key={selectedPortfolio?.id ?? 'new-project'}
        categories={serviceCategories}
        saving={saving}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setSelectedPortfolio(null);
          }
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedPortfolio}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);

          if (!open) {
            setPortfolioToDelete(null);
          }
        }}
        title="Delete Portfolio Project?"
        description={`Are you sure you want to delete "${portfolioToDelete?.name ?? 'this project'}"? This action cannot be undone.`}
        confirmText="Delete Project"
        cancelText="Cancel"
        onConfirm={handleDeletePortfolio}
        loading={deleting}
      />
    </div>
  );
}
