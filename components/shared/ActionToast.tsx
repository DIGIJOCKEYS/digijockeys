'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, CircleAlert, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export type ToastMessage = { message: string; type: 'success' | 'error' };

const translations: Record<string, string> = {
  'Service created successfully.': 'Layanan berhasil ditambahkan.',
  'Service updated successfully.': 'Layanan berhasil diperbarui.',
  'Service deleted successfully.': 'Layanan berhasil dihapus.',
  'Review published successfully.': 'Ulasan berhasil dipublikasikan.',
  'Review deleted successfully.': 'Ulasan berhasil dihapus.',
  'Customer proof updated.': 'Bukti pelanggan berhasil diperbarui.',
  'Customer proof uploaded.': 'Bukti pelanggan berhasil diunggah.',
  'Customer proof deleted.': 'Bukti pelanggan berhasil dihapus.',
  'Site settings saved successfully.': 'Pengaturan situs berhasil disimpan.',
  'Portfolio project updated.': 'Proyek portofolio berhasil diperbarui.',
  'Portfolio project created.': 'Proyek portofolio berhasil ditambahkan.',
  'Portfolio project deleted.': 'Proyek portofolio berhasil dihapus.',
  'Profile details saved.': 'Profil berhasil disimpan.',
  'Profile avatar updated successfully.': 'Foto profil berhasil diperbarui.',
  'Profile avatar removed.': 'Foto profil berhasil dihapus.',
  'Full name is required.': 'Nama lengkap wajib diisi.',
  'Email address is required.': 'Alamat email wajib diisi.',
  'Please choose an image file.': 'Pilih file gambar terlebih dahulu.',
  'Avatar image must be 12 MB or smaller.': 'Ukuran foto profil maksimal 12 MB.',
  'Thumbnail must be JPG, PNG, or WEBP and no larger than 20 MB.': 'Thumbnail harus berupa JPG, PNG, atau WEBP dengan ukuran maksimal 20 MB.',
  'Some photos were skipped. Use JPG, PNG, or WEBP images up to 20 MB each.': 'Beberapa foto dilewati. Gunakan JPG, PNG, atau WEBP dengan ukuran maksimal 20 MB per foto.',
};

export function notify(message: string, type: ToastMessage['type'] = 'success') {
  if (typeof window === 'undefined') return;
  const translated = translations[message] ?? (type === 'error' ? 'Terjadi kesalahan. Silakan periksa koneksi dan coba lagi.' : message);
  window.dispatchEvent(new CustomEvent<ToastMessage>('app-toast', { detail: { message: translated, type } }));
}

export default function ActionToast() {
  const [notice, setNotice] = useState<ToastMessage | null>(null);
  useEffect(() => {
    const onNotice = (event: Event) => setNotice((event as CustomEvent<ToastMessage>).detail);
    window.addEventListener('app-toast', onNotice);
    return () => window.removeEventListener('app-toast', onNotice);
  }, []);
  const close = () => setNotice(null);
  const Icon = notice?.type === 'success' ? CheckCircle2 : CircleAlert;
  return (
    <Dialog open={Boolean(notice)} onOpenChange={(open) => { if (!open) close(); }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <div className={`mb-1 flex size-11 items-center justify-center rounded-full ${notice?.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'}`}>
            <Icon className="size-5" />
          </div>
          <DialogTitle>{notice?.type === 'success' ? 'Berhasil' : 'Perlu diperiksa'}</DialogTitle>
          <DialogDescription>{notice?.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={close}>Mengerti</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function LoadingIcon() {
  return <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />;
}
