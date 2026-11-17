'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ArrowUpRight, BriefcaseBusiness, Images, Search, ZoomIn } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Reveal } from '@/components/website/Motion';
import ImageLightboxModal from '@/components/website/sections/ImageLightboxModal';
import type { getProjects } from '@/lib/supabase/public-data';

type Project = Awaited<ReturnType<typeof getProjects>>[number];

export default function PortfolioGallery({ projects = [] }: { projects?: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const fullscreenImages = useMemo(() => {
    if (!selected) return [];
    return [
      ...(selected.cover_image ? [{ src: selected.cover_image, alt: selected.project_name }] : []),
      ...(selected.portfolio_images ?? []).map((image) => ({
        src: image.image_path,
        alt: image.alt_text || selected.project_name,
      })),
    ];
  }, [selected]);

  // ONLY real data from database. No sample data!
  const categories = useMemo(
    () => ['Semua', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))],
    [projects]
  );

  const visible = useMemo(
    () =>
      projects.filter(
        (p) =>
          (category === 'Semua' || p.category === category) &&
          `${p.project_name} ${p.category} ${p.description ?? ''}`
            .toLocaleLowerCase()
            .includes(query.toLocaleLowerCase())
      ),
    [projects, query, category]
  );

  if (!projects || projects.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-16 text-center text-muted-foreground">
        <BriefcaseBusiness className="mx-auto size-12 text-muted-foreground/60" />
        <p className="mt-4 text-lg font-bold text-foreground">Belum ada portofolio yang dipublikasikan.</p>
        <p className="mt-1 text-sm">Proyek-proyek terbaru kami sedang dipersiapkan untuk ditampilkan di sini.</p>
      </div>
    );
  }

  return (
    <>
      {/* Filters and Search Bar */}
      <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-border/80 bg-card/85 p-5 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={category === item ? 'default' : 'outline'}
              className={`rounded-full px-4 text-xs font-semibold transition-all ${
                category === item
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border-border/80 hover:border-primary/40'
              }`}
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Cari proyek"
            placeholder="Cari nama atau jenis karya..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 rounded-2xl border-border/80 bg-background/60 pl-10 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Projects Grid from Database */}
      {visible.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, i) => (
            <Reveal key={project.id} delay={(i % 3) * 0.06} className="h-full">
              <Card
                id={project.id}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-card/85 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/10"
              >
                {project.cover_image ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                      src={project.cover_image}
                      alt={`${project.project_name}, ${project.category}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <Badge variant="secondary" className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-background/85 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                      {project.category}
                    </Badge>
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-emerald-500/10">
                    <BriefcaseBusiness className="size-10 text-primary/70" />
                  </div>
                )}

                <CardHeader className="flex-1 p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {project.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Images className="size-3.5" />
                      {(project.portfolio_images?.length ?? 0) + (project.cover_image ? 1 : 0)}
                    </span>
                  </div>
                  <CardTitle className="pt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {project.project_name}
                  </CardTitle>
                  {project.description && (
                    <CardDescription className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="flex items-center justify-between gap-3 border-t border-border/60 p-6 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-border/80 text-xs font-semibold hover:border-primary hover:text-primary"
                    onClick={() => setSelected(project)}
                  >
                    Lihat Galeri <ArrowUpRight className="size-3.5" />
                  </Button>
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-primary underline-offset-4 hover:underline"
                    >
                      Buka Tautan
                    </a>
                  )}
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 px-6 py-20 text-center">
          <p className="text-lg font-bold text-foreground">Belum ada proyek yang cocok</p>
          <p className="mt-2 text-sm text-muted-foreground">Coba gunakan kata kunci pencarian atau kategori lainnya.</p>
        </div>
      )}

      {/* Lightbox Dialog for Project Gallery */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto rounded-3xl p-6 sm:p-8">
          {selected && (
            <div>
              <DialogHeader>
                <Badge variant="secondary" className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {selected.category}
                </Badge>
                <DialogTitle className="pt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {selected.project_name}
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                  {selected.description || 'Galeri dokumentasi proyek DigiJockeys. Klik pada setiap gambar untuk melihat layar penuh.'}
                </DialogDescription>
              </DialogHeader>

              {/* Clickable Gallery Grid */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {selected.cover_image && (
                  <div
                    onClick={() => setFullscreenIndex(0)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => event.key === 'Enter' && setFullscreenIndex(0)}
                    aria-label={`Buka gambar ${selected.project_name} layar penuh`}
                    className="group relative aspect-video cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-muted shadow-sm transition-all hover:border-primary/50"
                  >
                    <Image
                      src={selected.cover_image}
                      alt={selected.project_name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md opacity-90 transition-opacity group-hover:opacity-100">
                      <ZoomIn className="size-3" />
                      <span>Layar Penuh</span>
                    </div>
                  </div>
                )}
                {selected.portfolio_images?.map((image, index) => (
                  <div
                    key={image.id}
                    onClick={() => setFullscreenIndex((selected.cover_image ? 1 : 0) + index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => event.key === 'Enter' && setFullscreenIndex((selected.cover_image ? 1 : 0) + index)}
                    aria-label={`Buka gambar ${index + 1} ${selected.project_name} layar penuh`}
                    className="group relative aspect-video cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-muted shadow-sm transition-all hover:border-primary/50"
                  >
                    <Image
                      src={image.image_path}
                      alt={image.alt_text || selected.project_name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md opacity-90 transition-opacity group-hover:opacity-100">
                      <ZoomIn className="size-3" />
                      <span>Layar Penuh</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal footer action */}
              <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-5">
                <p className="text-xs text-muted-foreground">Proyek dikerjakan secara profesional oleh tim DigiJockeys.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs"
                  onClick={() => setSelected(null)}
                >
                  Tutup Galeri
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fullscreen Lightbox Modal */}
      <ImageLightboxModal
        isOpen={fullscreenIndex !== null}
        onClose={() => setFullscreenIndex(null)}
        images={fullscreenImages}
        index={fullscreenIndex ?? 0}
        onIndexChange={setFullscreenIndex}
      />
    </>
  );
}
