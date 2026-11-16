'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, MessageSquareQuote, Star, Pencil, Trash2, Filter, ArrowLeft } from 'lucide-react';

import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';

import TestimonialFormDialog, { type TestimonialFormData } from '@/components/admin/testimonials/reviews/TestimonialFormDialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createClient } from '@/lib/supabase/client';
import { notify } from '@/components/shared/ActionToast';

// ==========================================
// TYPES
// ==========================================

interface Testimonial extends TestimonialFormData {
  id: string;
  createdAt: string;
}

// ==========================================
// TEMPORARY DATA
// ==========================================

const services = ['All Services', 'Web Development', 'UI/UX Design', 'Graphic Design', 'Branding', 'Academic Assistance', 'Other'];

const statuses = ['All Status', 'Published', 'Draft'];

// ==========================================
// HELPERS
// ==========================================

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

// ==========================================
// PAGE
// ==========================================

export default function ReviewsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [service, setService] = useState('All Services');
  const [status, setStatus] = useState('All Status');

  const [formOpen, setFormOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const loadReviews = async () => {
    const { data, error } = await createClient().from('testimonials').select('*, services(name)').order('created_at', { ascending: false });
    if (error) setError(error.message); else { setTestimonials((data ?? []).map((t) => ({ id: t.id, name: t.customer_name, service: (t.services as { name: string } | null)?.name ?? '', rating: t.rating, message: t.description, status: t.status === 'published' ? 'Published' : 'Draft', createdAt: new Date(t.created_at).toLocaleDateString() })) as Testimonial[]); setError(''); }
  };
  useEffect(() => {
    const timer = window.setTimeout(() => { void loadReviews(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // ==========================================
  // ==========================================
  // EDIT
  // ==========================================

  const handleEditClick = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormOpen(true);
  };

  const handleUpdateTestimonial = async (data: TestimonialFormData) => {
    if (!selectedTestimonial) return false;

    setSaving(true);
    const db = createClient();
    const { error } = await db.from('testimonials').update({ status: data.status.toLowerCase() }).eq('id', selectedTestimonial.id);
    if (error) { setError(error.message); notify(error.message, 'error'); setSaving(false); return false; }
    await loadReviews(); notify('Review published successfully.'); setSaving(false);

    setSelectedTestimonial(null);
    return true;
  };

  const handleFormSubmit = (data: TestimonialFormData) => selectedTestimonial ? handleUpdateTestimonial(data) : Promise.resolve(false);

  // ==========================================
  // DELETE
  // ==========================================

  const handleDeleteClick = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial);
    setDeleteOpen(true);
  };

  const handleDeleteTestimonial = async () => {
    if (!testimonialToDelete) return;

    setDeleting(true);
    const { error } = await createClient().from('testimonials').delete().eq('id', testimonialToDelete.id);
    if (error) { setError(error.message); notify(error.message, 'error'); setDeleting(false); return; }
    await loadReviews(); notify('Review deleted successfully.'); setDeleting(false);

    setTestimonialToDelete(null);
    setDeleteOpen(false);
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredTestimonials = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return testimonials.filter((testimonial) => {
      const matchesSearch = [testimonial.name, testimonial.service, testimonial.message].join(' ').toLowerCase().includes(keyword);

      const matchesService = service === 'All Services' || testimonial.service === service;

      const matchesStatus = status === 'All Status' || testimonial.status === status;

      return matchesSearch && matchesService && matchesStatus;
    });
  }, [testimonials, search, service, status]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const publishedCount = testimonials.filter((item) => item.status === 'Published').length;

  const draftCount = testimonials.filter((item) => item.status === 'Draft').length;

  const averageRating = testimonials.length > 0 ? (testimonials.reduce((total, item) => total + item.rating, 0) / testimonials.length).toFixed(1) : '0.0';

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Reviews"
        description="Manage customer feedback, ratings, and written testimonials."
      />
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <Link href="/admin/testimonials" className="inline-flex h-9 w-fit items-center gap-2 rounded-md px-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          <ArrowLeft className="size-4" />
          Back to Testimonials
      </Link>

      {/* STATISTICS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Reviews</CardDescription>
            <MessageSquareQuote className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{testimonials.length}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">All customer reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Published</CardDescription>
            <MessageSquareQuote className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{publishedCount}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Visible on public website</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Drafts</CardDescription>
            <MessageSquareQuote className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{draftCount}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Unpublished reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Average Rating</CardDescription>
            <Star className="size-4 fill-amber-400 text-amber-400" />
          </CardHeader>
          <CardContent>
            <CardTitle className="flex items-center gap-2 text-2xl">
              {averageRating}
              <Star className="size-5 fill-amber-400 text-amber-400" />
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Based on all reviews</p>
          </CardContent>
        </Card>
      </section>

      {/* REVIEW LIST */}
      <Card>
        <CardHeader>
          <CardTitle>All Customer Reviews</CardTitle>
          <CardDescription>Search, filter, and manage customer feedback.</CardDescription>

          <div className="flex flex-col gap-3 pt-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer reviews..." className="pl-9" />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={service}
                onChange={(event) => setService(event.target.value)}
                className="h-10 w-full appearance-none rounded-md border border-input bg-background pl-9 pr-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 sm:w-52"
              >
                {services.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

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
          {filteredTestimonials.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Testimonial</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredTestimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell>
                        <div className="flex min-w-[190px] items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-xs font-semibold">
                            {getInitials(testimonial.name)}
                          </div>

                          <div className="min-w-0 space-y-1">
                            <p className="truncate font-medium">{testimonial.name}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="whitespace-nowrap text-sm text-muted-foreground">{testimonial.service}</span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="size-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{testimonial.rating}.0</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="max-w-[260px] truncate text-sm text-muted-foreground">{testimonial.message}</p>
                      </TableCell>

                      <TableCell>
                        <Badge variant={testimonial.status === 'Published' ? 'default' : 'secondary'}>{testimonial.status}</Badge>
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{testimonial.createdAt}</TableCell>

                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {testimonial.status === 'Draft' && <Button variant="ghost" size="icon" onClick={() => handleEditClick(testimonial)} aria-label={`Publish ${testimonial.name}`}><Pencil className="size-4" /></Button>}

                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteClick(testimonial)} aria-label={`Delete ${testimonial.name}`}>
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
              icon={<MessageSquareQuote className="size-6" />}
              title="No reviews found"
              description={search || service !== 'All Services' || status !== 'All Status' ? 'Try adjusting your search or filters.' : "You haven't added any reviews yet."}
            />
          )}

          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Showing {filteredTestimonials.length} of {testimonials.length} reviews
            </p>
          </div>
        </CardContent>
      </Card>

      {/* MODERATION DIALOG */}
      <TestimonialFormDialog
        key={selectedTestimonial?.id ?? 'closed'}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setSelectedTestimonial(null);
          }
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedTestimonial}
        saving={saving}
      />

      {/* DELETE DIALOG */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);

          if (!open) {
            setTestimonialToDelete(null);
          }
        }}
        title="Delete Review?"
        description={`Are you sure you want to delete the review from "${testimonialToDelete?.name ?? 'this customer'}"? This action cannot be undone.`}
        confirmText="Delete Review"
        cancelText="Cancel"
        onConfirm={handleDeleteTestimonial}
        loading={deleting}
      />
    </div>
  );
}
