'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Calendar, CheckCircle2, Eye, Images, ShieldCheck, ZoomIn } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Reveal } from '@/components/website/Motion';
import ImageLightboxModal from '@/components/website/sections/ImageLightboxModal';
import { extractServiceName } from '@/lib/supabase/client-utils';
import type { getProofs } from '@/lib/supabase/public-data';

type Proof = Awaited<ReturnType<typeof getProofs>>[number];

export default function HomeProofsSection({ proofs = [] }: { proofs?: Proof[] }) {
  const [selectedProof, setSelectedProof] = useState<Proof | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  if (!proofs || proofs.length === 0) return null;

  // Show up to 6 proofs on the home page from database
  const displayedProofs = proofs.slice(0, 6);

  return (
    <section id="proofs" className="relative isolate overflow-hidden border-t border-border/70 bg-gradient-to-b from-muted/20 via-muted/35 to-muted/20 px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-1/4 -z-10 size-[32rem] rounded-full bg-emerald-400/10 blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 bottom-10 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              <Images className="size-3.5" /> DOKUMENTASI &amp; BUKTI PENGERJAAN
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Bukti Nyata Hasil Kolaborasi.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Transparansi adalah komitmen kami. Lihat beberapa dokumentasi riil pengerjaan proyek dan serah terima yang telah diselesaikan.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="shrink-0">
            <Button
              render={<Link href="/testimonials#bukti-pengerjaan" />}
              variant="outline"
              size="lg"
              className="h-12 rounded-2xl border-border/80 bg-background/70 px-6 text-xs font-semibold backdrop-blur-md hover:border-primary/50 hover:bg-primary hover:text-primary-foreground sm:text-sm"
            >
              Lihat Semua Bukti ({proofs.length})
              <ArrowRight className="size-4" />
            </Button>
          </Reveal>
        </div>

        {/* Proofs Grid from Database */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedProofs.map((proof, index) => {
            const serviceName = extractServiceName(proof.services);
            const formattedDate = proof.proof_date
              ? new Date(`${proof.proof_date}T00:00:00`).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : null;

            return (
              <Reveal key={proof.id} delay={index * 0.06} className="h-full">
                <Card
                  onClick={() => setSelectedProof(proof)}
                  className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-border/80 bg-card/85 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/10"
                >
                  {/* Image container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    <Image
                      src={proof.image_path}
                      alt={proof.description || `Bukti pengerjaan ${serviceName}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80"
                    />

                    {/* Service badge */}
                    <div className="absolute left-4 top-4">
                      <Badge variant="secondary" className="rounded-full border border-white/20 bg-background/85 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                        {serviceName}
                      </Badge>
                    </div>

                    {/* Quick view indicator */}
                    <div className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow-md backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                      <Eye className="size-4" />
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div>
                      {formattedDate && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <Calendar className="size-3.5 text-primary" />
                          <span>{formattedDate}</span>
                        </div>
                      )}
                      <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-foreground/85">
                        {proof.description || `Dokumentasi bukti pengerjaan dan serah terima ${serviceName} terverifikasi.`}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4 text-xs font-semibold text-primary">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                        Bukti Terverifikasi
                      </span>
                      <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Detail Bukti <ArrowUpRight className="size-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom CTA on mobile */}
        <div className="mt-10 text-center sm:hidden">
          <Button
            render={<Link href="/testimonials#bukti-pengerjaan" />}
            className="w-full rounded-2xl bg-primary py-6 text-sm font-semibold text-primary-foreground shadow-md"
          >
            Lihat Semua Bukti ({proofs.length})
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Lightbox Modal Dialog */}
      <Dialog open={!!selectedProof} onOpenChange={(open) => !open && setSelectedProof(null)}>
        <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto rounded-3xl p-6 sm:p-8">
          {selectedProof && (
            <div>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {extractServiceName(selectedProof.services)}
                  </Badge>
                  {selectedProof.proof_date && (
                    <span className="text-xs text-muted-foreground">
                      Diselesaikan pada {new Date(`${selectedProof.proof_date}T00:00:00`).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
                <DialogTitle className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Detail Bukti Pengerjaan
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Dokumentasi langsung dari hasil kerja dan serah terima proyek pelanggan DigiJockeys. Klik gambar untuk melihat layar penuh.
                </DialogDescription>
              </DialogHeader>

              {/* Large Image Preview with Click-to-Fullscreen */}
              <div
                onClick={() => setFullscreenImage(selectedProof.image_path)}
                className="group relative mt-6 aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-muted shadow-sm transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <Image
                  src={selectedProof.image_path}
                  alt={selectedProof.description || 'Bukti pengerjaan DigiJockeys'}
                  fill
                  sizes="(max-width: 900px) 100vw, 850px"
                  unoptimized
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md opacity-90 transition-opacity group-hover:opacity-100">
                  <ZoomIn className="size-3.5" />
                  <span>Klik Layar Penuh</span>
                </div>
              </div>

              {/* Details */}
              <div className="mt-6 rounded-2xl border border-border/70 bg-muted/30 p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Keterangan Pengerjaan</h4>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
                  {selectedProof.description || `Pekerjaan layanan ${extractServiceName(selectedProof.services)} telah diperiksa, diselesaikan, dan disetujui sesuai dengan kesepakatan bersama klien.`}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground border-t border-border/60 pt-3">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4" /> Kualitas &amp; Orisinalitas Terjamin
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-primary" /> Transparansi Penuh
                  </span>
                </div>
              </div>

              {/* Modal footer CTAs */}
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-border/60 pt-5">
                <Button
                  variant="outline"
                  className="rounded-xl text-xs"
                  onClick={() => setSelectedProof(null)}
                >
                  Tutup
                </Button>
                <Button
                  render={<Link href="/contact" />}
                  className="rounded-xl bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/95"
                  onClick={() => setSelectedProof(null)}
                >
                  Konsultasikan Proyek Serupa
                  <ArrowUpRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fullscreen Lightbox Modal */}
      <ImageLightboxModal
        isOpen={!!fullscreenImage}
        onClose={() => setFullscreenImage(null)}
        src={fullscreenImage}
        alt="Bukti Pengerjaan Layar Penuh"
      />
    </section>
  );
}
