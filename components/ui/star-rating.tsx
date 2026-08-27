import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRating({
  rating,
  size = 16,
  className,
  showValue = false,
  count,
}: {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  count?: number;
}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full;
          const isHalf = !filled && i === full && half;
          return (
            <span key={i} className="relative" style={{ width: size, height: size }}>
              <Star
                className="absolute inset-0 text-gold/30"
                style={{ width: size, height: size }}
                fill="currentColor"
              />
              {(filled || isHalf) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: isHalf ? size / 2 : size }}
                >
                  <Star
                    className="text-gold"
                    style={{ width: size, height: size }}
                    fill="currentColor"
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-foreground">
          {rating.toFixed(1)}
          {count !== undefined && (
            <span className="ml-1 text-muted-foreground">({count})</span>
          )}
        </span>
      )}
    </div>
  );
}
