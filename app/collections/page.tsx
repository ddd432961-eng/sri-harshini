import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollections } from '@/lib/queries';
import { PageHeader } from '@/components/layout/page-header';
import { Reveal, RevealStagger, RevealItem } from '@/components/ui/reveal';
import { ProductImage } from '@/components/ui/product-image';
import { JsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Collections — Bridal, Wedding, Festival, Designer & More',
  description:
    'Browse all Sri Harshini collections — bridal Kanjeevaram silk, wedding lehengas, festival sarees, designer couture, kids wear, maggam work and limited edition pieces.',
  alternates: { canonical: '/collections' },
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Collections',
          description:
            'Browse all Sri Harshini boutique collections.',
        }}
      />
      <PageHeader
        label="Curated Edits"
        title="Our Collections"
        subtitle="Each collection is a love letter to South Indian craft — woven, embroidered and finished by hand."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Collections' }]}
        image="https://images.pexels.com/photos/35108765/pexels-photo-35108765.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      <div className="container-luxe py-16">
        <RevealStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <RevealItem key={c.id}>
              <Link
                href={`/collections/${c.slug}`}
                className="group relative block overflow-hidden rounded-2xl"
              >
                <ProductImage src={c.image_url} alt={c.name} aspect="aspect-[4/5]" />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/90 via-maroon-deep/20 to-transparent transition-opacity duration-500 group-hover:from-maroon-deep" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-light">
                    Collection
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl">{c.name}</h3>
                  {c.tagline && (
                    <p className="mt-1 text-sm text-cream/70">{c.tagline}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gold-light opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Explore Collection
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </>
  );
}
