
'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';

import {
  ArrowRight,
  Star,
  Quote,
  MessageSquareQuote,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Reveal } from '@/components/website/Motion';

import { extractServiceName } from '@/lib/supabase/client-utils';
import type { getTestimonials } from '@/lib/supabase/public-data';

type Review = Awaited<ReturnType<typeof getTestimonials>>[number];

export default function TestimonialsSection({
  reviews = [],
}: {
  reviews?: Review[];
}) {
  // =========================================
  // 1. REFS & ANIMATION STATE
  // =========================================

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);

  const hoveringRef = useRef(false);
  const draggingRef = useRef(false);

  const pointerStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);

  // =========================================
  // 2. DUPLICATE REVIEWS
  // =========================================

  const loopedReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return [];
    }

    // Ensure enough cards to fill the viewport
    const multiplier = Math.max(
      3,
      Math.ceil(12 / reviews.length)
    );

    const items: Review[] = [];

    for (let i = 0; i < multiplier; i++) {
      items.push(...reviews);
    }

    return items;
  }, [reviews]);

  const duplicatedReviews = useMemo(
    () => [
      {
        id: 'original',
        items: loopedReviews,
      },
      {
        id: 'duplicate',
        items: loopedReviews,
      },
    ],
    [loopedReviews]
  );

  // =========================================
  // 3. INFINITE ANIMATION ENGINE
  // =========================================

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport || !track || loopedReviews.length === 0) {
      return;
    }

    let animationFrameId = 0;
    let previousTime = 0;

    // Speed in pixels per second
    const speed = 24;

    // Measure the width of one complete review group
    const measureWidth = () => {
      loopWidthRef.current = track.scrollWidth / 2;

      if (loopWidthRef.current > 0) {
        offsetRef.current =
          offsetRef.current % loopWidthRef.current;
      }
    };

    // Keep offset inside the infinite loop range
    const normalizeOffset = (value: number) => {
      const width = loopWidthRef.current;

      if (width <= 0) return 0;

      return ((value % width) + width) % width;
    };

    // Apply position directly without React re-rendering
    const applyPosition = () => {
      track.style.transform =
        `translate3d(${-offsetRef.current}px, 0, 0)`;
    };

    // Animation frame
    const animate = (time: number) => {
      if (!previousTime) {
        previousTime = time;
      }

      // Prevent large jumps after browser tab inactivity
      const deltaTime = Math.min(
        (time - previousTime) / 1000,
        0.05
      );

      previousTime = time;

      const isPaused =
        hoveringRef.current || draggingRef.current;

      if (!isPaused && loopWidthRef.current > 0) {
        offsetRef.current = normalizeOffset(
          offsetRef.current + speed * deltaTime
        );

        applyPosition();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initial measurement
    measureWidth();
    applyPosition();

    // Recalculate when viewport changes size
    const resizeObserver = new ResizeObserver(() => {
      measureWidth();
      applyPosition();
    });

    resizeObserver.observe(viewport);
    resizeObserver.observe(track);

    // Start animation
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [loopedReviews]);

  // =========================================
  // 4. MOUSE HOVER HANDLERS
  // =========================================

  const handlePointerEnter = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    // Only pause automatically for mouse hover.
    // Touch devices use drag/swipe instead.
    if (event.pointerType === 'mouse') {
      hoveringRef.current = true;
    }
  };

  const handlePointerLeave = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (event.pointerType === 'mouse') {
      hoveringRef.current = false;
    }
  };

  // =========================================
  // 5. DRAG / SWIPE HANDLERS
  // =========================================

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    // Only use the primary mouse button
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    const viewport = viewportRef.current;

    if (!viewport) return;

    draggingRef.current = true;

    pointerIdRef.current = event.pointerId;

    pointerStartXRef.current = event.clientX;

    dragStartOffsetRef.current = offsetRef.current;

    // Capture pointer so dragging continues outside the viewport
    viewport.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (
      !draggingRef.current ||
      pointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    const deltaX =
      event.clientX - pointerStartXRef.current;

    const width = loopWidthRef.current;

    if (width <= 0) return;

    // Drag right = move cards right
    // Drag left = move cards left
    const nextOffset =
      dragStartOffsetRef.current - deltaX;

    offsetRef.current =
      ((nextOffset % width) + width) % width;

    if (trackRef.current) {
      trackRef.current.style.transform =
        `translate3d(${-offsetRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    draggingRef.current = false;
    pointerIdRef.current = null;

    const viewport = viewportRef.current;

    if (viewport?.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerCancel = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    draggingRef.current = false;
    pointerIdRef.current = null;
  };

  // =========================================
  // 6. RENDER
  // =========================================

  return (
    <section
      id="testimonials"
      className="relative isolate overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:py-32"
    >
      {/* Background Decoration */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-1/3 -z-10 size-[32rem] rounded-full bg-emerald-400/10 blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 bottom-10 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[120px]"
      />

      {/* Section Header */}

      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            CLIENT EXPERIENCES
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Kepercayaan Dibangun dari Pengalaman.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Kami menghargai setiap kepercayaan yang diberikan kepada
            Digijockeys. Berikut pengalaman pelanggan yang telah
            menggunakan layanan kami.
          </p>

        </Reveal>
      </div>

      {/* Testimonial Infinite Carousel */}

      {loopedReviews.length > 0 ? (
        <div
          ref={viewportRef}
          className="relative mt-14 w-full overflow-hidden py-4 cursor-grab active:cursor-grabbing select-none touch-pan-y"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onLostPointerCapture={() => {
            draggingRef.current = false;
            pointerIdRef.current = null;
          }}
        >

          {/* Moving Track */}

          <div
            ref={trackRef}
            className="flex w-max items-stretch will-change-transform"
          >

            {duplicatedReviews.map((group) => (
              <div
                key={group.id}
                className="flex shrink-0 items-stretch gap-5 pr-5"
                aria-hidden={
                  group.id === 'duplicate' ? true : undefined
                }
              >

                {group.items.map((item, idx) => {
                  const serviceName = extractServiceName(
                    item.services
                  );

                  return (
                    <div
                      key={`${item.id}-${group.id}-${idx}`}
                      className="w-[310px] shrink-0 sm:w-[380px]"
                    >

                      <Card className="group relative h-full rounded-3xl border border-border/80 bg-card/90 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card sm:p-7">

                        <CardContent className="flex h-full flex-col justify-between p-0">

                          {/* Rating & Quote */}

                          <div>

                            <div className="flex items-center justify-between">

                              <div
                                className="flex gap-1 text-amber-500"
                                aria-label={`${item.rating} dari 5 bintang`}
                              >
                                {Array.from(
                                  { length: item.rating },
                                  (_, i) => (
                                    <Star
                                      key={i}
                                      className="size-4 fill-amber-500 text-amber-500"
                                    />
                                  )
                                )}
                              </div>

                              <Quote className="size-7 text-primary/20 transition-colors group-hover:text-primary/40" />

                            </div>

                            {/* Review Description */}

                            <p className="mt-4 text-sm leading-relaxed text-foreground/85 sm:text-[15px]">
                              &ldquo;{item.description}&rdquo;
                            </p>

                          </div>

                          {/* Customer Information */}

                          <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">

                            <div>
                              <p className="text-sm font-bold text-foreground">
                                {item.customer_name}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {serviceName}
                              </p>
                            </div>

                            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {item.customer_name
                                .slice(0, 1)
                                .toUpperCase()}
                            </span>

                          </div>

                        </CardContent>
                      </Card>

                    </div>
                  );
                })}

              </div>
            ))}

          </div>
        </div>
      ) : (

        /* Empty State */

        <div className="mx-auto mt-12 max-w-md rounded-3xl border border-dashed border-border/80 bg-card/60 p-8 text-center">

          <MessageSquareQuote className="mx-auto size-10 text-muted-foreground/60" />

          <p className="mt-3 font-semibold text-foreground">
            Belum ada testimoni yang dipublikasikan.
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Kirimkan ulasan pengalaman Anda menggunakan layanan kami.
          </p>

          <Button
            render={<Link href="/testimonials#bagikan-ulasan" />}
            size="sm"
            className="mt-4 rounded-xl"
          >
            Tulis Ulasan Pertama
          </Button>

        </div>
      )}

      {/* View All Reviews */}

      <Reveal delay={0.2} className="mt-12 text-center">

        <Button
          render={<Link href="/testimonials" />}
          size="lg"
          variant="outline"
          className="group h-13 rounded-2xl border-border/80 bg-background/60 px-8 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary hover:text-primary-foreground"
        >
          Lihat Semua Ulasan &amp; Bukti Pengerjaan

          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>

      </Reveal>

    </section>
  );
}
