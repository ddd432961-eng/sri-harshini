import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllCollectionSlugs, getCollection, getProductsByCollection } from '@/lib/queries';
import { PageHeader } from '@/components/layout/page-header';
import { ProductCard } from '@/components/ui/product-card';
import { Reveal, RevealStagger, RevealItem } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { JsonLd } from '@/components/seo/json-ld';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await getAllCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = await getCollection(params.slug);
  if (!collection) return { title: 'Collection Not Found' };
  return {
    title: `${collection.name} Collection`,
    description: collection.description ?? collection.tagline ?? `Explore the ${collection.name} collection at Sri Harshini Boutique.`,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: `${collection.name} — Sri Harshini Boutique`,
      description: collection.tagline ?? '',
      images: [collection.image_url],
    },
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const collection = await getCollection(params.slug);
  if (!collection) notFound();
  const products = await getProductsByCollection(params.slug);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${collection.name} Collection`,
          description: collection.description ?? collection.tagline,
          image: collection.image_url,
        }}
      />
      <PageHeader
        label="Collection"
        title={collection.name}
        subtitle={collection.description ?? collection.tagline ?? undefined}
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Collections', href: '/collections' },
          { label: collection.name },
        ]}
        image={collection.cover_url ?? collection.image_url}
      />

      <div className="container-luxe py-16">
        {products.length > 0 ? (
          <>
            <Reveal>
              <SectionHeading
                label={`${products.length} Pieces`}
                title="Shop This Collection"
                align="left"
              />
            </Reveal>
            <RevealStagger className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <RevealItem key={p.id}>
                  <ProductCard product={p} />
                </RevealItem>
              ))}
            </RevealStagger>
          </>
        ) : (
          <div className="glass-card flex flex-col items-center gap-4 py-20 text-center">
            <p className="font-serif text-lg">New collection coming soon</p>
            <p className="text-sm text-muted-foreground">
              We are crafting something special. Check back shortly.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
