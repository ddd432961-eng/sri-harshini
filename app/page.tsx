import { HeroSlider } from '@/components/home/hero-slider';
import { HomeSections } from '@/components/home/home-sections';
import {
  getHeroBanners,
  getFeaturedCollections,
  getProducts,
  getOffers,
  getBlogPosts,
  getGalleryImages,
  getFaqs,
} from '@/lib/queries';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Sri Harshini Boutique — Tradition Woven with Elegance',
  description:
    'Luxury South Indian boutique specialising in bridal Kanjeevaram silk sarees, maggam work blouses, designer lehengas and hand-embroidered couture. Crafted in Hyderabad since 1998.',
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const [banners, collections, products, offers, posts, gallery, faqs] =
    await Promise.all([
      getHeroBanners(),
      getFeaturedCollections(),
      getProducts(),
      getOffers(),
      getBlogPosts(),
      getGalleryImages(),
      getFaqs(),
    ]);

  const bestSellers = products.filter((p) => p.best_seller).slice(0, 8);
  const trending = products.filter((p) => p.trending).slice(0, 8);
  const latest = products.filter((p) => p.latest).slice(0, 8);
  const bridal = products.filter((p) =>
    p.tags?.some((t) => ['bridal', 'wedding'].includes(t)),
  );

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: 'Sri Harshini Boutique',
          description:
            'Luxury South Indian boutique — bridal silk sarees, maggam work and couture.',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Hyderabad',
            addressRegion: 'Telangana',
            addressCountry: 'IN',
          },
        }}
      />
      <HeroSlider banners={banners} />
      <HomeSections
        collections={collections}
        bestSellers={bestSellers}
        trending={trending}
        latest={latest}
        bridal={bridal}
        products={products}
        offers={offers}
        posts={posts.slice(0, 3)}
        gallery={gallery.slice(0, 8)}
        faqs={faqs.slice(0, 6)}
      />
    </>
  );
}
