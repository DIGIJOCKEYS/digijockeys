'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ArrowUpRight, BriefcaseBusiness, Images, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Reveal } from '@/components/website/Motion';
import type { getProjects } from '@/lib/supabase/public-data';

type Project = Awaited<ReturnType<typeof getProjects>>[number];

export default function PortfolioGallery({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const categories = useMemo(() => ['Semua', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))], [projects]);
  const visible = useMemo(() => projects.filter((p) => (category === 'Semua' || p.category === category) && `${p.project_name} ${p.category} ${p.description ?? ''}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [projects, query, category]);
  return <>
    <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2">{categories.map((item) => <Button key={item} type="button" size="sm" variant={category === item ? 'default' : 'outline'} className="rounded-full" onClick={() => setCategory(item)}>{item}</Button>)}</div><div className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Cari proyek" placeholder="Cari proyek..." value={query} onChange={(e) => setQuery(e.target.value)} className="h-10 rounded-xl pl-9" /></div></div>
    {visible.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((project, i) => <Reveal key={project.id} delay={i % 3 * 0.05}><Card id={project.id} className="scroll-mt-28 h-full overflow-hidden rounded-2xl border-border/70 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">{project.cover_image ? <div className="relative aspect-[16/11] overflow-hidden"><Image src={project.cover_image} alt={`${project.project_name}, ${project.category}`} fill sizes="(max-width: 768px) 100vw, 33vw" unoptimized className="object-cover transition-transform duration-700 hover:scale-105" /></div> : <div className="flex aspect-[16/11] items-center justify-center bg-muted"><BriefcaseBusiness className="size-9 text-muted-foreground" /></div>}<CardHeader><div className="flex items-center justify-between"><Badge variant="secondary" className="rounded-full">{project.category}</Badge><span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Images className="size-3.5" />{project.portfolio_images.length + (project.cover_image ? 1 : 0)}</span></div><CardTitle className="pt-2 text-xl">{project.project_name}</CardTitle>{project.description && <CardDescription className="line-clamp-2 leading-6">{project.description}</CardDescription>}</CardHeader><CardContent className="flex items-center justify-between gap-3"><Button variant="outline" size="sm" className="rounded-lg" onClick={() => setSelected(project)}>Lihat galeri <ArrowUpRight /></Button>{project.project_url && <a href={project.project_url} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary underline-offset-4 hover:underline">Kunjungi proyek</a>}</CardContent></Card></Reveal>)}</div> : <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center"><p className="font-semibold">Belum ada proyek yang cocok</p><p className="mt-2 text-sm text-muted-foreground">Coba kata kunci atau kategori lainnya.</p></div>}
    <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-4xl"><DialogHeader><Badge variant="secondary" className="w-fit rounded-full">{selected?.category}</Badge><DialogTitle className="pt-2 text-2xl">{selected?.project_name}</DialogTitle><DialogDescription>{selected?.description || 'Galeri proyek DigiJockeys.'}</DialogDescription></DialogHeader><div className="grid gap-3 sm:grid-cols-2">{selected?.cover_image && <div className="relative aspect-video overflow-hidden rounded-xl"><Image src={selected.cover_image} alt={selected.project_name} fill sizes="(max-width: 768px) 100vw, 50vw" unoptimized className="object-cover" /></div>}{selected?.portfolio_images.map((image) => <div className="relative aspect-video overflow-hidden rounded-xl" key={image.id}><Image src={image.image_path} alt={image.alt_text || selected.project_name} fill sizes="(max-width: 768px) 100vw, 50vw" unoptimized className="object-cover" /></div>)}</div></DialogContent></Dialog>
  </>;
}
