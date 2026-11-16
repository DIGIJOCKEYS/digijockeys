'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Save, Upload, LoaderCircle, ImagePlus, X, Image as ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { compressImage } from '@/lib/images/compressImage';

// ==========================================
// TYPES
// ==========================================

export type ProofCategory = 'Order Confirmation' | 'Payment Proof' | 'Project Completion' | 'Customer Feedback';

export type ProofStatus = 'Published' | 'Draft';

export interface ProofFormData {
  description: string;
  image: string;
  proofDate: string;
  status: ProofStatus;
  serviceId: string;
}

export interface ProofService { id: string; name: string; category: string }

interface ProofFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProofFormData) => Promise<boolean>;
  initialData?: ProofFormData | null;
  services: ProofService[];
}

// ==========================================
// INITIAL DATA
// ==========================================

const emptyForm: ProofFormData = {
  description: '',
  image: '',
  proofDate: new Date().toISOString().slice(0, 10),
  status: 'Draft',
  serviceId: '',
};

// ==========================================
// COMPONENT
// ==========================================

export default function ProofFormDialog({ open, onOpenChange, onSubmit, initialData, services }: ProofFormDialogProps) {
  const [form, setForm] = useState<ProofFormData>({
    ...emptyForm,
  });

  const [imageError, setImageError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(initialData);

  // ==========================================
  // RESET FORM
  // ==========================================

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => { setForm(initialData ? { ...initialData } : { ...emptyForm }); setImageError(''); if (fileInputRef.current) fileInputRef.current.value = ''; }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [open, initialData]);

  // ==========================================
  // UPDATE FIELD
  // ==========================================

  const updateField = <K extends keyof ProofFormData>(key: K, value: ProofFormData[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  // ==========================================
  // IMAGE VALIDATION
  // ==========================================

  const handleImageFile = async (file?: File) => {
    if (!file) return;

    setImageError('');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setImageError('Only JPG, PNG, and WEBP images are allowed.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setImageError('Original image size must not exceed 20MB.');
      return;
    }
    setIsPreparing(true);
    try {
      const compressed = await compressImage(file);
      const reader = new FileReader();
      reader.onload = () => { if (typeof reader.result === 'string') { updateField('image', reader.result); setImageError(''); } setIsPreparing(false); };
      reader.onerror = () => { setImageError('Failed to read the compressed image.'); setIsPreparing(false); };
      reader.readAsDataURL(compressed);
    } catch (cause) { setImageError(cause instanceof Error ? cause.message : 'Failed to prepare image.'); setIsPreparing(false); }
  };

  // ==========================================
  // FILE INPUT
  // ==========================================

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageFile(event.target.files?.[0]);

    // Allow selecting the same file again.
    event.target.value = '';
  };

  // ==========================================
  // DRAG AND DROP
  // ==========================================

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    handleImageFile(event.dataTransfer.files?.[0]);
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const handleRemoveImage = () => {
    updateField('image', '');
    setImageError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.image) {
      setImageError('Please upload a customer proof image.');
      return;
    }

    setIsSaving(true);
    const saved = await onSubmit({
      ...form,
      description: form.description.trim(),
    });

    setIsSaving(false);
    if (saved) onOpenChange(false);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Customer Proof' : 'Upload Customer Proof'}</DialogTitle>

          <DialogDescription>{isEditing ? 'Update customer proof information and screenshot.' : 'Upload a screenshot of customer transactions, conversations, or completed projects.'}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="proof-service">Service Category</Label>
            <select id="proof-service" value={form.serviceId} onChange={(event) => updateField('serviceId', event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">No service assigned</option>
              {services.map((service) => <option key={service.id} value={service.id}>{service.category} — {service.name}</option>)}
            </select>
            {services.length === 0 && <p className="text-xs text-destructive">Create an active service before uploading a proof.</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="proof-date">Proof Date</Label>
            <Input id="proof-date" type="date" value={form.proofDate} onChange={(event) => updateField('proofDate', event.target.value)} required />
          </div>

          {/* IMAGE UPLOAD */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Proof Screenshot</Label>

              <Badge variant="outline">JPG / PNG / WEBP</Badge>
            </div>

            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />

            {form.image ? (
              <div className="space-y-3">
                <div className="group relative overflow-hidden rounded-lg border border-border bg-muted/30">
                  <img src={form.image} alt="Customer proof preview" className="max-h-[300px] w-full object-contain" />

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-background/90 text-destructive shadow-sm transition-colors hover:bg-background"
                    aria-label="Remove proof image"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ImageIcon className="size-4" />
                    <span>Image ready to upload</span>
                  </div>

                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Change Image
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 hover:bg-muted/40'}`}
              >
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ImagePlus className="size-6" />
                </div>

                <p className="text-sm font-medium">Drag and drop your screenshot here</p>

                <p className="mt-1 text-xs text-muted-foreground">Or browse an image from your device</p>

                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="size-4" />
                  Select Image
                </Button>

                <p className="mt-3 text-[11px] text-muted-foreground">Images are optimized before upload. Maximum original size: 20MB.</p>
              </div>
            )}

            {imageError && <p className="text-xs text-destructive">{imageError}</p>}
            {isPreparing && <p role="status" className="text-xs text-primary">Compressing image before upload…</p>}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="proof-description">
              Description
              <span className="ml-1 text-muted-foreground">(Optional)</span>
            </Label>

            <Textarea id="proof-description" placeholder="Add additional information about this proof..." value={form.description} onChange={(event) => updateField('description', event.target.value)} rows={3} />
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <Label htmlFor="proof-status">Publication Status</Label>

            <select
              id="proof-status"
              value={form.status}
              onChange={(event) => updateField('status', event.target.value as ProofStatus)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>

            <p className="text-xs text-muted-foreground">Published proofs can be displayed on your public website.</p>
          </div>

          {/* PRIVACY REMINDER */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Before publishing, make sure you have permission to share the screenshot. Hide private information such as phone numbers, account numbers, addresses, and personal details.
            </p>
          </div>

          {/* FOOTER */}
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={isPreparing || isSaving}>
              {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : isEditing ? <Save className="size-4" /> : <Plus className="size-4" />}

              {isSaving ? 'Mengunggah…' : isEditing ? 'Save Changes' : 'Save Proof'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
