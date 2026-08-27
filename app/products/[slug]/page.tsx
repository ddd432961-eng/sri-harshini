import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProduct, getRelatedProducts, getProductReviews } from '@/lib/queries';
import { ProductGallery } from '@/components/products/product-gallery';
import { ProductPurchase } from '@/components/products/product-purchase';
import { ProductCard } from '@/components/ui/product-card';
import { PageHeader } from '@/components/layout/page-header';
import { Reveal, RevealStagger, RevealItem } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { JsonLd } from '@/components/seo/json-ld';
import { formatINR } from '@/lib/format';
import { StarRating } from '@/components/ui/star-rating';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Check } from 'lucide-react';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.short_description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: [product.images[0]],
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();
  const [related, reviews] = await Promise.all([
    getRelatedProducts(product, 4),
    getProductReviews(product.id),
  ]);

  const details = [
    { label: 'Fabric', value: product.fabric },
    { label: 'Thread', value: product.thread },
    { label: 'Stone Work', value: product.stone_work },
    { label: 'Occasion', value: product.occasion },
  ].filter((d) => d.value);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.short_description,
          image: product.images,
          sku: product.slug,
          brand: { '@type': 'Brand', name: 'Sri Harshini Boutique' },
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'INR',
            availability:
              product.stock_status === 'available'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/PreOrder',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.review_count,
          },
        }}
      />

      <div className="container-luxe py-8 lg:py-12">
        {/* breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <a href="/" className="hover:text-maroon dark:hover:text-gold">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-maroon dark:hover:text-gold">Products</a>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <ProductGallery
              images={product.images}
              videoUrl={product.video_url}
              name={product.name}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ProductPurchase product={product} />
          </Reveal>
        </div>

        {/* tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="flex h-auto flex-wrap justify-start gap-1 rounded-full bg-muted/50 p-1.5">
              {[
                'description',
                'details',
                'materials',
                'care',
                'reviews',
              ].map((t) => (
                <TabsTrigger
                  key={t}
                  value={t}
                  className="rounded-full px-5 py-2.5 text-sm font-medium capitalize data-[state=active]:bg-maroon data-[state=active]:text-cream dark:data-[state=active]:bg-gold dark:data-[state=active]:text-maroon-deep"
                >
                  {t === 'reviews' ? `Reviews (${reviews.length})` : t}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="description" className="mt-8 max-w-3xl text-base leading-relaxed text-foreground/80">
              <p className="whitespace-pre-line">{product.description}</p>
            </TabsContent>

            <TabsContent value="details" className="mt-8 max-w-2xl">
              <ul className="divide-y divide-border rounded-2xl border border-border">
                {details.map((d) => (
                  <li key={d.label} className="flex justify-between px-5 py-3.5 text-sm">
                    <span className="font-medium text-foreground/70">{d.label}</span>
                    <span className="text-foreground">{d.value}</span>
                  </li>
                ))}
                <li className="flex justify-between px-5 py-3.5 text-sm">
                  <span className="font-medium text-foreground/70">Colors</span>
                  <span className="text-foreground">{product.colors.join(', ')}</span>
                </li>
                <li className="flex justify-between px-5 py-3.5 text-sm">
                  <span className="font-medium text-foreground/70">Sizes</span>
                  <span className="text-foreground">{product.sizes.join(', ')}</span>
                </li>
              </ul>
            </TabsContent>

            <TabsContent value="materials" className="mt-8 max-w-3xl">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { t: 'Fabric', v: product.fabric },
                  { t: 'Thread Work', v: product.thread },
                  { t: 'Stone Work', v: product.stone_work },
                  { t: 'Customization', v: 'Available — stitched to your measurements' },
                ].map((m) => (
                  <div key={m.t} className="glass-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold-deep dark:text-gold">
                      {m.t}
                    </p>
                    <p className="mt-1.5 text-sm text-foreground">{m.v ?? '—'}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="care" className="mt-8 max-w-3xl text-sm leading-relaxed text-foreground/80">
              <ul className="space-y-3">
                {[
                  'Dry clean only — do not hand or machine wash.',
                  'Store folded in a muslin cloth, refold every few months.',
                  'Avoid direct sunlight and do not spray perfume directly on silk.',
                  'For zari and maggam work, wrap in soft cotton to prevent oxidation.',
                  'Pin sarees carefully without piercing the zari border.',
                ].map((c) => (
                  <li key={c} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-maroon dark:text-gold" />
                    {c}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8 max-w-3xl">
              {reviews.length > 0 ? (
                <div className="space-y-5">
                  {reviews.map((r) => (
                    <div key={r.id} className="glass-card p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon/10 font-semibold text-maroon dark:bg-gold/10 dark:text-gold">
                            {r.author_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{r.author_name}</p>
                            {r.verified && (
                              <span className="text-xs text-green-600">Verified Purchase</span>
                            )}
                          </div>
                        </div>
                        <StarRating rating={r.rating} size={14} />
                      </div>
                      <h4 className="mt-4 font-medium">{r.title}</h4>
                      <p className="mt-1 text-sm text-foreground/80">{r.body}</p>
                      {r.photo_url && (
                        <img
                          src={r.photo_url}
                          alt={r.title}
                          className="mt-3 h-32 w-32 rounded-lg object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-10 text-center">
                  <p className="font-serif text-lg">No reviews yet</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Be the first to share your experience.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* size guide */}
        <div id="size-guide" className="mt-16 max-w-2xl scroll-mt-28">
          <SectionHeading label="Fit" title="Size Guide" align="left" />
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Size</th>
                  <th className="px-4 py-3 text-left font-medium">Bust (in)</th>
                  <th className="px-4 py-3 text-left font-medium">Waist (in)</th>
                  <th className="px-4 py-3 text-left font-medium">Hip (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['XS', 32, 26, 34],
                  ['S', 34, 28, 36],
                  ['M', 36, 30, 38],
                  ['L', 38, 32, 40],
                  ['XL', 40, 34, 42],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i} className="px-4 py-3">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* related */}
        {related.length > 0 && (
          <div className="mt-20">
            <Reveal>
              <SectionHeading label="You May Also Like" title="Related Products" />
            </Reveal>
            <RevealStagger className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
              {related.map((p) => (
                <RevealItem key={p.id}>
                  <ProductCard product={p} />
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        )}
      </div>
    </>
  );
}
