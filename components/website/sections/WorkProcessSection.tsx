import { MessagesSquare, FileSpreadsheet, Cpu, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Reveal } from '@/components/website/Motion';

const steps = [
  {
    step: '01',
    title: 'Konsultasi',
    subtitle: 'Ceritakan kebutuhan, ide, atau permasalahan yang ingin Anda selesaikan.',
    icon: MessagesSquare,
  },
  {
    step: '02',
    title: 'Analisis & Penawaran',
    subtitle: 'Kami mempelajari kebutuhan Anda, menentukan solusi, ruang lingkup pekerjaan, biaya, dan estimasi waktu.',
    icon: FileSpreadsheet,
  },
  {
    step: '03',
    title: 'Proses Pengerjaan',
    subtitle: 'Pekerjaan dimulai sesuai kesepakatan dengan komunikasi dan pembaruan progres secara berkala.',
    icon: Cpu,
  },
  {
    step: '04',
    title: 'Review & Finalisasi',
    subtitle: 'Hasil diperiksa bersama, dilakukan penyesuaian sesuai kesepakatan, kemudian diserahkan.',
    icon: CheckCircle2,
  },
];

export default function WorkProcessSection() {
  return (
    <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-1/4 -z-10 size-[32rem] rounded-full bg-emerald-400/10 blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 bottom-1/4 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            HOW WE WORK
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Sederhana Prosesnya, Jelas Hasilnya.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Kami membuat setiap proses pemesanan menjadi lebih mudah melalui empat tahapan terstruktur.
          </p>
        </Reveal>

        {/* 4 Process Steps Flow */}
        <div className="relative mt-16">
          {/* Connecting line for desktop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-12 right-12 top-1/2 hidden -translate-y-12 border-t-2 border-dashed border-primary/20 lg:block"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.step} delay={index * 0.08} className="h-full">
                  <Card className="group relative h-full rounded-3xl border border-border/80 bg-card/85 p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/10 sm:p-7">
                    <CardContent className="flex h-full flex-col justify-between p-0">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                            <Icon className="size-5" />
                          </span>
                          <span className="font-mono text-2xl font-black text-primary/40 group-hover:text-primary">
                            {item.step}
                          </span>
                        </div>
                        <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground">{item.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.subtitle}</p>
                      </div>

                      <div className="mt-6 border-t border-border/60 pt-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          Tahap {index + 1} dari 4
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

