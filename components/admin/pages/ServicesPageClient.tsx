'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Search, Plus, BriefcaseBusiness, Pencil, Trash2 } from 'lucide-react';

import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import ServiceFormDialog, { type ServiceFormData } from '@/components/admin/ServiceFormDialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createClient } from '@/lib/supabase/client';
import { notify } from '@/components/shared/ActionToast';
import { compressImage } from '@/lib/images/compressImage';

interface Service extends ServiceFormData {
  id: string;
  updated_at: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const loadServices = async () => {
    const db = createClient();
    const { data, error } = await db.from('services').select('id,name,category,description,status,cover_image,updated_at').order('updated_at', { ascending: false });
    if (error) setError(error.message);
    else {
      setServices((data ?? []).map((item) => ({
        ...item,
        status: item.status === 'inactive' ? 'Inactive' : 'Active',
        coverImagePath: item.cover_image,
        coverImage: item.cover_image ? (/^(https?:)?\/\//i.test(item.cover_image) ? item.cover_image : db.storage.from('site-media').getPublicUrl(item.cover_image).data.publicUrl) : '',
        coverImageFile: null,
        removeCoverImage: false,
      })) as Service[]);
      setError('');
    }
  };
  useEffect(() => { const timer = window.setTimeout(() => { void loadServices(); }, 0); return () => window.clearTimeout(timer); }, []);

  // Add service
  const persistService = async (data: ServiceFormData, id?: string): Promise<boolean> => {
    setSaving(true);
    setError('');
    const db = createClient();
    const previousPath = id ? selectedService?.coverImagePath ?? null : null;
    let uploadedPath: string | null = null;
    try {
      let coverImagePath = previousPath;
      if (data.coverImageFile) {
        const compressed = await compressImage(data.coverImageFile, 1400, 0.78);
        if (compressed.size > 5 * 1024 * 1024) throw new Error('Ukuran gambar setelah kompresi masih melebihi 5 MB.');
        uploadedPath = `services/${crypto.randomUUID()}.webp`;
        const { error: uploadError } = await db.storage.from('site-media').upload(uploadedPath, compressed, { contentType: 'image/webp', upsert: false });
        if (uploadError) throw uploadError;
        coverImagePath = uploadedPath;
      } else if (data.removeCoverImage) {
        coverImagePath = null;
      }

      const payload = {
        name: data.name,
        category: data.category,
        description: data.description || null,
        status: data.status.toLowerCase(),
        cover_image: coverImagePath,
      };
      const result = id
        ? await db.from('services').update(payload).eq('id', id)
        : await db.from('services').insert(payload);
      if (result.error) throw result.error;

      if (previousPath && previousPath !== coverImagePath && !/^(https?:)?\/\//i.test(previousPath)) {
        const { error: removeError } = await db.storage.from('site-media').remove([previousPath]);
        if (removeError) console.warn('Unable to remove the previous service cover:', removeError.message);
      }

      await loadServices();
      notify(id ? 'Service updated successfully.' : 'Service created successfully.');
      if (id) setSelectedService(null);
      return true;
    } catch (cause) {
      if (uploadedPath) await db.storage.from('site-media').remove([uploadedPath]);
      const message = cause instanceof Error ? cause.message : 'Gagal menyimpan layanan.';
      setError(message);
      notify(message, 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = (data: ServiceFormData) => persistService(data);

  // Open edit dialog
  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setFormOpen(true);
  };

  // Update service
  const handleUpdateService = async (data: ServiceFormData) => {
    if (!selectedService) return false;

    return persistService(data, selectedService.id);
  };

  // Open delete confirmation
  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setDeleteOpen(true);
  };

  // Delete service
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    setDeleting(true);
    const { error } = await createClient().from('services').delete().eq('id', serviceToDelete.id);
    if (error) { setError(error.message); notify(error.message, 'error'); setDeleting(false); return; }
    if (serviceToDelete.coverImagePath && !/^(https?:)?\/\//i.test(serviceToDelete.coverImagePath)) {
      const { error: storageError } = await createClient().storage.from('site-media').remove([serviceToDelete.coverImagePath]);
      if (storageError) console.warn('Unable to remove the deleted service cover:', storageError.message);
    }
    await loadServices(); notify('Service deleted successfully.'); setDeleting(false);

    setServiceToDelete(null);
    setDeleteOpen(false);
  };

  // Search services
  const filteredServices = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return services.filter((service) => [service.name, service.category, service.description, service.status].join(' ').toLowerCase().includes(keyword));
  }, [services, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Manage the services displayed on your DigiJockeys website."
        action={
          <Button
            onClick={() => {
              setSelectedService(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add Service
          </Button>
        }
      />
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle>All Services</CardTitle>
              <CardDescription>Manage and monitor your business services.</CardDescription>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search services..." className="pl-9" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredServices.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cover</TableHead>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="relative size-14 overflow-hidden rounded-lg border border-border bg-muted">
                          {service.coverImage ? <Image src={service.coverImage} alt={`${service.name} cover`} fill sizes="56px" unoptimized className="object-cover" /> : <BriefcaseBusiness className="m-auto size-5 text-muted-foreground" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{service.name}</p>
                          <p className="max-w-xs truncate text-xs text-muted-foreground">{service.description}</p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm text-muted-foreground">{service.category}</span>
                      </TableCell>

                      <TableCell>
                        <Badge variant={service.status === 'Active' ? 'default' : 'secondary'}>{service.status}</Badge>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">{new Date(service.updated_at).toLocaleDateString()}</TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" aria-label={`Edit ${service.name}`} onClick={() => handleEditClick(service)}>
                            <Pencil className="size-4" />
                          </Button>

                          <Button variant="ghost" size="icon" aria-label={`Delete ${service.name}`} className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(service)}>
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
            <EmptyState icon={<BriefcaseBusiness className="size-6" />} title="No services found" description={search ? 'Try another keyword to find a service.' : "You haven't added any services yet."} />
          )}

          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Showing {filteredServices.length} of {services.length} services
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <ServiceFormDialog
        key={`${selectedService?.id ?? 'new'}-${formOpen}`}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setSelectedService(null);
          }
        }}
        initialData={selectedService}
        onSubmit={selectedService ? handleUpdateService : handleAddService}
          saving={saving}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);

          if (!open) {
            setServiceToDelete(null);
          }
        }}
        title="Delete Service?"
        description={`Are you sure you want to delete "${serviceToDelete?.name ?? 'this service'}"? This action cannot be undone.`}
        confirmText="Delete Service"
        onConfirm={handleDeleteService}
        loading={deleting}
      />
    </div>
  );
}
