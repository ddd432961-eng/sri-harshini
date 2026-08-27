'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import type { HeroBanner } from '@/lib/queries';
import { cn } from '@/lib/utils';

export function HeroSlider({ banners }: { banners: HeroBanner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = () => setIndex((i) => (i - 1 + count) % count);

  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [paused, next, count]);

  if (count === 0) return null;
  const slide = banners[index];

  return (
    <section
      className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-maroon-deep"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image_url}
            alt={slide.title}
            className="h-full w-full object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-maroon-deep/85 via-maroon-deep/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* content */}
      <div className="container-luxe relative flex h-full items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-xl text-cream"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-gold-light backdrop-blur-sm">
              {slide.subtitle ? 'Featured' : 'Sri Harshini'}
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="mt-5 max-w-md text-base leading-relaxed text-cream/85 sm:text-lg">
                {slide.subtitle}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              {slide.primary_cta_label && slide.primary_cta_link && (
                <Link href={slide.primary_cta_link} className="btn-gold">
                  {slide.primary_cta_label}
                </Link>
              )}
              {slide.secondary_cta_label && slide.secondary_cta_link && (
                <Link
                  href={slide.secondary_cta_link}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/40 px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-cream backdrop-blur-sm transition-all hover:border-gold hover:bg-gold hover:text-maroon-deep"
                >
                  {slide.secondary_cta_label}
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* controls */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-cream/30 bg-maroon-deep/30 p-2.5 text-cream backdrop-blur-md transition-all hover:border-gold hover:bg-gold hover:text-maroon-deep sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-cream/30 bg-maroon-deep/30 p-2.5 text-cream backdrop-blur-md transition-all hover:border-gold hover:bg-gold hover:text-maroon-deep sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500',
                  i === index
                    ? 'w-10 bg-gold'
                    : 'w-4 bg-cream/40 hover:bg-cream/70',
                )}
              />
            ))}
          </div>
        </>
      )}

      {/* scroll hint */}
      <div className="absolute bottom-8 right-8 hidden flex-col items-center gap-2 text-cream/60 lg:flex">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-12 w-px bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
