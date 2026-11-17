'use client';

import { useEffect } from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';

type GalleryImage = { src: string; alt: string };
const noop = () => {};

export default function ImageLightboxModal({
  isOpen,
  onClose,
  images,
  index = 0,
  onIndexChange,
  src,
  alt = 'Pratinjau layar penuh',
}: {
  isOpen: boolean;
  onClose: () => void;
  images?: GalleryImage[];
  index?: number;
  onIndexChange?: (index: number) => void;
  src?: string | null;
  alt?: string;
}) {
  const gallery = images ?? (src ? [{ src, alt }] : []);
  const changeIndex = onIndexChange ?? noop;
  const image = gallery[index];
  const canNavigate = gallery.length > 1;

  useEffect(() => {
    if (!isOpen || !canNavigate) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') changeIndex((index + 1) % gallery.length);
      if (event.key === 'ArrowLeft') changeIndex((index - 1 + gallery.length) % gallery.length);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canNavigate, gallery.length, index, isOpen, changeIndex]);

  if (!image) return null;

  const previous = () => changeIndex((index - 1 + gallery.length) % gallery.length);
  const next = () => changeIndex((index + 1) % gallery.length);

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-[9998] bg-black/95 backdrop-blur-2xl duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-3 outline-none duration-200 data-open:animate-in data-open:zoom-in-95 data-closed:animate-out data-closed:zoom-out-95 sm:p-6">
          <div className="absolute right-4 top-4 z-[10000] flex items-center gap-2 sm:right-6 sm:top-6">
            <a
              href={image.src}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-white hover:text-black"
            >
              <ExternalLink className="size-3.5" />
              <span className="hidden sm:inline">Buka Resolusi Asli</span>
            </a>
            <DialogPrimitive.Close
              render={
                <button
                  type="button"
                  aria-label="Tutup layar penuh"
                  className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur-md transition hover:bg-white hover:text-black"
                />
              }
            >
              <X className="size-5" />
            </DialogPrimitive.Close>
          </div>

          {canNavigate && (
            <>
              <button
                type="button"
                onClick={previous}
                aria-label="Gambar sebelumnya"
                className="absolute left-3 top-1/2 z-[10000] flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-black sm:left-6 sm:size-12"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Gambar berikutnya"
                className="absolute right-3 top-1/2 z-[10000] flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-black sm:right-6 sm:size-12"
              >
                <ChevronRight className="size-6" />
              </button>
              <span className="absolute bottom-5 left-1/2 z-[10000] -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md" aria-live="polite">
                {index + 1} / {gallery.length}
              </span>
            </>
          )}

          <div className="relative flex max-h-[86vh] max-w-[95vw] items-center justify-center overflow-auto rounded-2xl">
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              className="max-h-[84vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
            />
          </div>
          <p className="mt-3 max-w-[85vw] text-center text-xs text-white/70">
            {image.alt} · {canNavigate ? 'Gunakan panah kiri/kanan untuk menjelajahi galeri · ' : ''}Tekan ESC atau klik tombol tutup untuk kembali
          </p>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
