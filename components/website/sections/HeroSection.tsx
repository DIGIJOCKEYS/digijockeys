'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Sparkles, Code2, Palette, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/website/Motion';

const typingPhrases = [
  'Wujudkan dengan Lebih Mudah.',
  'Website Bisnis & UMKM Modern.',
  'Desain Kreatif & Visual Menarik.',
  'Pendampingan Skripsi & Akademik.',
  'Solusi Cepat, Rapi & Terpercaya.',
];

// Twinkling stars data
const stars = [
  { top: '15%', left: '12%', size: 4, delay: 0 },
  { top: '22%', left: '85%', size: 5, delay: 1.2 },
  { top: '38%', left: '8%', size: 3, delay: 2.1 },
  { top: '65%', left: '92%', size: 4, delay: 0.8 },
  { top: '78%', left: '18%', size: 5, delay: 1.8 },
  { top: '30%', left: '72%', size: 3, delay: 2.5 },
  { top: '82%', left: '80%', size: 4, delay: 3.1 },
  { top: '18%', left: '50%', size: 3, delay: 1.5 },
];

export default function HeroSection() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing effect engine
  useEffect(() => {
    const current = typingPhrases[phraseIndex];
    const typingSpeed = isDeleting ? 40 : 85;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        setDisplayText(current.substring(0, displayText.length + 1));
        if (displayText.length + 1 === current.length) {
          // Pause at full text
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        // Deleting backward
        setDisplayText(current.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % typingPhrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <section id="home" className="relative isolate overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pb-32 sm:pt-40 lg:pb-36 lg:pt-44">
      {/* Dynamic Animated Background with Drifting Orbs & Twinkling Stars */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Animated drifting glowing orb 1 */}
        <motion.div
          animate={{
            x: [0, 45, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-20 top-10 size-[36rem] rounded-full bg-primary/20 blur-[130px]"
        />

        {/* Animated drifting glowing orb 2 */}
        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 50, -35, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-32 top-1/3 size-[34rem] rounded-full bg-emerald-400/15 blur-[140px]"
        />

        {/* Pulsing center ambient aura */}
        <div className="hero-glow absolute left-1/2 top-16 size-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(57,118,109,0.25)_0%,transparent_70%)] blur-2xl" />

        {/* Twinkling star particles */}
        {stars.map((star, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.15, 0.9, 0.15],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: star.delay,
              ease: 'easeInOut',
            }}
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
            }}
            className="absolute rounded-full bg-primary shadow-[0_0_12px_2px_rgba(57,118,109,0.8)]"
          />
        ))}

        {/* Orbit outlines */}
        <div className="hero-orbit absolute left-1/2 top-10 size-[min(84vw,42rem)] -translate-x-1/2 rounded-full border border-primary/[0.08]" />
        <div className="hero-orbit hero-orbit-delayed absolute left-1/2 top-24 size-[min(64vw,32rem)] -translate-x-1/2 rounded-full border border-primary/[0.05]" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {/* Eyebrow badge */}
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-1.5 shadow-sm backdrop-blur-md transition-all hover:border-primary/40 hover:shadow-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              DIGITAL CREATIVE &amp; ACADEMIC SOLUTIONS
            </span>
            <Sparkles className="size-3.5 text-primary" />
          </div>
        </Reveal>

        {/* Main Heading with Typing Animation */}
        <Reveal delay={0.08}>
          <h1 className="mt-7 max-w-4xl text-balance text-[clamp(2.4rem,5.8vw,5.2rem)] font-extrabold leading-[1.1] tracking-[-0.04em] text-foreground">
            Ide Anda, Solusi Kami.{' '}
            <span className="mt-2 block min-h-[1.25em] bg-gradient-to-r from-primary via-[#2f6f66] to-[#77b6a8] bg-clip-text text-transparent">
              {displayText}
              <span className="inline-block w-[3px] h-[0.9em] ml-1.5 align-middle bg-primary animate-pulse" />
            </span>
          </h1>
        </Reveal>

        {/* Supporting Descriptions */}
        <Reveal delay={0.15}>
          <div className="mx-auto mt-6 max-w-2xl space-y-3 text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
            <p>
              Digijockeys hadir membantu kebutuhan digital, kreatif, dan akademik melalui solusi yang dirancang secara profesional, praktis, dan sesuai kebutuhan Anda.
            </p>
            <p className="text-sm font-medium text-foreground/80 sm:text-base">
              Mulai dari pengembangan website, desain visual, hingga pendampingan akademik. Kami siap membantu setiap ide berkembang menjadi sesuatu yang bernilai.
            </p>
          </div>
        </Reveal>

        {/* Primary and Secondary CTA Buttons */}
        <Reveal delay={0.22}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <Button
              render={<Link href="/contact" />}
              size="lg"
              className="group h-13 rounded-2xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-xl hover:shadow-primary/30"
            >
              Konsultasikan Kebutuhan Anda
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              render={<Link href="#services" />}
              size="lg"
              variant="outline"
              className="h-13 rounded-2xl border-border/80 bg-background/70 px-8 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/70 hover:text-primary hover:border-primary/40"
            >
              <Compass className="size-4 text-primary" />
              Jelajahi Layanan
            </Button>
          </div>
        </Reveal>

        {/* Three Category Pillars Preview */}
        <Reveal delay={0.3} className="mt-14 w-full max-w-4xl">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <div className="flex items-center gap-3.5 rounded-2xl border border-border/60 bg-card/65 p-4 text-left backdrop-blur-md transition-all hover:border-primary/40 hover:bg-card/90 hover:shadow-lg hover:shadow-primary/5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Code2 className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Digital &amp; Tech</p>
                <p className="text-xs text-muted-foreground">Website &amp; Sistem Modern</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-2xl border border-border/60 bg-card/65 p-4 text-left backdrop-blur-md transition-all hover:border-primary/40 hover:bg-card/90 hover:shadow-lg hover:shadow-primary/5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Palette className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Creative &amp; Design</p>
                <p className="text-xs text-muted-foreground">Visual Menarik &amp; Elegan</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-2xl border border-border/60 bg-card/65 p-4 text-left backdrop-blur-md transition-all hover:border-primary/40 hover:bg-card/90 hover:shadow-lg hover:shadow-primary/5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Academic Support</p>
                <p className="text-xs text-muted-foreground">Pendampingan Terarah</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
