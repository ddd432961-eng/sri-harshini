'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Scissors,
  Palette,
  Sparkles,
  Truck,
  ShieldCheck,
  Award,
  Heart,
  Star,
  Quote,
  Calendar,
  Ruler,
  ImageIcon,
} from 'lucide-react';
import type { Product, Collection, BlogPost } from '@/types/database';
import type { Offer, GalleryImage, Faq } from '@/lib/queries';
import { ProductCard } from '@/components/ui/product-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal, RevealStagger, RevealItem } from '@/components/ui/reveal';
import { ProductImage } from '@/components/ui/product-image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatINR } from '@/lib/format';
import { StarRating } from '@/components/ui/star-rating';

type Props = {
  collections: Collection[];
  bestSellers: Product[];
  trending: Product[];
  latest: Product[];
  bridal: Product[];
  products: Product[];
  offers: Offer[];
  posts: BlogPost[];
  gallery: GalleryImage[];
  faqs: Faq[];
};

const REVIEWS = [
  {
    name: 'Priya Reddy',
    role: 'Bride, Hyderabad',
    rating: 5,
    text: 'My bridal Kanjeevaram was beyond my dreams. The zari work is exquisite and the team kept me updated at every step.',
    photo: 'https://images.pexels.com/photos/27575104/pexels-photo-27575104.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
  },
  {
    name: 'Lakshmi Nair',
    role: 'Reception, Chennai',
    rating: 5,
    text: 'The maggam work blouse was a showstopper. Every stone perfectly placed. Truly heirloom quality.',
    photo: 'https://images.pexels.com/photos/9419023/pexels-photo-9419023.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
  },
  {
    name: 'Sowmya Krishnan',
    role: 'Festival, Bangalore',
    rating: 5,
    text: 'Their festival collection is so vibrant. Draping my orange silk for Pongal felt like wearing sunshine.',
    photo: 'https://images.pexels.com/photos/38630997/pexels-photo-38630997.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
  },
];

export function HomeSections(props: Props) {
  const {
    collections,
    bestSellers,
    trending,
    latest,
    bridal,
    products,
    offers,
    posts,
    gallery,
    faqs,
  } = props;

  return (
    <>
      <WhyChooseUs />
      <FeaturedCollections collections={collections} />
      <OffersStrip offers={offers} />
      <ProductRail
        label="Trending Now"
        title="What Brides Are Loving"
        products={trending}
        viewAllHref="/products?sort=rating"
      />
      <BridalShowcase bridal={bridal} />
      <ProductRail
        label="Best Sellers"
        title="Loved by Thousands"
        products={bestSellers}
        viewAllHref="/products"
      />
      <AtelierBanner />
      <CollectionsGrid collections={collections} />
      <ProductRail
        label="Just Arrived"
        title="Latest Arrivals"
        products={latest}
        viewAllHref="/products?sort=newest"
      />
      <LimitedEdition products={products} />
      <TailoringServices />
      <DeliveryAreas />
      <GalleryPreview gallery={gallery} />
      <ReviewsSection />
      <BrandStory />
      <BlogPreview posts={posts} />
      <FaqPreview faqs={faqs} />
      <InstagramFeed />
    </>
  );
}

/* ============ WHY CHOOSE US ============ */
function WhyChooseUs() {
  const items = [
    { Icon: Award, title: '25+ Years', text: 'Of artisanal craft heritage' },
    { Icon: Scissors, title: 'Custom Tailoring', text: 'Made to your measurements' },
    { Icon: Truck, title: 'Free Shipping', text: 'Across South India' },
    { Icon: ShieldCheck, title: 'Pure Silk', text: 'Authenticity guaranteed' },
  ];
  return (
    <section className="container-luxe -mt-16 relative z-10">
      <Reveal>
        <div className="glass-card grid grid-cols-2 gap-4 p-6 shadow-luxe sm:grid-cols-4 sm:p-8">
          {items.map(({ Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-maroon dark:bg-gold/10 dark:text-gold">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-serif text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ============ FEATURED COLLECTIONS ============ */
function FeaturedCollections({ collections }: { collections: Collection[] }) {
  const featured = collections.slice(0, 4);
  return (
    <section className="container-luxe py-20">
      <Reveal>
        <SectionHeading
          label="Curated Edits"
          title="Featured Collections"
          subtitle="Each collection is a love letter to South Indian craft — woven, embroidered and finished by hand."
        />
      </Reveal>
      <RevealStagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((c) => (
          <RevealItem key={c.id}>
            <Link
              href={`/collections/${c.slug}`}
              className="group relative block overflow-hidden rounded-2xl"
            >
              <ProductImage
                src={c.image_url}
                alt={c.name}
                aspect="aspect-[3/4]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/85 via-maroon-deep/20 to-transparent transition-opacity duration-500 group-hover:from-maroon-deep/90" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-light">
                  Collection
                </p>
                <h3 className="mt-1 font-display text-xl">{c.name}</h3>
                <p className="mt-1 line-clamp-1 text-xs text-cream/70">
                  {c.tagline}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gold-light opacity-0 transition-all duration-300 group-hover:opacity-100">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}

/* ============ OFFERS ============ */
function OffersStrip({ offers }: { offers: Offer[] }) {
  if (offers.length === 0) return null;
  return (
    <section className="container-luxe pb-4">
      <Reveal>
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-gradient-to-r from-maroon-deep to-maroon p-5 text-cream shadow-luxe">
          <Sparkles className="h-5 w-5 shrink-0 text-gold" />
          <div className="flex flex-1 flex-wrap gap-x-6 gap-y-1 text-sm">
            {offers.map((o) => (
              <span key={o.id} className="flex items-center gap-2">
                <strong className="text-gold-light">{o.title}</strong>
                {o.coupon_code && (
                  <code className="rounded bg-cream/15 px-2 py-0.5 text-xs">
                    {o.coupon_code}
                  </code>
                )}
              </span>
            ))}
          </div>
          <Link
            href="/products"
            className="rounded-full bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-wider text-maroon-deep transition hover:brightness-110"
          >
            Shop Now
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ============ PRODUCT RAIL ============ */
function ProductRail({
  label,
  title,
  products,
  viewAllHref,
}: {
  label: string;
  title: string;
  products: Product[];
  viewAllHref: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="container-luxe py-16">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label={label}
            title={title}
            align="left"
          />
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-maroon transition-colors hover:text-gold dark:text-gold"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
      <RevealStagger className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 4).map((p) => (
          <RevealItem key={p.id}>
            <ProductCard product={p} />
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}

/* ============ BRIDAL SHOWCASE ============ */
function BridalShowcase({ bridal }: { bridal: Product[] }) {
  if (bridal.length === 0) return null;
  const hero = bridal[0];
  return (
    <section className="relative overflow-hidden bg-maroon-deep py-24 text-cream">
      <div
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
        aria-hidden
      />
      <div className="container-luxe grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <ProductImage
              src={hero.images[0]}
              alt={hero.name}
              aspect="aspect-[4/5]"
              priority
            />
            <div className="absolute -bottom-6 -left-6 glass-card hidden p-5 shadow-luxe-lg sm:block">
              <p className="text-xs uppercase tracking-wider text-gold-deep">
                Signature Bridal
              </p>
              <p className="mt-1 font-serif text-lg text-foreground">
                {hero.name}
              </p>
              <p className="mt-1 font-serif text-lg font-semibold text-maroon">
                {formatINR(hero.price)}
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div>
            <span className="section-label text-gold">The Bridal Edit</span>
            <h2 className="mt-4 font-display text-3xl text-cream sm:text-4xl lg:text-5xl">
              For the bride who carries tradition
            </h2>
            <div className="mt-5 h-px w-24 bg-gradient-to-r from-gold to-transparent" />
            <p className="mt-5 max-w-md text-cream/75">
              Handwoven Kanjeevaram silks, maggam masterpieces and zardozi
              lehengas — each piece crafted over weeks by our master karigars,
              made to make your day unforgettable.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/collections/bridal" className="btn-gold">
                Shop Bridal
              </Link>
              <Link
                href="/appointments"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/40 px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-cream transition-all hover:border-gold hover:bg-gold hover:text-maroon-deep"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ ATELIER BANNER ============ */
function AtelierBanner() {
  return (
    <section className="container-luxe py-20">
      <Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href="/tailoring"
            className="group relative overflow-hidden rounded-2xl"
          >
            <ProductImage
              src="https://images.pexels.com/photos/28943543/pexels-photo-28943543.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Tailoring"
              aspect="aspect-[16/10]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/80 to-transparent" />
            <div className="absolute bottom-0 p-6 text-cream">
              <Scissors className="mb-2 h-6 w-6 text-gold" />
              <h3 className="font-display text-2xl">Tailoring Atelier</h3>
              <p className="mt-1 text-sm text-cream/75">
                Custom stitched to your measurements in 21 days
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gold-light">
                Book Tailoring <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
          <Link
            href="/custom-design"
            className="group relative overflow-hidden rounded-2xl"
          >
            <ProductImage
              src="https://images.pexels.com/photos/38391089/pexels-photo-38391089.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Custom Design"
              aspect="aspect-[16/10]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/80 to-transparent" />
            <div className="absolute bottom-0 p-6 text-cream">
              <Palette className="mb-2 h-6 w-6 text-gold" />
              <h3 className="font-display text-2xl">Custom Design</h3>
              <p className="mt-1 text-sm text-cream/75">
                Bring your dream piece — we will craft it
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gold-light">
                Start Design <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ============ COLLECTIONS GRID ============ */
function CollectionsGrid({ collections }: { collections: Collection[] }) {
  const rest = collections.slice(4, 10);
  if (rest.length === 0) return null;
  return (
    <section className="container-luxe py-16">
      <Reveal>
        <SectionHeading
          label="Explore More"
          title="Shop by Collection"
          subtitle="From temple weaves to party glamour — find your moment."
        />
      </Reveal>
      <RevealStagger className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {rest.map((c) => (
          <RevealItem key={c.id}>
            <Link
              href={`/collections/${c.slug}`}
              className="group relative block overflow-hidden rounded-xl"
            >
              <ProductImage src={c.image_url} alt={c.name} aspect="aspect-square" />
              <div className="absolute inset-0 bg-maroon-deep/30 transition-opacity group-hover:bg-maroon-deep/50" />
              <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                <span className="font-display text-lg text-cream drop-shadow-lg transition-transform group-hover:scale-105">
                  {c.name}
                </span>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}

/* ============ LIMITED EDITION ============ */
function LimitedEdition({ products }: { products: Product[] }) {
  const limited = products.filter((p) => p.limited_edition).slice(0, 2);
  if (limited.length === 0) return null;
  return (
    <section className="container-luxe py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-maroon to-maroon-deep p-8 text-cream sm:p-12">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold-light">
                <Sparkles className="h-3.5 w-3.5" /> Limited Edition
              </span>
              <h2 className="mt-5 font-display text-3xl sm:text-4xl">
                Numbered couture, made for a few
              </h2>
              <p className="mt-4 max-w-md text-cream/75">
                Each season we release a small batch of numbered couture pieces.
                Once they are gone, they are gone forever.
              </p>
              <Link
                href="/collections/limited-edition"
                className="btn-gold mt-7"
              >
                Discover the Collection
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {limited.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group overflow-hidden rounded-xl"
                >
                  <ProductImage src={p.images[0]} alt={p.name} aspect="aspect-[3/4]" />
                  <p className="mt-2 line-clamp-1 text-sm text-cream/85">
                    {p.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ============ TAILORING SERVICES ============ */
function TailoringServices() {
  const services = [
    {
      Icon: Ruler,
      title: 'Measurement Booking',
      text: 'Visit our atelier or request a home measurement visit.',
      href: '/tailoring',
    },
    {
      Icon: Palette,
      title: 'Custom Design',
      text: 'Upload inspiration and describe your dream piece.',
      href: '/custom-design',
    },
    {
      Icon: Calendar,
      title: 'Boutique Appointment',
      text: 'Book a private bridal trial with our stylists.',
      href: '/appointments',
    },
  ];
  return (
    <section className="container-luxe py-16">
      <Reveal>
        <SectionHeading
          label="The Atelier"
          title="Tailoring & Custom Services"
          subtitle="Every bride deserves a piece made just for her. Our atelier is at your service."
        />
      </Reveal>
      <RevealStagger className="mt-12 grid gap-5 md:grid-cols-3">
        {services.map(({ Icon, title, text, href }) => (
          <RevealItem key={title}>
            <Link
              href={href}
              className="group glass-card flex h-full flex-col items-start gap-3 p-7 transition-all hover:shadow-luxe"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-maroon/10 text-maroon transition-all group-hover:bg-maroon group-hover:text-cream dark:bg-gold/10 dark:text-gold dark:group-hover:bg-gold dark:group-hover:text-maroon-deep">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs font-medium uppercase tracking-wider text-maroon dark:text-gold">
                Learn More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}

/* ============ DELIVERY AREAS ============ */
function DeliveryAreas() {
  const areas = ['Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Karnataka'];
  return (
    <section className="container-luxe py-12">
      <Reveal>
        <div className="glass-card flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-4">
            <Truck className="h-10 w-10 text-maroon dark:text-gold" />
            <div>
              <h3 className="font-serif text-xl">We Deliver Across South India</h3>
              <p className="text-sm text-muted-foreground">
                Free shipping on orders above ₹5,000
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {areas.map((a) => (
              <span
                key={a}
                className="rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ============ GALLERY PREVIEW ============ */
function GalleryPreview({ gallery }: { gallery: GalleryImage[] }) {
  if (gallery.length === 0) return null;
  return (
    <section className="container-luxe py-16">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Pinterest Gallery"
            title="Moments in Silk"
            align="left"
          />
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-maroon dark:text-gold"
          >
            Full Gallery <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
      <RevealStagger className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {gallery.map((g, i) => (
          <RevealItem
            key={g.id}
            className={i === 0 || i === 5 ? 'sm:col-span-2 sm:row-span-2' : ''}
          >
            <Link
              href="/gallery"
              className="group relative block h-full overflow-hidden rounded-xl"
            >
              <ProductImage
                src={g.image_url}
                alt={g.title ?? 'Gallery'}
                aspect={i === 0 || i === 5 ? 'aspect-square' : 'aspect-square'}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-maroon-deep/0 transition-colors group-hover:bg-maroon-deep/40">
                <ImageIcon className="h-6 w-6 text-cream opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}

/* ============ REVIEWS ============ */
function ReviewsSection() {
  return (
    <section className="bg-beige/40 py-20 dark:bg-maroon-soft/20">
      <div className="container-luxe">
        <Reveal>
          <SectionHeading
            label="Loved by Brides"
            title="Customer Stories"
            subtitle="Real moments from women who chose Sri Harshini for their special day."
          />
        </Reveal>
        <RevealStagger className="mt-12 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <RevealItem key={r.name}>
              <div className="glass-card flex h-full flex-col gap-4 p-7">
                <Quote className="h-8 w-8 text-gold" />
                <StarRating rating={r.rating} size={16} />
                <p className="flex-1 text-sm leading-relaxed text-foreground/85">
                  “{r.text}”
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={r.photo}
                    alt={r.name}
                    className="h-11 w-11 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.role}</p>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
        <Reveal delay={0.2}>
          <div className="mt-10 text-center">
            <Link href="/reviews" className="btn-outline-luxe">
              Read All Reviews
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ BRAND STORY ============ */
function BrandStory() {
  return (
    <section className="container-luxe py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <ProductImage
              src="https://images.pexels.com/photos/9153073/pexels-photo-9153073.jpeg?auto=compress&cs=tinysrgb&w=1000"
              alt="Our story"
              aspect="aspect-[4/5]"
            />
            <div className="absolute -right-6 -top-6 flex h-24 w-24 items-center justify-center rounded-full bg-gold font-display text-2xl font-semibold text-maroon-deep shadow-gold">
              Since
              <br />
              1998
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div>
            <span className="section-label">Our Story</span>
            <h2 className="mt-4 heading-luxe">
              A legacy woven over generations
            </h2>
            <div className="divider-gold my-6 !mx-0" />
            <p className="text-base leading-relaxed text-muted-foreground">
              Sri Harshini Boutique began as a small weaving studio in
              Hyderabad in 1998, with a single loom and a singular obsession —
              to preserve the craft of South Indian silk weaving and maggam
              embroidery. Today, our atelier is home to over 40 master karigars,
              and our pieces are worn by brides across the world.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Every saree tells a story. Every blouse holds a piece of the
              artisan who made it. This is tradition, woven with elegance.
            </p>
            <Link href="/about" className="btn-luxe mt-8">
              Read Our Story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ BLOG PREVIEW ============ */
function BlogPreview({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="container-luxe py-16">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading label="Journal" title="From the Blog" align="left" />
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-maroon dark:text-gold"
          >
            All Articles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
      <RevealStagger className="mt-10 grid gap-5 md:grid-cols-3">
        {posts.map((p) => (
          <RevealItem key={p.id}>
            <Link
              href={`/blog/${p.slug}`}
              className="group glass-card flex h-full flex-col overflow-hidden"
            >
              <ProductImage src={p.cover_url} alt={p.title} aspect="aspect-[16/10]" />
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-deep dark:text-gold">
                  {p.category} · {p.read_time} min read
                </span>
                <h3 className="font-serif text-lg font-medium transition-colors group-hover:text-maroon dark:group-hover:text-gold">
                  {p.title}
                </h3>
                <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
                  {p.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-maroon dark:text-gold">
                  Read More <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}

/* ============ FAQ PREVIEW ============ */
function FaqPreview({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  return (
    <section className="container-luxe py-16">
      <Reveal>
        <SectionHeading
          label="Good to Know"
          title="Frequently Asked Questions"
        />
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mx-auto mt-10 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.id}
                value={`item-${i}`}
                className="glass-card border-0 px-5"
              >
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-8 text-center">
            <Link href="/faq" className="btn-outline-luxe">
              View All FAQs
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ============ INSTAGRAM FEED ============ */
function InstagramFeed() {
  const images = [
    'https://images.pexels.com/photos/12959396/pexels-photo-12959396.jpeg?auto=compress&cs=tinysrgb&h=400',
    'https://images.pexels.com/photos/28943543/pexels-photo-28943543.jpeg?auto=compress&cs=tinysrgb&h=400',
    'https://images.pexels.com/photos/16239658/pexels-photo-16239658.jpeg?auto=compress&cs=tinysrgb&h=400',
    'https://images.pexels.com/photos/38391089/pexels-photo-38391089.jpeg?auto=compress&cs=tinysrgb&h=400',
    'https://images.pexels.com/photos/27575104/pexels-photo-27575104.jpeg?auto=compress&cs=tinysrgb&h=400',
    'https://images.pexels.com/photos/35108765/pexels-photo-35108765.jpeg?auto=compress&cs=tinysrgb&h=400',
  ];
  return (
    <section className="container-luxe py-16">
      <Reveal>
        <SectionHeading
          label="@sriharshini.boutique"
          title="Follow Our Journey"
          subtitle="Tag us in your Sri Harshini moments to be featured."
        />
      </Reveal>
      <RevealStagger className="mt-10 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {images.map((src, i) => (
          <RevealItem key={i}>
            <a
              href="#"
              className="group relative block aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={src}
                alt="Instagram post"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-maroon-deep/0 transition-colors group-hover:bg-maroon-deep/50">
                <Heart className="h-6 w-6 text-cream opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </a>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}
