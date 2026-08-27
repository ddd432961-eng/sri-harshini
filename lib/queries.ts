import { createReadClient } from '@/lib/supabase/server';
import type { Product, Collection, BlogPost, Review } from '@/types/database';

export type HeroBanner = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  video_url: string | null;
  primary_cta_label: string | null;
  primary_cta_link: string | null;
  secondary_cta_label: string | null;
  secondary_cta_link: string | null;
  sort_order: number;
  active: boolean;
};
export type Offer = {
  id: string;
  title: string;
  description: string | null;
  coupon_code: string | null;
  discount_type: string;
  discount_value: number;
  min_order: number | null;
  ends_at: string | null;
  active: boolean;
};
export type GalleryImage = {
  id: string;
  title: string | null;
  image_url: string;
  category: string;
  width: number | null;
  height: number | null;
};
export type VideoItem = {
  id: string;
  title: string;
  category: string;
  video_url: string;
  thumbnail_url: string | null;
  duration: string | null;
};
export type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
};
export type SiteSettings = Record<string, any>;

/* ============ COLLECTIONS ============ */

export async function getCollections(): Promise<Collection[]> {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('collections')
    .select('*')
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getFeaturedCollections(): Promise<Collection[]> {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('collections')
    .select('*')
    .eq('featured', true)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getCollection(slug: string): Promise<Collection | null> {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  return data;
}

export async function getAllCollectionSlugs(): Promise<string[]> {
  const supabase = createReadClient();
  const { data } = await supabase.from('collections').select('slug');
  return (data ?? []).map((r) => r.slug);
}

/* ============ PRODUCTS ============ */

export async function getAllProductSlugs(): Promise<string[]> {
  const supabase = createReadClient();
  const { data } = await supabase.from('products').select('slug');
  return (data ?? []).map((r) => r.slug);
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('products')
    .select('*, collection:collections(*)')
    .order('sort_order', { ascending: true });
  return (data ?? []) as Product[];
}

export async function getProductsByCollection(slug: string): Promise<Product[]> {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('products')
    .select('*, collection:collections(*)')
    .eq('collection.slug', slug)
    .order('sort_order', { ascending: true });
  return (data ?? []) as Product[];
}

export async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('products')
    .select('*, collection:collections(*)')
    .eq('slug', slug)
    .maybeSingle();
  return data as Product | null;
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .neq('id', product.id)
    .or(`collection_id.eq.${product.collection_id ?? ''}`)
    .order('rating', { ascending: false })
    .limit(limit);
  return (data ?? []) as Product[];
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('helpful_votes', { ascending: false });
  return data ?? [];
}

export async function getAllReviews() {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('reviews')
    .select('*, product:products(name,slug,images)')
    .order('created_at', { ascending: false });
  return data ?? [];
}

/* ============ BLOG ============ */

export async function getAllBlogSlugs(): Promise<string[]> {
  const supabase = createReadClient();
  const { data } = await supabase.from('blog_posts').select('slug');
  return (data ?? []).map((r) => r.slug);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });
  return data ?? [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  return data;
}

/* ============ CMS CONTENT ============ */

export async function getHeroBanners(): Promise<HeroBanner[]> {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('hero_banners')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getOffers(): Promise<Offer[]> {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('offers')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('gallery_images')
    .select('*')
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getVideos(): Promise<VideoItem[]> {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('videos')
    .select('*')
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getFaqs(): Promise<Faq[]> {
  const supabase = createReadClient();
  const { data } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createReadClient();
  const { data } = await supabase.from('site_settings').select('key,value');
  const out: SiteSettings = {};
  for (const row of data ?? []) out[row.key] = row.value;
  return out;
}
