'use client';

import { useEffect, useState } from 'react';
import { LoaderCircle, Plus, Save, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { notify } from '@/components/shared/ActionToast';

export type PortfolioStatus = 'Published' | 'Draft';

export interface PortfolioFormData {
  name: string;
  category: string;
  thumbnail: string;
  description: string;
  projectUrl: string;
  status: PortfolioStatus;
  thumbnailFile?: File | null;
  galleryFiles?: File[];
  galleryPaths?: string[];
}

interface PortfolioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PortfolioFormData) => Promise<boolean>;
  initialData?: PortfolioFormData | null;
  categories: string[];
  saving: boolean;
}

const emptyForm: PortfolioFormData = {
  name: '',
  category: 'Web Development',
  thumbnail: '',
  description: '',
  projectUrl: '',
  status: 'Draft',
};

export default function PortfolioFormDialog({ open, onOpenChange, onSubmit, initialData, categories, saving }: PortfolioFormDialogProps) {
  const [form, setForm] = useState<PortfolioFormData>(emptyForm);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [imageError, setImageError] = useState('');

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => { setForm(initialData ?? emptyForm); setThumbnailFile(null); setGalleryFiles([]); }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [open, initialData]);

  const handleNameChange = (name: string) => setForm((current) => ({ ...current, name }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.thumbnail && !thumbnailFile) { setImageError('Please upload a project thumbnail.'); return; }
    const saved = await onSubmit({
      ...form,
      name: form.name.trim(),
      category: form.category.trim(),
      thumbnail: form.thumbnail.trim(),
      description: form.description.trim(),
      projectUrl: form.projectUrl.trim(),
      thumbnailFile,
      galleryFiles,
      galleryPaths: form.galleryPaths ?? [],
    });

    if (saved) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Portfolio Project' : 'Add New Project'}</DialogTitle>

          <DialogDescription>{isEditing ? 'Update your portfolio project information.' : 'Add a new project to your DigiJockeys portfolio.'}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="portfolio-name">Project Name</Label>
            <Input id="portfolio-name" placeholder="e.g. Corporate Website" value={form.name} onChange={(event) => handleNameChange(event.target.value)} required />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="portfolio-category">Category</Label>
            <select
              id="portfolio-category"
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              required
            >
              {[...new Set([...categories, ...(form.category ? [form.category] : [])])].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {categories.length === 0 && <p className="text-xs text-muted-foreground">Add an active service first to create portfolio categories.</p>}
          </div>

          {/* Thumbnail upload */}
          <div className="space-y-2">
            <Label htmlFor="portfolio-thumbnail">Project Thumbnail</Label>
            <Input
              id="portfolio-thumbnail"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => { const file = event.target.files?.[0] ?? null; if (file && (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 20 * 1024 * 1024)) { setImageError('Choose a JPG, PNG, or WEBP image up to 20 MB.'); notify('Thumbnail must be JPG, PNG, or WEBP and no larger than 20 MB.', 'error'); event.currentTarget.value = ''; return; } setImageError(''); setThumbnailFile(file); if (file) setForm((current) => ({ ...current, thumbnail: current.thumbnail || 'new-image' })); event.currentTarget.value = ''; }}
            />

            {form.thumbnail && (
              <div className="overflow-hidden rounded-lg border border-border bg-muted">
                <img
                  src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : form.thumbnail}
                  alt="Portfolio thumbnail preview"
                  className="h-40 w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display = 'block';
                  }}
                />
              </div>
            )}

            <p className="text-xs text-muted-foreground">Upload a JPG, PNG, or WEBP image. It will be compressed before upload (up to 20 MB original).</p>
            {imageError && <p role="alert" className="text-xs text-destructive">{imageError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio-gallery">Project Gallery</Label>
            <Input id="portfolio-gallery" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => { const files = Array.from(event.target.files ?? []); const valid = files.filter((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= 20 * 1024 * 1024); if (valid.length !== files.length) { setImageError('Only JPG, PNG, or WEBP photos up to 20 MB can be added.'); notify('Some photos were skipped. Use JPG, PNG, or WEBP images up to 20 MB each.', 'error'); } setGalleryFiles((current) => [...current, ...valid]); event.currentTarget.value = ''; }} />
            <p className="text-xs text-muted-foreground">Add multiple project photos for the detail gallery.</p>
            <div className="flex flex-wrap gap-2">
              {(form.galleryPaths ?? []).map((path, index) => <div key={`${path}-${index}`} className="relative size-16 overflow-hidden rounded-md border"><img src={path} alt={`Gallery photo ${index + 1}`} className="size-full object-cover" /><button type="button" className="absolute right-0 top-0 rounded-bl bg-background/90 p-1" onClick={() => setForm((current) => ({ ...current, galleryPaths: (current.galleryPaths ?? []).filter((_, itemIndex) => itemIndex !== index) }))} aria-label="Remove gallery photo"><X className="size-3" /></button></div>)}
              {galleryFiles.map((file, index) => <div key={`${file.name}-${index}`} className="relative size-16 overflow-hidden rounded-md border"><img src={URL.createObjectURL(file)} alt={file.name} className="size-full object-cover" /><button type="button" className="absolute right-0 top-0 rounded-bl bg-background/90 p-1" onClick={() => setGalleryFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remove selected photo"><X className="size-3" /></button></div>)}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="portfolio-description">Description</Label>
            <Textarea
              id="portfolio-description"
              placeholder="Describe this project..."
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={4}
            />
          </div>

          {/* Project URL */}
          <div className="space-y-2">
            <Label htmlFor="portfolio-url">Project URL</Label>
            <Input
              id="portfolio-url"
              type="url"
              placeholder="https://example.com"
              value={form.projectUrl}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  projectUrl: event.target.value,
                }))
              }
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="portfolio-status">Status</Label>
            <select
              id="portfolio-status"
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as PortfolioStatus,
                }))
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? <LoaderCircle className="size-4 animate-spin" /> : isEditing ? <Save className="size-4" /> : <Plus className="size-4" />}
              {saving ? 'Mengunggah dan menyimpan…' : isEditing ? 'Save Changes' : 'Save Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
