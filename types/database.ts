export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[] | undefined;

export interface Database {
  public: {
    Tables: {
      collections: {
        Row: {
          id: string;
          slug: string;
          name: string;
          tagline: string | null;
          description: string | null;
          image_url: string;
          cover_url: string | null;
          sort_order: number;
          featured: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['collections']['Row']> & {
          slug: string;
          name: string;
          image_url: string;
        };
        Update: Partial<Database['public']['Tables']['collections']['Row']>;
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          collection_id: string | null;
          short_description: string;
          description: string;
          price: number;
          compare_at_price: number | null;
          images: string[];
          video_url: string | null;
          fabric: string | null;
          thread: string | null;
          stone_work: string | null;
          occasion: string | null;
          colors: string[];
          sizes: string[];
          availability: string;
          stock_status: string;
          rating: number;
          review_count: number;
          tags: string[];
          best_seller: boolean;
          trending: boolean;
          limited_edition: boolean;
          latest: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['products']['Row']> & {
          slug: string;
          name: string;
          short_description: string;
          description: string;
          price: number;
        };
        Update: Partial<Database['public']['Tables']['products']['Row']>;
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          author_name: string;
          rating: number;
          title: string;
          body: string;
          photo_url: string | null;
          video_url: string | null;
          verified: boolean;
          helpful_votes: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['reviews']['Row']> & {
          product_id: string;
          author_name: string;
          rating: number;
          title: string;
          body: string;
        };
        Update: Partial<Database['public']['Tables']['reviews']['Row']>;
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          body: string;
          cover_url: string;
          category: string;
          author: string;
          read_time: number;
          published_at: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['blog_posts']['Row']> & {
          slug: string;
          title: string;
          excerpt: string;
          body: string;
          cover_url: string;
        };
        Update: Partial<Database['public']['Tables']['blog_posts']['Row']>;
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: { product_id: string };
        Update: Partial<Database['public']['Tables']['wishlist_items']['Row']>;
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          size: string | null;
          color: string | null;
          created_at: string;
        };
        Insert: {
          product_id: string;
          quantity?: number;
          size?: string;
          color?: string;
        };
        Update: Partial<Database['public']['Tables']['cart_items']['Row']>;
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          full_name: string;
          phone: string;
          line1: string;
          line2: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['addresses']['Row']> & {
          label: string;
          full_name: string;
          phone: string;
          line1: string;
          city: string;
          state: string;
          pincode: string;
        };
        Update: Partial<Database['public']['Tables']['addresses']['Row']>;
      };
      measurements: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          dress_type: string;
          shoulder: number | null;
          chest: number | null;
          waist: number | null;
          hip: number | null;
          length: number | null;
          sleeve_length: number | null;
          neck_depth: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['measurements']['Row']> & {
          user_id: string;
          label: string;
          dress_type: string;
        };
        Update: Partial<Database['public']['Tables']['measurements']['Row']>;
      };
      appointments: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          preferred_date: string;
          preferred_time: string;
          dress_type: string | null;
          notes: string | null;
          status: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['appointments']['Row']> & {
          type: string;
          preferred_date: string;
          preferred_time: string;
        };
        Update: Partial<Database['public']['Tables']['appointments']['Row']>;
      };
      custom_designs: {
        Row: {
          id: string;
          user_id: string;
          occasion: string | null;
          fabric: string | null;
          thread: string | null;
          embroidery_type: string | null;
          stone_type: string | null;
          mirror_work: boolean;
          neck_style: string | null;
          sleeve_style: string | null;
          back_neck: string | null;
          border_style: string | null;
          budget: number | null;
          deadline: string | null;
          inspiration_urls: string[];
          notes: string | null;
          status: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['custom_designs']['Row']>;
        Update: Partial<Database['public']['Tables']['custom_designs']['Row']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status: string;
          total: number;
          subtotal: number;
          shipping: number;
          gst: number;
          payment_method: string;
          full_name: string;
          phone: string;
          email: string | null;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          pincode: string;
          delivery_notes: string | null;
          gift_message: string | null;
          tracking_steps: Json;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['orders']['Row']> & {
          order_number: string;
          total: number;
          subtotal: number;
          payment_method: string;
          full_name: string;
          phone: string;
          address_line1: string;
          city: string;
          state: string;
          pincode: string;
        };
        Update: Partial<Database['public']['Tables']['orders']['Row']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_image: string | null;
          size: string | null;
          color: string | null;
          quantity: number;
          price: number;
        };
        Insert: Partial<Database['public']['Tables']['order_items']['Row']> & {
          order_id: string;
          product_name: string;
          price: number;
          quantity: number;
        };
        Update: Partial<Database['public']['Tables']['order_items']['Row']>;
      };
    };
  };
}

export type Collection =
  Database['public']['Tables']['collections']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
