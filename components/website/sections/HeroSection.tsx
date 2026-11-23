'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/website/Motion';

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

const rotatingLines = [
  'untuk bisnis yang ingin berkembang.',
  'untuk ide yang siap diwujudkan.',
  'untuk belajar dan riset terarah.',
];

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const [typedLine, setTypedLine] = useState(rotatingLines[0]);

  useEffect(() => {
    if (reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lineIndex = 0;
    let characterIndex = rotatingLines[0].length;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const currentLine = rotatingLines[lineIndex];

      if (!deleting) {
        if (characterIndex < currentLine.length) {
          characterIndex += 1;
          setTypedLine(currentLine.slice(0, characterIndex));
          timer = setTimeout(tick, 62);
        } else {
          deleting = true;
          timer = setTimeout(tick, 1500);
        }
        return;
      }

      if (characterIndex > 0) {
        characterIndex -= 1;
        setTypedLine(currentLine.slice(0, characterIndex));
        timer = setTimeout(tick, 28);
      } else {
        lineIndex = (lineIndex + 1) % rotatingLines.length;
        deleting = false;
        timer = setTimeout(tick, 240);
      }
    };

    timer = setTimeout(tick, 1800);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <section id="home" className="relative isolate overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pb-32 sm:pt-40 lg:pb-36 lg:pt-44">
      {/* Dynamic Animated Background with Drifting Orbs & Twinkling Stars */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Animated drifting glowing orb 1 */}
        <div className="hero-orb-drift absolute -right-20 top-10 size-[36rem] rounded-full bg-primary/20 blur-[130px]" />

        {/* Animated drifting glowing orb 2 */}
        <div className="hero-orb-drift-reverse absolute -left-32 top-1/3 size-[34rem] rounded-full bg-emerald-400/15 blur-[140px]" />

        {/* Pulsing center ambient aura */}
        <div className="hero-glow absolute left-1/2 top-16 size-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(57,118,109,0.25)_0%,transparent_70%)] blur-2xl" />

        {/* Twinkling star particles */}
        {stars.map((star, i) => (
          <div
            key={i}
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDuration: `${3 + (i % 3)}s`,
              animationDelay: `${star.delay}s`,
            }}
            className="hero-star absolute rounded-full bg-primary shadow-[0_0_12px_2px_rgba(57,118,109,0.8)]"
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

        {/* Keep the search heading static; animate only the supporting line. */}
        <Reveal delay={0.08}>
          <h1 className="mt-7 max-w-4xl text-balance text-[clamp(2.4rem,5.8vw,5.2rem)] font-extrabold leading-[1.1] tracking-[-0.04em] text-foreground">
            Jasa Website, Desain Kreatif &amp; Solusi Akademik.
          </h1>
          <p aria-hidden="true" className="mt-4 min-h-[1.5em] text-balance text-xl font-semibold tracking-tight text-primary sm:text-2xl lg:text-3xl">
            {typedLine}
            <span className="typing-caret ml-1 inline-block" />
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
            DigiJockeys membantu bisnis, individu, dan mahasiswa menemukan solusi yang sesuai dengan kebutuhannya.
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Button
              render={<Link href="/contact" />}
              size="lg"
              className="group h-13 rounded-2xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-xl hover:shadow-primary/30"
            >
              Diskusikan kebutuhan
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              render={<Link href="#services" />}
              size="lg"
              variant="outline"
              className="h-13 rounded-2xl border-border/80 bg-background/70 px-8 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted/70 hover:text-primary"
            >
              <Compass className="size-4 text-primary" />
              Lihat layanan
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
