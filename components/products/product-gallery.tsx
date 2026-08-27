'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductGallery({
  images,
  videoUrl,
  name,
}: {
  images: string[];
  videoUrl?: string | null;
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<string | null>(null);
  const media = videoUrl ? [...images, '__video__'] : images;

  const go = (dir: number) =>
    setActive((i) => (i + dir + media.length) % media.length);

  return (
    <div className="flex flex-col gap-4">
      {/* main */}
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-[3/4]"
          >
            {media[active] === '__video__' ? (
              <iframe
                src={videoUrl!}
                title={name}
                className="h-full w-full"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={media[active]}
                  alt={`${name} — view ${active + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => setZoom(media[active])}
                  className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-maroon backdrop-blur-md transition-all hover:bg-maroon hover:text-cream dark:bg-card/70"
                  aria-label="Zoom image"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
        {media.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-maroon-deep/40 p-2 text-cream backdrop-blur-md transition hover:bg-maroon"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-maroon-deep/40 p-2 text-cream backdrop-blur-md transition hover:bg-maroon"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* thumbs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {media.map((m, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              'relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
              i === active
                ? 'border-maroon dark:border-gold'
                : 'border-transparent opacity-60 hover:opacity-100',
            )}
          >
            {m === '__video__' ? (
              <span className="flex h-full w-full items-center justify-center bg-maroon-deep text-cream">
                ▶
              </span>
            ) : (
              <img src={m} alt="" className="h-full w-full object-cover" />
            )}
          </button>
        ))}
      </div>

      {/* zoom lightbox */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-maroon-deep/90 p-4"
            onClick={() => setZoom(null)}
          >
            <button
              className="absolute right-5 top-5 text-cream"
              aria-label="Close"
            >
              <X className="h-8 w-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={zoom}
              alt={name}
              className="max-h-[90vh] max-w-full rounded-lg object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
