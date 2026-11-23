import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, Phone, Star, Quote, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Reveal } from '@/components/website/Motion';
import { extractServiceName } from '@/lib/supabase/client-utils';
import type { getProjects, getServices, getTestimonials, getProofs, SiteSettings } from '@/lib/supabase/public-data';

type Service = Awaited<ReturnType<typeof getServices>>[number];
type Project = Awaited<ReturnType<typeof getProjects>>[number];
type Review = Awaited<ReturnType<typeof getTestimonials>>[number];
type Proof = Awaited<ReturnType<typeof getProofs>>[number];

const cardBase = 'border border-border/80 bg-card/85 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/5';

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <header className="relative isolate overflow-hidden border-b border-border/70 bg-gradient-to-b from-background via-muted/30 to-background px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 -z-10 size-96 rounded-full bg-primary/15 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 bottom-0 -z-10 size-80 rounded-full bg-emerald-400/10 blur-[110px]" />
      <Reveal className="relative mx-auto w-full max-w-7xl text-center">
        <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-primary backdrop-blur-md">
          {eyebrow}
        </Badge>
        <h1 className="mx-auto mt-5 w-full max-w-5xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">{text}</p>
      </Reveal>
    </header>
  );
}

export function ServiceCards({ services }: { services: Service[] }) {
  if (!services.length) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center text-muted-foreground">
        <BriefcaseBusiness className="mx-auto size-10 text-muted-foreground/60" />
        <p className="mt-3 font-semibold">Layanan sedang dipersiapkan.</p>
        <p className="mt-1 text-sm">Silakan hubungi kami untuk informasi katalog layanan lengkap.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <Reveal key={service.id} delay={index * 0.06} className="h-full">
          <Card className={`${cardBase} group flex h-full flex-col overflow-hidden rounded-3xl`}>
            {service.cover_image ? (
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <Image
                  src={service.cover_image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <Badge variant="secondary" className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-background/85 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                  {service.category}
                </Badge>
              </div>
            ) : (
              <div className="relative mx-5 mt-5 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-muted to-emerald-500/10">
                <BriefcaseBusiness className="relative size-10 text-primary" />
                <Badge variant="secondary" className="absolute bottom-3 left-3 rounded-full bg-background/85 text-xs font-semibold backdrop-blur-md">
                  {service.category}
                </Badge>
              </div>
            )}
            <CardHeader className="flex-1 gap-2 p-6 sm:p-7">
              <CardTitle className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{service.name}</CardTitle>
              <CardDescription className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                  {service.description || 'Hubungi kami untuk detail layanan ini.'}
              </CardDescription>
            </CardHeader>
            <div className="border-t border-border/60 p-6 pt-0">
              <Button render={<Link href="/contact" />} variant="outline" className="w-full rounded-xl border-border/80 text-xs font-semibold hover:bg-primary hover:text-primary-foreground">
                Konsultasikan Layanan Ini <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

export function ProjectCards({ projects }: { projects: Project[] }) {
  if (!projects.length) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center text-muted-foreground">
        <p className="font-semibold">Portofolio pilihan kami sedang dikurasi.</p>
        <p className="mt-1 text-sm">Hubungi tim kami untuk melihat contoh proyek terbaru secara langsung.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <Reveal key={project.id} delay={index * 0.06} className="h-full">
          <Link href={`/portfolio#${project.id}`} className="group block h-full">
            <Card className={`${cardBase} flex h-full flex-col overflow-hidden rounded-3xl`}>
              {project.cover_image ? (
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={project.cover_image}
                    alt={`${project.project_name}, ${project.category}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
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
              <CardHeader className="flex-1 gap-2 p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">{project.category}</span>
                  <ArrowRight className="size-4 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
                <CardTitle className="text-lg font-bold tracking-tight text-foreground sm:text-xl">{project.project_name}</CardTitle>
                {project.description && (
                  <CardDescription className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function ReviewCards({ reviews }: { reviews: Review[] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center text-muted-foreground">
        <p className="font-semibold text-foreground">Belum ada ulasan yang ditampilkan.</p>
        <p className="mt-1 text-sm">Ulasan yang sudah ditinjau akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review, index) => {
        const serviceName = extractServiceName(review.services);
        return (
          <Reveal key={review.id} delay={index * 0.06} className="h-full">
            <Card className={`${cardBase} flex h-full flex-col justify-between rounded-3xl p-6 sm:p-7`}>
              <CardContent className="flex h-full flex-col justify-between p-0">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-amber-500" aria-label={`${review.rating} dari 5 bintang`}>
                      {Array.from({ length: review.rating }, (_, star) => (
                        <Star key={star} className="size-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <Quote className="size-7 text-primary/20" />
                  </div>
                  <blockquote className="mt-4 text-sm leading-relaxed text-foreground/85 sm:text-[15px]">
                    &ldquo;{review.description}&rdquo;
                  </blockquote>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
                  <div>
                    <p className="font-bold text-foreground">{review.customer_name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{serviceName}</p>
                  </div>
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {review.customer_name.slice(0, 1).toUpperCase()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        );
      })}
    </div>
  );
}

export function ProofCards({ proofs }: { proofs: Proof[] }) {
  if (!proofs.length) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {proofs.map((proof, index) => (
        <Reveal key={proof.id} delay={index * 0.05} className="h-full">
          <Card className={`${cardBase} flex h-full flex-col overflow-hidden rounded-3xl`}>
            <div className="relative aspect-[16/10] bg-muted">
              <Image
                src={proof.image_path}
                alt={proof.description || 'Dokumentasi pekerjaan pelanggan'}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <CardContent className="flex flex-1 flex-col justify-between p-6">
              <p className="text-sm leading-relaxed text-foreground/85">
                {proof.description || `Bukti pengerjaan & serah terima ${extractServiceName(proof.services)} terverifikasi.`}
              </p>
              <p className="mt-4 border-t border-border/60 pt-3 text-xs font-semibold text-primary">
                {extractServiceName(proof.services)} {proof.proof_date ? `· ${new Date(`${proof.proof_date}T00:00:00`).toLocaleDateString('id-ID')}` : ''}
              </p>
            </CardContent>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

export function ContactDetails({ settings }: { settings: SiteSettings }) {
  const contacts: { label: string; value: string; href: string; icon?: string; Icon?: typeof Phone }[] = [];
  if (settings.email) contacts.push({ label: 'Email', value: settings.email, href: `mailto:${settings.email}`, icon: '/icon/email.svg' });
  if (settings.phone_number) contacts.push({ label: 'Telepon', value: settings.phone_number, href: `tel:${settings.phone_number}`, Icon: Phone });
  if (settings.instagram) contacts.push({ label: 'Instagram', value: settings.instagram, href: settings.instagram.startsWith('http') ? settings.instagram : `https://instagram.com/${settings.instagram.replace(/^@/, '')}`, icon: '/icon/instagram.svg' });

  return (
    <div className="grid gap-4">
      {contacts.map(({ label, value, href, icon, Icon }, index) => (
        <Reveal key={label} delay={index * 0.06}>
          <Card className={`${cardBase} rounded-2xl`}>
            <CardContent className="flex items-center gap-4 p-5">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {icon ? <Image src={icon} alt="" width={22} height={22} /> : Icon && <Icon className="size-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                <a className="mt-1 block truncate text-sm font-bold text-foreground hover:text-primary" href={href} target={label === 'Instagram' ? '_blank' : undefined} rel={label === 'Instagram' ? 'noreferrer' : undefined}>
                  {value}
                </a>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

export function CallToAction() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <Reveal className="mx-auto max-w-7xl">
        <div
          className="relative isolate overflow-hidden rounded-[2.5rem] border border-white/20 px-6 py-14 text-white shadow-2xl backdrop-blur-2xl sm:px-12 sm:py-20 lg:px-16"
          style={{ background: 'linear-gradient(135deg, rgba(27,66,66,0.96), rgba(35,82,76,0.92), rgba(18,48,45,0.97))' }}
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-36 -z-10 size-[32rem] rounded-full border border-white/10" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 left-1/3 -z-10 size-96 rounded-full bg-emerald-400/20 blur-[100px]" />
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
              <Sparkles className="size-3.5" /> LET&apos;S WORK TOGETHER
            </div>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Punya Ide? Mari Wujudkan Bersama.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg sm:leading-8">
              Tidak perlu bingung mencari solusi untuk setiap kebutuhan Anda. Ceritakan apa yang sedang Anda rencanakan, dan biarkan kami membantu menemukan solusi yang tepat.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button render={<Link href="/contact" />} size="lg" className="h-13 rounded-2xl bg-white px-8 text-sm font-bold text-primary shadow-xl hover:bg-white/95">
                Mulai Konsultasi <ArrowRight className="size-4" />
              </Button>
              <Button render={<Link href="/services" />} size="lg" variant="outline" className="h-13 rounded-2xl border-white/30 bg-white/10 px-8 text-sm font-semibold text-white hover:bg-white/20">
                Lihat Layanan Kami
              </Button>
            </div>
            <div className="mt-14 border-t border-white/15 pt-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-emerald-200">DIGI JOCKEYS</p>
              <p className="mt-1 text-sm font-medium text-white/90">Digital Creative &amp; Academic Solutions.</p>
              <p className="mt-1 text-xs text-white/70">Solusi digital, kreatif, dan akademik dalam satu tempat.</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
