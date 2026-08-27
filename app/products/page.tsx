'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Search, Check } from 'lucide-react';
import { useProducts, useCollections } from '@/hooks/use-data';
import type { Product } from '@/types/database';
import { ProductCard } from '@/components/ui/product-card';
import { PageHeader } from '@/components/layout/page-header';
import { RevealStagger, RevealItem } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const SORTS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
];

const COLOR_OPTIONS = [
  'Maroon', 'Red', 'Gold', 'Green', 'Blue', 'Pink', 'Cream', 'Black', 'Orange', 'Teal',
];
const OCCASION_OPTIONS = ['Bridal', 'Wedding', 'Reception', 'Festival', 'Party', 'Temple', 'Engagement', 'Cocktail'];
const FABRIC_OPTIONS = ['Pure Kanjeevaram Silk', 'Mysore Silk', 'Art Silk', 'Georgette', 'Raw Silk', 'Crepe', 'Satin', 'Silk Cotton'];

export default function ProductsPage() {
  const search = useSearchParams();
  const initialQ = search.get('q') ?? '';
  const [q, setQ] = useState(initialQ);
  const [sort, setSort] = useState('featured');
  const [colors, setColors] = useState<string[]>([]);
  const [occasions, setOccasions] = useState<string[]>([]);
  const [fabrics, setFabrics] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);

  const { data: collections } = useCollections();
  const collectionParam = search.get('collection') ?? 'all';

  const filters = {
    collection: collectionParam,
    search: q,
    sort,
    colors,
    occasions,
    fabrics,
    maxPrice,
    inStockOnly,
  };
  const { data: products, isLoading } = useProducts(filters);

  const toggle = (
    arr: string[],
    setArr: (v: string[]) => void,
    val: string,
  ) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const activeCount =
    colors.length + occasions.length + fabrics.length + (inStockOnly ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-7">
      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              onClick={() => toggle(colors, setColors, c)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs transition-all',
                colors.includes(c)
                  ? 'border-maroon bg-maroon text-cream dark:border-gold dark:bg-gold dark:text-maroon-deep'
                  : 'border-border hover:border-maroon dark:hover:border-gold',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Occasion">
        <div className="space-y-2">
          {OCCASION_OPTIONS.map((o) => (
            <label key={o} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <button
                onClick={() => toggle(occasions, setOccasions, o)}
                className={cn(
                  'flex h-4 w-4 items-center justify-center rounded border transition-all',
                  occasions.includes(o)
                    ? 'border-maroon bg-maroon text-cream dark:border-gold dark:bg-gold'
                    : 'border-border',
                )}
              >
                {occasions.includes(o) && <Check className="h-3 w-3" />}
              </button>
              {o}
            </label>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Fabric">
        <div className="space-y-2">
          {FABRIC_OPTIONS.map((f) => (
            <label key={f} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <button
                onClick={() => toggle(fabrics, setFabrics, f)}
                className={cn(
                  'flex h-4 w-4 items-center justify-center rounded border transition-all',
                  fabrics.includes(f)
                    ? 'border-maroon bg-maroon text-cream dark:border-gold dark:bg-gold'
                    : 'border-border',
                )}
              >
                {fabrics.includes(f) && <Check className="h-3 w-3" />}
              </button>
              {f}
            </label>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title={`Price: up to ₹${maxPrice.toLocaleString('en-IN')}`}>
        <input
          type="range"
          min={5000}
          max={100000}
          step={5000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-maroon dark:accent-gold"
        />
      </FilterGroup>
      <FilterGroup title="Availability">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <button
            onClick={() => setInStockOnly((v) => !v)}
            className={cn(
              'flex h-4 w-4 items-center justify-center rounded border transition-all',
              inStockOnly
                ? 'border-maroon bg-maroon text-cream dark:border-gold dark:bg-gold'
                : 'border-border',
            )}
          >
            {inStockOnly && <Check className="h-3 w-3" />}
          </button>
          In stock only
        </label>
      </FilterGroup>
      {activeCount > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setColors([]);
            setOccasions([]);
            setFabrics([]);
            setInStockOnly(false);
            setMaxPrice(100000);
          }}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      <PageHeader
        label="Boutique"
        title="All Products"
        subtitle="Explore our complete collection of handwoven silks, maggam masterpieces and couture."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Products' }]}
        image="https://images.pexels.com/photos/35108765/pexels-photo-35108765.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      <div className="container-luxe py-12">
        {/* toolbar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            <Sheet open={mobileFilters} onOpenChange={setMobileFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                  {activeCount > 0 && (
                    <span className="ml-1 rounded-full bg-maroon px-1.5 text-xs text-cream">
                      {activeCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:border-maroon focus:outline-none dark:focus:border-gold"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-maroon dark:text-gold" />
                <h2 className="font-serif text-lg font-semibold">Filters</h2>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* grid */}
          <div>
            <p className="mb-6 text-sm text-muted-foreground">
              {isLoading
                ? 'Loading…'
                : `${products?.length ?? 0} product${(products?.length ?? 0) === 1 ? '' : 's'}`}
            </p>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] animate-shimmer rounded-2xl shimmer-bg"
                  />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <RevealStagger className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
                {products.map((p: Product) => (
                  <RevealItem key={p.id}>
                    <ProductCard product={p} />
                  </RevealItem>
                ))}
              </RevealStagger>
            ) : (
              <div className="glass-card flex flex-col items-center gap-4 py-20 text-center">
                <X className="h-10 w-10 text-muted-foreground" />
                <p className="font-serif text-lg">No products found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70">
        {title}
      </h3>
      {children}
    </div>
  );
}
