'use client';

import { useState } from 'react';
import { LoaderCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';

type ServiceOption = { id: string; name: string };

const ratingLabels = ['Buruk', 'Kurang', 'Cukup', 'Baik', 'Sangat baik'];

export default function TestimonialForm({ services }: { services: ServiceOption[] }) {
  const [name, setName] = useState('');
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [messageIsError, setMessageIsError] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating < 1 || rating > 5) {
      setMessageIsError(true);
      setMessage('Pilih penilaian bintang terlebih dahulu.');
      return;
    }

    setBusy(true);
    setMessage('');
    try {
      const { error } = await createClient().from('testimonials').insert({
        customer_name: name.trim(),
        service_id: serviceId || null,
        rating,
        description: description.trim(),
        status: 'draft',
      });
      if (error) throw error;

      setName('');
      setServiceId(null);
      setRating(0);
      setDescription('');
      setMessageIsError(false);
      setMessage('Terima kasih! Ulasan Anda menunggu persetujuan admin sebelum ditampilkan.');
    } catch {
      setMessageIsError(true);
      setMessage('Ulasan belum terkirim. Silakan periksa koneksi lalu coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="review-name">Nama</Label>
        <Input id="review-name" autoComplete="name" placeholder="Nama yang ingin ditampilkan" value={name} onChange={(event) => setName(event.target.value)} required maxLength={120} className="h-11 rounded-xl border-border/70 bg-background/55 px-4 shadow-sm backdrop-blur-md placeholder:text-muted-foreground/70" />
      </div>

      <div className="grid gap-2">
        <Label id="review-service-label">Layanan <span className="font-normal text-muted-foreground">(opsional)</span></Label>
        <Select value={serviceId ?? ''} onValueChange={(value) => setServiceId(value || null)} disabled={!services.length}>
          <SelectTrigger aria-labelledby="review-service-label" className="h-11 w-full rounded-xl border-border/70 bg-background/55 px-4 shadow-sm backdrop-blur-md">
            <SelectValue placeholder={services.length ? 'Pilih layanan yang Anda gunakan' : 'Belum ada layanan tersedia'}>
              {(value) => services.find((service) => service.id === value)?.name ?? 'Pilih layanan yang Anda gunakan'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/70 bg-popover/95 shadow-xl backdrop-blur-xl">
            {services.map((service) => <SelectItem key={service.id} value={service.id} className="rounded-lg">{service.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium">Penilaian</legend>
        <div role="group" aria-label="Penilaian bintang" className="flex w-fit items-center gap-1 rounded-xl border border-border/70 bg-background/45 px-3 py-2 shadow-sm backdrop-blur-md">
          {ratingLabels.map((label, index) => {
            const value = index + 1;
            const selected = value <= rating;
            return (
              <button
                key={value}
                type="button"
                aria-label={`${value} dari 5 bintang: ${label}`}
                aria-pressed={rating === value}
                title={`${value} bintang — ${label}`}
                onClick={() => { setRating(value); setMessage(''); }}
                className="rounded-lg p-1.5 text-muted-foreground/45 outline-none transition duration-300 hover:scale-110 hover:text-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400/70 aria-pressed:text-amber-400"
              >
                <Star className={`size-7 transition-colors duration-300 sm:size-8 ${selected ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="min-h-5 text-xs text-muted-foreground">{rating ? `${rating} dari 5 bintang · ${ratingLabels[rating - 1]}` : 'Pilih 1 sampai 5 bintang untuk memberi penilaian.'}</p>
      </fieldset>

      <div className="grid gap-2">
        <Label htmlFor="review-description">Ulasan</Label>
        <Textarea id="review-description" placeholder="Ceritakan pengalaman Anda menggunakan layanan kami..." value={description} onChange={(event) => setDescription(event.target.value)} required minLength={5} maxLength={2000} rows={5} className="min-h-32 resize-y rounded-xl border-border/70 bg-background/55 px-4 py-3 shadow-sm backdrop-blur-md placeholder:text-muted-foreground/70" />
        <p className="text-right text-xs text-muted-foreground">{description.length}/2000</p>
      </div>

      <Button type="submit" disabled={busy} className="h-12 rounded-xl shadow-lg shadow-primary/10 transition duration-300 hover:-translate-y-0.5">
        {busy && <LoaderCircle className="size-4 animate-spin" />}
        {busy ? 'Mengirim ulasan…' : 'Kirim ulasan'}
      </Button>
      {message && <p role={messageIsError ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm leading-6 ${messageIsError ? 'border-destructive/20 bg-destructive/5 text-destructive' : 'border-primary/15 bg-primary/5 text-foreground'}`}>{message}</p>}
    </form>
  );
}
