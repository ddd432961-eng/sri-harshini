'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ProductImage({
  src,
  alt,
  className,
  aspect = 'aspect-[3/4]',
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  aspect?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn('relative overflow-hidden bg-muted', aspect, className)}>
      {!loaded && <div className="absolute inset-0 animate-shimmer shimmer-bg" />}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        className={cn(
          'h-full w-full object-cover transition-all duration-700',
          loaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
        )}
      />
    </div>
  );
}
