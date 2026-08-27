'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Zap,
  Share2,
  Truck,
  RefreshCw,
  ShieldCheck,
  Check,
  Ruler,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types/database';
import { formatINR, discountPercent, estimatedDelivery } from '@/lib/format';
import { useStore } from '@/components/providers/store-provider';
import { StarRating } from '@/components/ui/star-rating';
import { cn } from '@/lib/utils';

export function ProductPurchase({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const [size, setSize] = useState(product.sizes?.[0] ?? 'Free Size');
  const [color, setColor] = useState(product.colors?.[0] ?? '');
  const [qty, setQty] = useState(1);
  const saved = inWishlist(product.id);
  const discount = discountPercent(product.price, product.compare_at_price);

  const handleAdd = (buyNow = false) => {
    addToCart({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0],
      size,
      color,
      quantity: qty,
    });
    if (buyNow) {
      window.location.href = '/checkout';
    }
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep dark:text-gold">
          {product.fabric ?? 'Silk'}
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
          {product.name}
        </h1>
        <div className="mt-3 flex items-center gap-3">
          <StarRating rating={product.rating} size={16} showValue count={product.review_count} />
          <span className="text-sm text-muted-foreground">
            {product.occasion}
          </span>
        </div>
      </div>

      <div className="flex items-end gap-3">
        <span className="font-serif text-3xl font-semibold text-maroon dark:text-gold">
          {formatINR(product.price)}
        </span>
        {product.compare_at_price && (
          <span className="mb-1 text-lg text-muted-foreground line-through">
            {formatINR(product.compare_at_price)}
          </span>
        )}
        {discount && (
          <span className="mb-1.5 rounded-full bg-maroon px-2.5 py-1 text-xs font-bold text-cream">
            Save {discount}%
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Inclusive of all taxes
      </p>

      <p className="text-sm leading-relaxed text-foreground/80">
        {product.short_description}
      </p>

      {/* colors */}
      {product.colors.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Color: <span className="text-foreground">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm transition-all',
                  color === c
                    ? 'border-maroon bg-maroon text-cream dark:border-gold dark:bg-gold dark:text-maroon-deep'
                    : 'border-border hover:border-maroon dark:hover:border-gold',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* sizes */}
      {product.sizes.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Size: <span className="text-foreground">{size}</span>
            </p>
            <Link
              href="#size-guide"
              className="inline-flex items-center gap-1 text-xs text-maroon hover:underline dark:text-gold"
            >
              <Ruler className="h-3.5 w-3.5" /> Size Guide
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  'min-w-12 rounded-lg border px-3 py-2 text-sm transition-all',
                  size === s
                    ? 'border-maroon bg-maroon text-cream dark:border-gold dark:bg-gold dark:text-maroon-deep'
                    : 'border-border hover:border-maroon dark:hover:border-gold',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* qty */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/70">
          Quantity
        </p>
        <div className="inline-flex items-center rounded-lg border border-border">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-2 text-lg"
            aria-label="Decrease"
          >
            −
          </button>
          <span className="min-w-10 text-center font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-4 py-2 text-lg"
            aria-label="Increase"
          >
            +
          </button>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={() => handleAdd(false)} className="btn-luxe flex-1">
          <ShoppingBag className="h-4 w-4" /> Add to Cart
        </button>
        <button onClick={() => handleAdd(true)} className="btn-gold flex-1">
          <Zap className="h-4 w-4" /> Buy Now
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => toggleWishlist(product.id, product.name)}
          className={cn(
            'inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all',
            saved
              ? 'border-maroon bg-maroon/5 text-maroon dark:border-gold dark:text-gold'
              : 'border-border hover:border-maroon dark:hover:border-gold',
          )}
        >
          <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
          {saved ? 'Saved' : 'Wishlist'}
        </button>
        <button
          onClick={share}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm transition-all hover:border-maroon dark:hover:border-gold"
        >
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>

      {/* trust */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border/60 bg-background/40 p-5 text-sm sm:grid-cols-3">
        <div className="flex items-center gap-2.5">
          <Truck className="h-5 w-5 text-maroon dark:text-gold" />
          <div>
            <p className="font-medium">Delivery</p>
            <p className="text-xs text-muted-foreground">
              Est. {estimatedDelivery(product.stock_status === 'made_to_order' ? 21 : 7)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <RefreshCw className="h-5 w-5 text-maroon dark:text-gold" />
          <div>
            <p className="font-medium">7-Day Returns</p>
            <p className="text-xs text-muted-foreground">On ready-to-ship</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-maroon dark:text-gold" />
          <div>
            <p className="font-medium">Authenticity</p>
            <p className="text-xs text-muted-foreground">Pure silk assured</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span
          className={cn(
            'flex h-2.5 w-2.5 rounded-full',
            product.stock_status === 'available'
              ? 'bg-green-500'
              : 'bg-gold',
          )}
        />
        <span className="font-medium">{product.availability}</span>
      </div>
    </div>
  );
}
