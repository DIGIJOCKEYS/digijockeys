'use client';

import { useState } from 'react';
import { LoaderCircle, Save, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// ==========================================
// TYPES
// ==========================================

export type TestimonialStatus = 'Published' | 'Draft';

export interface TestimonialFormData {
  name: string;
  service: string;
  rating: number;
  message: string;
  status: TestimonialStatus;
}

interface TestimonialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TestimonialFormData) => Promise<boolean>;
  initialData?: TestimonialFormData | null;
  saving?: boolean;
}

// ==========================================
// INITIAL DATA
// ==========================================

const emptyForm: TestimonialFormData = {
  name: '',
  service: 'Web Development',
  rating: 5,
  message: '',
  status: 'Draft',
};

const services = ['Web Development', 'UI/UX Design', 'Graphic Design', 'Branding', 'Academic Assistance', 'Other'];

// ==========================================
// COMPONENT
// ==========================================

export default function TestimonialFormDialog({ open, onOpenChange, onSubmit, initialData, saving = false }: TestimonialFormDialogProps) {
  const [form, setForm] = useState<TestimonialFormData>(() => initialData ? { ...initialData } : { ...emptyForm });

  const updateField = <K extends keyof TestimonialFormData>(key: K, value: TestimonialFormData[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const rating = Math.min(5, Math.max(1, Number(form.rating) || 1));

    const succeeded = await onSubmit({
      ...form,
      name: form.name.trim(),
      service: form.service.trim(),
      message: form.message.trim(),
      rating,
    });

    if (succeeded) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Moderate Testimonial</DialogTitle>

          <DialogDescription>Review the customer submission and change its publication status.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* CUSTOMER NAME */}
          <div className="space-y-2">
            <Label htmlFor="testimonial-name">Customer Name</Label>

            <Input id="testimonial-name" value={form.name} readOnly />
          </div>

          {/* SERVICE */}
          <div className="space-y-2">
            <Label htmlFor="testimonial-service">Service Category</Label>

            <select
              id="testimonial-service"
              value={form.service}
              disabled
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              required
            >
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* RATING */}
          <div className="space-y-2">
            <Label htmlFor="testimonial-rating">Rating</Label>

            <div className="flex items-center gap-3">
              <Input
                id="testimonial-rating"
                type="number"
                min={1}
                max={5}
                value={form.rating}
                readOnly
                className="w-24"
                required
              />

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} className={`size-5 ${index < form.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">Select a rating between 1 and 5 stars.</p>
          </div>

          {/* MESSAGE */}
          <div className="space-y-2">
            <Label htmlFor="testimonial-message">Testimonial Message</Label>

            <Textarea id="testimonial-message" value={form.message} rows={4} readOnly />
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <Label htmlFor="testimonial-status">Publication Status</Label>

            <select
              id="testimonial-status"
              value={form.status}
              onChange={(event) => updateField('status', event.target.value as TestimonialStatus)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <option value="Draft" disabled={initialData?.status === 'Published'}>Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          {/* ACTIONS */}
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
              {saving ? 'Menyimpan…' : 'Save Status'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
