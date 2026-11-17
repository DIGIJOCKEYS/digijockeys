'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/website/Motion';

const faqs = [
  {
    q: 'Bagaimana cara memesan layanan Digijockeys?',
    a: 'Anda dapat menghubungi kami melalui WhatsApp, menjelaskan kebutuhan, dan melakukan konsultasi awal secara santai. Tim kami akan segera merespons dan memetakan langkah selanjutnya.',
  },
  {
    q: 'Apakah bisa melakukan konsultasi sebelum memesan?',
    a: 'Tentu. Kami menyediakan konsultasi awal gratis untuk memahami kebutuhan, mendiskusikan ide Anda, dan menentukan solusi serta estimasi yang paling sesuai.',
  },
  {
    q: 'Apakah harga setiap layanan sama?',
    a: 'Tidak. Harga disesuaikan dengan jenis layanan, tingkat kesulitan, ruang lingkup pengerjaan, dan estimasi durasi. Kami selalu memberikan rincian transparan sebelum pengerjaan dimulai.',
  },
  {
    q: 'Berapa lama proses pengerjaannya?',
    a: 'Durasi pengerjaan bergantung pada jenis layanan dan kompleksitas kebutuhan. Estimasi waktu yang realistis akan kami sampaikan dan sepakati bersama sebelum pengerjaan dimulai.',
  },
  {
    q: 'Apakah menerima permintaan khusus?',
    a: 'Ya. Anda dapat menyampaikan kebutuhan spesifik atau kustomisasi khusus untuk kami pelajari dan diskusikan lebih lanjut agar hasilnya tepat seperti yang Anda harapkan.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative isolate overflow-hidden border-t border-border/70 bg-gradient-to-b from-muted/20 via-muted/35 to-muted/20 px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-1/4 -z-10 size-[32rem] rounded-full bg-primary/10 blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 bottom-0 -z-10 size-[30rem] rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ada yang Ingin Anda Ketahui?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Berikut jawaban untuk pertanyaan yang paling sering diajukan mengenai layanan kami.
          </p>
        </Reveal>

        {/* Accordion list */}
        <div className="mt-14 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Reveal key={faq.q} delay={idx * 0.05}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? 'border-primary/40 bg-card shadow-md shadow-primary/5'
                      : 'border-border/80 bg-card/70 hover:border-primary/30 hover:bg-card'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-bold text-foreground sm:text-lg">
                      {faq.q}
                    </span>
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${
                        isOpen
                          ? 'rotate-180 bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <ChevronDown className="size-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-border/50 px-5 pb-6 pt-3 sm:px-6">
                      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Still have questions prompt */}
        <Reveal delay={0.25} className="mt-12 rounded-3xl border border-primary/20 bg-primary/5 p-6 text-center backdrop-blur-sm sm:p-8">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HelpCircle className="size-6" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">Punya pertanyaan lain yang belum terjawab?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Jangan ragu untuk langsung berdiskusi dengan tim kami melalui WhatsApp atau formulir kontak.
          </p>
          <div className="mt-5">
            <Button
              render={<Link href="/contact" />}
              className="h-11 rounded-xl bg-primary px-6 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/95"
            >
              <MessageCircle className="size-4" />
              Tanyakan Langsung ke Tim Kami
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

