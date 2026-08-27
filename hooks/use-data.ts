'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Product, Collection, Review, BlogPost } from '@/types/database';

const supabase = createClient();

export function useProducts(filters?: {
  collection?: string;
  search?: string;
  sort?: string;
  colors?: string[];
  occasions?: string[];
  fabrics?: string[];
  maxPrice?: number;
  inStockOnly?: boolean;
}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let q = supabase.from('products').select('*, collection:collections(*)');
      if (filters?.collection && filters.collection !== 'all') {
        q = q.eq('collection.slug', filters.collection);
      }
      if (filters?.search) {
        q = q.or(
          `name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%,tags.cs.{${filters.search}}`,
        );
      }
      if (filters?.colors && filters.colors.length > 0) {
        q = q.cs('colors', filters.colors);
      }
      if (filters?.occasions && filters.occasions.length > 0) {
        q = q.in('occasion', filters.occasions);
      }
      if (filters?.fabrics && filters.fabrics.length > 0) {
        q = q.in('fabric', filters.fabrics);
      }
      if (filters?.maxPrice) {
        q = q.lte('price', filters.maxPrice);
      }
      if (filters?.inStockOnly) {
        q = q.eq('stock_status', 'available');
      }
      switch (filters?.sort) {
        case 'price-low':
          q = q.order('price', { ascending: true });
          break;
        case 'price-high':
          q = q.order('price', { ascending: false });
          break;
        case 'rating':
          q = q.order('rating', { ascending: false });
          break;
        case 'newest':
          q = q.order('created_at', { ascending: false });
          break;
        default:
          q = q.order('sort_order', { ascending: true });
      }
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as (Product & { collection: Collection | null })[];
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, collection:collections(*)')
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw error;
      return data as (Product & { collection: Collection | null }) | null;
    },
    enabled: !!slug,
  });
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('helpful_votes', { ascending: false });
      return (data ?? []) as Review[];
    },
    enabled: !!productId,
  });
}

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const { data } = await supabase
        .from('collections')
        .select('*')
        .order('sort_order', { ascending: true });
      return (data ?? []) as Collection[];
    },
  });
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
      return (data ?? []) as BlogPost[];
    },
  });
}
