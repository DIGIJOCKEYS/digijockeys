import { Target, Gem, MessageSquareCheck, Eye, Layers, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Reveal } from '@/components/website/Motion';

const reasons = [
  {
    icon: Target,
    title: 'Solusi Sesuai Kebutuhan',
    description: 'Setiap layanan disesuaikan dengan kebutuhan, tujuan, dan anggaran pelanggan tanpa memaksakan paket yang tidak perlu.',
    highlight: 'Disesuaikan dengan Anggaran',
    colSpan: 'lg:col-span-3',
  },
  {
    icon: Gem,
    title: 'Kualitas dan Detail',
    description: 'Kami memperhatikan setiap detail untuk menghasilkan pekerjaan yang rapi, relevan, dan profesional standar industri.',
    highlight: 'Standar Hasil Maksimal',
    colSpan: 'lg:col-span-3',
  },
  {
    icon: MessageSquareCheck,
    title: 'Komunikasi Responsif',
    description: 'Proses konsultasi dan pengerjaan didukung komunikasi yang jelas, santai, dan terbuka setiap saat.',
    highlight: 'Respon Cepat & Ramah',
    colSpan: 'lg:col-span-2',
  },
  {
    icon: Eye,
    title: 'Proses Transparan',
    description: 'Anda mendapatkan informasi mengenai tahapan pengerjaan, estimasi waktu, dan ruang lingkup layanan yang jelas.',
    highlight: 'Timeline Jelas & Terukur',
    colSpan: 'lg:col-span-2',
  },
  {
    icon: Layers,
    title: 'Fleksibel dan Praktis',
    description: 'Berbagai kebutuhan dapat dikonsultasikan dalam satu tempat tanpa proses administrasi yang rumit.',
    highlight: 'One-stop Solution',
    colSpan: 'lg:col-span-2',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="relative isolate overflow-hidden border-y border-border/70 bg-gradient-to-b from-muted/20 via-muted/40 to-muted/20 px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-1/2 -z-10 size-[32rem] rounded-full bg-primary/10 blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 bottom-0 -z-10 size-[30rem] rounded-full bg-emerald-300/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            WHY DIGI JOCKEYS
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Kenapa Memilih Digijockeys?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Kami memahami bahwa Anda tidak hanya membutuhkan hasil, tetapi juga proses yang nyaman dan dapat dipercaya.
          </p>
        </Reveal>

        {/* Bento Grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.07} className={`${item.colSpan} h-full`}>
                <Card className="group relative h-full rounded-3xl border border-border/80 bg-card/90 p-7 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/5">
                  <CardContent className="flex h-full flex-col justify-between p-0">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="size-5" />
                        </span>
                        <span className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary">
                          {item.highlight}
                        </span>
                      </div>
                      <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

