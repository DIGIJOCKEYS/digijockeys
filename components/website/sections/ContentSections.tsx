import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, AtSign, BriefcaseBusiness, Mail, Phone, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Reveal } from '@/components/website/Motion';
import type { getProjects, getServices, getTestimonials, getProofs, SiteSettings } from '@/lib/supabase/public-data';

type Service = Awaited<ReturnType<typeof getServices>>[number];
type Project = Awaited<ReturnType<typeof getProjects>>[number];
type Review = Awaited<ReturnType<typeof getTestimonials>>[number];
type Proof = Awaited<ReturnType<typeof getProofs>>[number];

const glassCard = 'glass-panel border-white/55 bg-white/45 shadow-[0_16px_50px_-34px_rgba(23,60,57,0.38)] ring-0 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]';
const glassHover = 'transition duration-300 hover:-translate-y-1 hover:bg-white/65 hover:shadow-[0_24px_60px_-32px_rgba(23,60,57,0.32)] dark:hover:bg-white/[0.07]';

export function SectionHeading({ eyebrow, title, text, align = 'center' }: { eyebrow: string; title: string; text?: string | null; align?: 'center' | 'left' }) {
  return (
    <Reveal className={`mb-10 max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{text}</p>}
    </Reveal>
  );
}

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <header className="relative isolate overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-muted/35 to-background px-4 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-20">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 -z-10 size-96 rounded-full bg-primary/10 blur-[100px]" />
      <Reveal className="relative mx-auto max-w-7xl">
        <Badge variant="outline" className="rounded-full border-primary/15 bg-background/50 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] backdrop-blur-md">{eyebrow}</Badge>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{text}</p>
      </Reveal>
    </header>
  );
}

export function ServiceCards({ services }: { services: Service[] }) {
  if (!services.length) return <p className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground backdrop-blur">Layanan akan segera ditampilkan.</p>;

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))' }}>
      {services.map((service, index) => (
        <Reveal key={service.id} delay={index * 0.06} className="h-full">
          <Card className={`${glassCard} ${glassHover} group h-full overflow-hidden rounded-3xl`}>
            {service.cover_image ? (
              <div className="relative aspect-[16/9] overflow-hidden bg-muted/60">
                <Image src={service.cover_image} alt={service.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <Badge variant="secondary" className="absolute bottom-4 left-4 rounded-full border border-white/40 bg-background/75 px-3 py-1 text-foreground shadow-sm backdrop-blur-md">{service.category}</Badge>
              </div>
            ) : (
              <div className="relative mx-5 mt-5 flex aspect-[16/8] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-muted/70 to-emerald-500/10">
                <div aria-hidden="true" className="absolute size-40 rounded-full bg-primary/10 blur-3xl" />
                <BriefcaseBusiness className="relative size-9 text-primary/80" />
                <Badge variant="secondary" className="absolute bottom-3 left-3 rounded-full bg-background/75 backdrop-blur-md">{service.category}</Badge>
              </div>
            )}
            <CardHeader className="gap-2 p-6 sm:p-7">
              {!service.cover_image && <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/75">Layanan DigiJockeys</span>}
              <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">{service.name}</CardTitle>
              <CardDescription className="line-clamp-4 text-sm leading-6 sm:text-[15px]">{service.description || 'Solusi yang dirancang sesuai tujuan bisnis Anda.'}</CardDescription>
            </CardHeader>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

export function ProjectCards({ projects }: { projects: Project[] }) {
  if (!projects.length) return <p className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground backdrop-blur">Portofolio pilihan kami akan segera hadir.</p>;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <Reveal key={project.id} delay={index * 0.06} className="h-full">
          <Link href={`/portfolio#${project.id}`} className="group block h-full">
            <Card className={`${glassCard} ${glassHover} h-full overflow-hidden rounded-3xl`}>
              {project.cover_image ? (
                <div className="relative aspect-[16/11] overflow-hidden bg-muted/60">
                  <Image src={project.cover_image} alt={`${project.project_name}, ${project.category}`} fill sizes="(max-width: 768px) 100vw, 33vw" unoptimized className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="flex aspect-[16/11] items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-emerald-500/10"><BriefcaseBusiness className="size-9 text-primary/70" /></div>
              )}
              <CardHeader className="gap-2 p-6">
                <div className="flex items-center justify-between gap-3">
                  <CardDescription className="font-medium">{project.category}</CardDescription>
                  <ArrowRight className="size-4 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
                <CardTitle className="text-lg font-semibold tracking-tight">{project.project_name}</CardTitle>
                {project.description && <CardDescription className="line-clamp-3 leading-6">{project.description}</CardDescription>}
              </CardHeader>
            </Card>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function ReviewCards({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return <p className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground backdrop-blur">Belum ada testimoni yang dipublikasikan.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review, index) => (
        <Reveal key={review.id} delay={index * 0.06} className="h-full">
          <Card className={`${glassCard} ${glassHover} h-full rounded-3xl`}>
            <CardContent className="flex h-full flex-col p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-amber-500" aria-label={`${review.rating} dari 5 bintang`}>
                  {Array.from({ length: review.rating }, (_, star) => <Star key={star} className="size-4 fill-current" />)}
                </div>
                <span aria-hidden="true" className="text-4xl font-serif leading-none text-primary/25">“</span>
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{review.description}</blockquote>
              <div className="mt-6 border-t border-border/70 pt-4">
                <p className="font-semibold">{review.customer_name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{review.services?.[0]?.name || 'Pelanggan DigiJockeys'}</p>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

export function ProofCards({ proofs }: { proofs: Proof[] }) {
  if (!proofs.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {proofs.map((proof, index) => (
        <Reveal key={proof.id} delay={index * 0.05}>
          <Card className={`${glassCard} overflow-hidden rounded-3xl`}>
            <div className="relative aspect-[4/3] bg-muted/60"><Image src={proof.image_path} alt={proof.description || 'Dokumentasi pekerjaan pelanggan'} fill sizes="(max-width: 768px) 100vw, 33vw" unoptimized className="object-cover" /></div>
            {(proof.description || proof.services?.[0]?.name) && (
              <CardContent className="p-5">
                {proof.description && <p className="leading-6">{proof.description}</p>}
                <p className="mt-2 text-xs text-muted-foreground">{proof.services?.[0]?.name || new Date(`${proof.proof_date}T00:00:00`).toLocaleDateString('id-ID')}</p>
              </CardContent>
            )}
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

export function ContactDetails({ settings }: { settings: SiteSettings }) {
  const contacts: { label: string; value: string; href: string; Icon: typeof Mail }[] = [];
  if (settings.email) contacts.push({ label: 'Email', value: settings.email, href: `mailto:${settings.email}`, Icon: Mail });
  if (settings.phone_number) contacts.push({ label: 'Telepon', value: settings.phone_number, href: `tel:${settings.phone_number}`, Icon: Phone });
  if (settings.instagram) contacts.push({ label: 'Instagram', value: settings.instagram, href: settings.instagram.startsWith('http') ? settings.instagram : `https://instagram.com/${settings.instagram.replace(/^@/, '')}`, Icon: AtSign });

  return (
    <div className="grid gap-3">
      {contacts.map(({ label, value, href, Icon }, index) => (
        <Reveal key={label} delay={index * 0.06}>
          <Card className={`${glassCard} ${glassHover} rounded-2xl`}>
            <CardContent className="flex items-center gap-4 p-5">
              <span className="flex size-11 items-center justify-center rounded-xl border border-primary/10 bg-primary/[0.07] text-primary"><Icon className="size-5" /></span>
              <div className="min-w-0 flex-1"><p className="text-xs text-muted-foreground">{label}</p><a className="mt-1 block truncate text-sm font-semibold hover:text-primary" href={href} target={label === 'Instagram' ? '_blank' : undefined} rel={label === 'Instagram' ? 'noreferrer' : undefined}>{value}</a></div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

export function CallToAction({ settings }: { settings: SiteSettings }) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/20 px-6 py-12 text-primary-foreground shadow-[0_30px_90px_-45px_rgba(18,54,48,0.6)] backdrop-blur-2xl sm:px-12 sm:py-16 lg:px-16" style={{ background: 'linear-gradient(135deg, rgba(27,66,66,0.94), rgba(32,75,70,0.9), rgba(18,51,48,0.94))' }}>
          <div aria-hidden="true" className="absolute -right-16 -top-36 -z-10 size-[28rem] rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -right-2 -top-24 -z-10 size-[22rem] rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -bottom-40 left-[38%] -z-10 size-80 rounded-full bg-emerald-300/10 blur-[90px]" />
          <div className="relative max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/80">Langkah berikutnya</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Mari wujudkan ide Anda menjadi sesuatu yang nyata.</h2>
            <p className="mt-4 max-w-xl leading-7 text-white/75">Ceritakan kebutuhan bisnis Anda. Tim {settings.business_name} siap membantu merancang langkah digital yang tepat.</p>
            <Button render={<Link href="/contact" />} variant="secondary" size="lg" className="mt-7 h-12 rounded-xl border border-white/35 bg-white/90 px-6 text-primary shadow-lg shadow-black/10 backdrop-blur-md hover:bg-white">Mulai percakapan <ArrowRight /></Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
