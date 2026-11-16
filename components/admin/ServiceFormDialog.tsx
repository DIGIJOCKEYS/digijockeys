'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, LoaderCircle, Plus, Save, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { notify } from '@/components/shared/ActionToast';

export interface ServiceFormData {
  name: string;
  category: string;
  description: string;
  status: 'Active' | 'Inactive';
  coverImage: string;
  coverImagePath: string | null;
  coverImageFile: File | null;
  removeCoverImage: boolean;
}

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ServiceFormData) => Promise<boolean>;
  initialData?: ServiceFormData | null;
  saving?: boolean;
}

const emptyForm: ServiceFormData = {
  name: '',
  category: '',
  description: '',
  status: 'Active',
  coverImage: '',
  coverImagePath: null,
  coverImageFile: null,
  removeCoverImage: false,
};

export default function ServiceFormDialog({ open, onOpenChange, onSubmit, initialData, saving = false }: ServiceFormDialogProps) {
  const [form, setForm] = useState<ServiceFormData>(() => initialData ? { ...initialData, coverImageFile: null, removeCoverImage: false } : { ...emptyForm });
  const previewObjectUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
      previewObjectUrl.current = null;
    };
  }, []);

  const isEditing = Boolean(initialData);

  const handleNameChange = (name: string) => setForm((current) => ({ ...current, name }));

  const handleCoverSelect = (file?: File) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type) || file.size > 20 * 1024 * 1024) {
      notify('Cover layanan harus berupa JPG, PNG, atau WEBP dengan ukuran maksimal 20 MB.', 'error');
      return;
    }
    if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
    previewObjectUrl.current = URL.createObjectURL(file);
    setForm((current) => ({ ...current, coverImage: previewObjectUrl.current!, coverImageFile: file, removeCoverImage: false }));
  };

  const handleRemoveCover = () => {
    if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
    previewObjectUrl.current = null;
    setForm((current) => ({ ...current, coverImage: '', coverImageFile: null, removeCoverImage: true }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const succeeded = await onSubmit({
      ...form,
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
    });

    if (succeeded) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Service' : 'Add New Service'}</DialogTitle>

          <DialogDescription>{isEditing ? 'Update your service information.' : 'Add a new service to your DigiJockeys website.'}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="service-name">Service Name</Label>
            <Input id="service-name" placeholder="e.g. Web Development" value={form.name} onChange={(event) => handleNameChange(event.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-category">Category</Label>
            <Input
              id="service-category"
              placeholder="e.g. Development"
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-description">Description</Label>
            <Textarea
              id="service-description"
              placeholder="Describe your service..."
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-cover">Cover / Thumbnail</Label>
            <Input
              id="service-cover"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={saving}
              onChange={(event) => { handleCoverSelect(event.currentTarget.files?.[0]); event.currentTarget.value = ''; }}
            />
            {form.coverImage ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted">
                <Image src={form.coverImage} alt={`${form.name || 'Service'} cover preview`} fill sizes="(max-width: 640px) 100vw, 500px" unoptimized className="object-cover" />
                <Button type="button" size="icon-sm" variant="secondary" disabled={saving} onClick={handleRemoveCover} className="absolute right-2 top-2" aria-label="Remove service cover">
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground">
                <div className="flex items-center gap-2 text-sm"><ImagePlus className="size-4" />Belum ada cover layanan</div>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Pilih JPG, PNG, atau WEBP hingga 20 MB. Gambar akan dikompres sebelum diunggah.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-status">Status</Label>
            <select
              id="service-status"
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as ServiceFormData['status'],
                }))
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? <LoaderCircle className="size-4 animate-spin" /> : isEditing ? <Save className="size-4" /> : <Plus className="size-4" />}
              {saving ? 'Menyimpan…' : isEditing ? 'Save Changes' : 'Save Service'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
