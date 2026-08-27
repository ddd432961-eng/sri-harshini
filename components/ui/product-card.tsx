'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types/database';
import { formatINR, discountPercent, estimatedDelivery } from '@/lib/format';
import { useStore } from '@/components/providers/store-provider';
import { ProductImage } from '@/components/ui/product-image';
import { StarRating } from '@/components/ui/star-rating';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const saved = inWishlist(product.id);
  const discount = discountPercent(product.price, product.compare_at_price);
  const img = product.images?.[0] ?? '';

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: img,
      size: product.sizes?.[0] ?? 'Free Size',
      color: product.colors?.[0] ?? '',
      quantity: 1,
    });
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="glass-card relative h-full overflow-hidden p-0"
      >
        {/* image */}
        <div className="relative overflow-hidden">
          <ProductImage
            src={img}
            alt={product.name}
            aspect="aspect-[3/4]"
          />
          {product.images?.[1] && (
            <img
              src={product.images[1]}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}

          {/* badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {discount && (
              <span className="rounded-full bg-maroon px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cream shadow">
                -{discount}%
              </span>
            )}
            {product.limited_edition && (
              <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-maroon-deep shadow">
                Limited
              </span>
            )}
            {product.best_seller && (
              <span className="rounded-full bg-maroon-deep px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold shadow">
                Bestseller
              </span>
            )}
            {product.latest && !product.best_seller && (
              <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-background shadow">
                New
              </span>
            )}
          </div>

          {/* wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id, product.name);
            }}
            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
            className={cn(
              'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all',
              saved
                ? 'bg-maroon text-cream'
                : 'bg-white/70 text-maroon hover:bg-maroon hover:text-cream dark:bg-card/70',
            )}
          >
            <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
          </button>

          {/* quick actions */}
          <div className="absolute inset-x-3 bottom-3 flex translate-y-4 gap-2 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={quickAdd}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-maroon-deep/90 py-2.5 text-xs font-semibold uppercase tracking-wider text-cream backdrop-blur-md transition-colors hover:bg-maroon"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> Add
            </button>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-maroon backdrop-blur-md dark:bg-card/80">
              <Eye className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* body */}
        <div className="space-y-1.5 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-deep dark:text-gold">
            {product.fabric ?? 'Silk'}
          </p>
          <h3 className="line-clamp-1 font-serif text-base font-medium text-foreground transition-colors group-hover:text-maroon dark:group-hover:text-gold">
            {product.name}
          </h3>
          <StarRating rating={product.rating} size={13} showValue count={product.review_count} />
          <div className="flex items-center gap-2 pt-1">
            <span className="font-serif text-lg font-semibold text-maroon dark:text-gold">
              {formatINR(product.price)}
            </span>
            {product.compare_at_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatINR(product.compare_at_price)}
              </span>
            )}
          </div>
          <p className="flex items-center gap-1.5 pt-0.5 text-[11px] text-muted-foreground">
            <span className={cn(
              'h-1.5 w-1.5 rounded-full',
              product.stock_status === 'available' ? 'bg-green-500' : 'bg-gold',
            )} />
            {product.availability} · Est. delivery {estimatedDelivery(product.stock_status === 'made_to_order' ? 21 : 7)}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

// kept for potential toast import elsewhere
export { toast };
