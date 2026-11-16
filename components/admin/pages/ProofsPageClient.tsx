'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Images, Plus, Pencil, Trash2, ArrowLeft, Eye } from 'lucide-react';

import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';

import ProofFormDialog, { type ProofFormData, type ProofService } from '@/components/admin/testimonials/proofs/ProofFormDialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createClient } from '@/lib/supabase/client';
import { notify } from '@/components/shared/ActionToast';

// ==========================================
// TYPES
// ==========================================

interface CustomerProof extends ProofFormData {
  id: string;
  createdAt: string;
  customerName: string;
  projectName: string;
  category: string;
}

// ==========================================
// TEMPORARY DATA
// ==========================================

const initialProofs: CustomerProof[] = [];

const statuses = ['All Status', 'Published', 'Draft'];

// ==========================================
// HELPERS
// ==========================================

// ==========================================
// PAGE
// ==========================================

export default function ProofsPage() {
  const [proofs, setProofs] = useState<CustomerProof[]>(initialProofs);
  const [services, setServices] = useState<ProofService[]>([]);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All Status');

  const [formOpen, setFormOpen] = useState(false);
  const [selectedProof, setSelectedProof] = useState<CustomerProof | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [proofToDelete, setProofToDelete] = useState<CustomerProof | null>(null);

  const [previewProof, setPreviewProof] = useState<CustomerProof | null>(null);
  const loadProofs = async () => {
    const db = createClient();
    const [{ data, error }, { data: serviceRows }] = await Promise.all([db.from('customer_proofs').select('*, services(id,name,category)').order('proof_date', { ascending: false }), db.from('services').select('id,name,category').eq('status', 'active').order('category')]);
    setServices((serviceRows ?? []) as ProofService[]);
    if (error) setError(error.message); else { setProofs((data ?? []).map((p) => { const service = p.services as { id: string; name: string; category: string } | null; const image = p.image_path.startsWith('http') ? p.image_path : db.storage.from('site-media').getPublicUrl(p.image_path).data.publicUrl; return { id: p.id, customerName: '', projectName: p.description || 'Customer proof', category: service?.category ?? 'Uncategorized', serviceId: service?.id ?? '', description: p.description ?? '', image, proofDate: p.proof_date, status: p.status === 'published' ? 'Published' : 'Draft', createdAt: p.proof_date }; })); setError(''); }
  };
  useEffect(() => { const timer = window.setTimeout(() => { void loadProofs(); }, 0); return () => window.clearTimeout(timer); }, []);

  // ==========================================
  // ADD
  // ==========================================

  const handleAddClick = () => {
    setSelectedProof(null);
    setFormOpen(true);
  };

  const persistProof = async (data: ProofFormData, id?: string): Promise<boolean> => {
    const db = createClient();
    let path = data.image;
    if (path.startsWith('data:')) {
      const blob = await (await fetch(path)).blob();
      const filePath = `proofs/${crypto.randomUUID()}.${blob.type.split('/')[1] || 'png'}`;
      const { error: uploadError } = await db.storage.from('site-media').upload(filePath, blob, { contentType: blob.type, upsert: false });
    if (uploadError) { setError(uploadError.message); notify(uploadError.message, 'error'); return false; }
      path = db.storage.from('site-media').getPublicUrl(filePath).data.publicUrl;
    }
    const payload = { service_id: data.serviceId || null, image_path: path, description: data.description || null, proof_date: data.proofDate, status: data.status.toLowerCase() };
    const result = id ? await db.from('customer_proofs').update(payload).eq('id', id) : await db.from('customer_proofs').insert(payload);
    if (result.error) { setError(result.error.message); notify(result.error.message, 'error'); return false; }
    await loadProofs(); setError(''); notify(id ? 'Customer proof updated.' : 'Customer proof uploaded.'); return true;
  };
  const handleAddProof = async (data: ProofFormData) => {
    return persistProof(data);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEditClick = (proof: CustomerProof) => {
    setSelectedProof(proof);
    setFormOpen(true);
  };

  const handleUpdateProof = async (data: ProofFormData) => {
    if (!selectedProof) return false;
    const saved = await persistProof(data, selectedProof.id);
    if (saved) setSelectedProof(null);
    return saved;
  };

  const handleFormSubmit = async (data: ProofFormData) => {
    if (selectedProof) {
      return handleUpdateProof(data);
    } else {
      return handleAddProof(data);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDeleteClick = (proof: CustomerProof) => {
    setProofToDelete(proof);
    setDeleteOpen(true);
  };

  const handleDeleteProof = async () => {
    if (!proofToDelete) return;

    setDeleting(true);
    const { error } = await createClient().from('customer_proofs').delete().eq('id', proofToDelete.id);
    if (error) { setError(error.message); notify(error.message, 'error'); setDeleting(false); return; }
    await loadProofs(); notify('Customer proof deleted.'); setDeleting(false);

    if (previewProof?.id === proofToDelete.id) {
      setPreviewProof(null);
    }

    setProofToDelete(null);
    setDeleteOpen(false);
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredProofs = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return proofs.filter((proof) => {
      const matchesSearch = [proof.customerName, proof.projectName, proof.description, proof.category].join(' ').toLowerCase().includes(keyword);

      const matchesCategory = category === 'All Categories' || proof.category === category;

      const matchesStatus = status === 'All Status' || proof.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [proofs, search, category, status]);

  // ==========================================
  // STATISTICS
  // ==========================================


  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Proofs"
        description="Upload and manage customer transaction and project evidence."
        action={
          <Button onClick={handleAddClick}>
            <Plus className="size-4" />
            Upload Proof
          </Button>
        }
      />
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <Link href="/admin/testimonials" className="inline-flex h-9 w-fit items-center gap-2 rounded-md px-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          <ArrowLeft className="size-4" />
          Back to Testimonials
      </Link>

      {/* PROOFS LIST */}
      <Card>
        <CardHeader>
          <CardTitle>All Customer Proofs</CardTitle>
          <CardDescription>Manage uploaded screenshots and customer evidence.</CardDescription>

          {/* SEARCH AND FILTER */}
          <div className="flex flex-col gap-3 pt-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer or project..." className="pl-9" />
            </div>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 sm:w-52"
            >
              {['All Categories', ...new Set(services.map((item) => item.category))].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

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
          {filteredProofs.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Image</TableHead><TableHead>Proof</TableHead><TableHead>Category</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>{filteredProofs.map((proof) => <TableRow key={proof.id}>
                  <TableCell><button type="button" onClick={() => setPreviewProof(proof)} aria-label={`Preview ${proof.projectName}`} className="size-14 overflow-hidden rounded-md border bg-muted"><Image src={proof.image} alt={proof.projectName} width={56} height={56} unoptimized className="size-full object-cover" /></button></TableCell>
                  <TableCell><p className="max-w-64 truncate font-medium">{proof.projectName}</p><p className="max-w-64 truncate text-xs text-muted-foreground">{proof.description}</p></TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{proof.category}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{proof.createdAt}</TableCell>
                  <TableCell><Badge variant={proof.status === 'Published' ? 'default' : 'secondary'}>{proof.status}</Badge></TableCell>
                  <TableCell><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => setPreviewProof(proof)} aria-label="Preview proof"><Eye className="size-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleEditClick(proof)} aria-label="Edit proof"><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteClick(proof)} aria-label="Delete proof"><Trash2 className="size-4" /></Button></div></TableCell>
                </TableRow>)}</TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={<Images className="size-6" />}
              title="No customer proofs found"
              description={search || category !== 'All Categories' || status !== 'All Status' ? 'Try adjusting your search or filters.' : 'Upload your first customer proof to get started.'}
              action={
                !search && category === 'All Categories' && status === 'All Status' ? (
                  <Button onClick={handleAddClick}>
                    <Plus className="size-4" />
                    Upload First Proof
                  </Button>
                ) : undefined
              }
            />
          )}

          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Showing {filteredProofs.length} of {proofs.length} proofs
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ADD / EDIT FORM */}
      <ProofFormDialog
        services={services}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setSelectedProof(null);
          }
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedProof}
      />

      {/* IMAGE PREVIEW */}
      <Dialog
        open={Boolean(previewProof)}
        onOpenChange={(open) => {
          if (!open) setPreviewProof(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewProof?.projectName ?? 'Proof Preview'}</DialogTitle>

            <DialogDescription>
              {previewProof?.customerName} · {previewProof?.category}
            </DialogDescription>
          </DialogHeader>

          {previewProof && (
            <div className="space-y-3">
              <div className="flex max-h-[65vh] justify-center overflow-hidden rounded-lg border border-border bg-muted/30 p-2">
                <Image src={previewProof.image} alt={previewProof.projectName} width={1200} height={900} unoptimized className="max-h-[60vh] w-auto max-w-full object-contain" />
              </div>

              {previewProof.description && <p className="text-sm text-muted-foreground">{previewProof.description}</p>}

              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant={previewProof.status === 'Published' ? 'default' : 'secondary'}>{previewProof.status}</Badge>

                <span className="text-xs text-muted-foreground">{previewProof.createdAt}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);

          if (!open) {
            setProofToDelete(null);
          }
        }}
        title="Delete Customer Proof?"
        description={`Are you sure you want to delete "${proofToDelete?.projectName ?? 'this proof'}"? This action cannot be undone.`}
        confirmText="Delete Proof"
        cancelText="Cancel"
        onConfirm={handleDeleteProof}
        loading={deleting}
      />
    </div>
  );
}
