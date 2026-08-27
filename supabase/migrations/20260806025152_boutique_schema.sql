/*
# Sri Harshini Boutique — Core Schema

## Overview
Customer-facing luxury boutique e-commerce. Authenticated customers can
browse collections/products, leave reviews, manage wishlist, cart, saved
measurements, addresses, book tailoring appointments, and submit custom
design requests. Catalog data (collections, products, reviews, blog) is
publicly readable; user-owned data is owner-scoped.

## New Tables
1. `collections` — product groupings (Bridal, Wedding, Festival, etc.)
2. `products` — boutique inventory with rich attribute columns
3. `reviews` — customer ratings (text/photo) per product
4. `blog_posts` — fashion/tips articles
5. `wishlist_items` — saved products per user
6. `cart_items` — shopping cart per user
7. `addresses` — saved delivery addresses per user
8. `measurements` — saved tailoring measurements per user
9. `appointments` — tailoring/boutique visit bookings per user
10. `custom_designs` — custom design request submissions per user
11. `orders` — placed orders per user
12. `order_items` — line items per order

## Security
- RLS enabled on every table.
- Catalog tables (collections, products, reviews, blog_posts): public read
  for anon+authenticated; writes restricted to authenticated (reviews/
  blog creation is open to authenticated customers for reviews).
- User-owned tables (wishlist, cart, addresses, measurements,
  appointments, custom_designs, orders, order_items): owner-scoped CRUD
  using auth.uid() with DEFAULT auth.uid() on owner columns.
*/

-- ============ COLLECTIONS ============
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  tagline text,
  description text,
  image_url text NOT NULL,
  cover_url text,
  sort_order int NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "collections_public_read" ON collections;
CREATE POLICY "collections_public_read" ON collections FOR SELECT
  TO anon, authenticated USING (true);

-- ============ PRODUCTS ============
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  collection_id uuid REFERENCES collections(id) ON DELETE SET NULL,
  short_description text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  compare_at_price numeric(10,2),
  images text[] NOT NULL DEFAULT '{}',
  video_url text,
  fabric text,
  thread text,
  stone_work text,
  occasion text,
  colors text[] NOT NULL DEFAULT '{}',
  sizes text[] NOT NULL DEFAULT '{}',
  availability text NOT NULL DEFAULT 'In Stock',
  stock_status text NOT NULL DEFAULT 'available',
  rating numeric(2,1) NOT NULL DEFAULT 5.0,
  review_count int NOT NULL DEFAULT 0,
  tags text[] NOT NULL DEFAULT '{}',
  best_seller boolean NOT NULL DEFAULT false,
  trending boolean NOT NULL DEFAULT false,
  limited_edition boolean NOT NULL DEFAULT false,
  latest boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "products_public_read" ON products;
CREATE POLICY "products_public_read" ON products FOR SELECT
  TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- ============ REVIEWS ============
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text NOT NULL,
  body text NOT NULL,
  photo_url text,
  video_url text,
  verified boolean NOT NULL DEFAULT true,
  helpful_votes int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reviews_public_read" ON reviews;
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "reviews_insert_own" ON reviews;
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "reviews_update_own" ON reviews;
CREATE POLICY "reviews_update_own" ON reviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "reviews_delete_own" ON reviews;
CREATE POLICY "reviews_delete_own" ON reviews FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

-- ============ BLOG POSTS ============
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  body text NOT NULL,
  cover_url text NOT NULL,
  category text NOT NULL,
  author text NOT NULL DEFAULT 'Sri Harshini',
  read_time int NOT NULL DEFAULT 5,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "blog_public_read" ON blog_posts;
CREATE POLICY "blog_public_read" ON blog_posts FOR SELECT
  TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);

-- ============ WISHLIST ============
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, product_id)
);
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_wishlist" ON wishlist_items;
CREATE POLICY "select_own_wishlist" ON wishlist_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_wishlist" ON wishlist_items;
CREATE POLICY "insert_own_wishlist" ON wishlist_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_wishlist" ON wishlist_items;
CREATE POLICY "delete_own_wishlist" ON wishlist_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ CART ============
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity int NOT NULL DEFAULT 1 CHECK (quantity > 0),
  size text,
  color text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, product_id, size, color)
);
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_cart" ON cart_items;
CREATE POLICY "select_own_cart" ON cart_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_cart" ON cart_items;
CREATE POLICY "insert_own_cart" ON cart_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_cart" ON cart_items;
CREATE POLICY "update_own_cart" ON cart_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_cart" ON cart_items;
CREATE POLICY "delete_own_cart" ON cart_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ ADDRESSES ============
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  line1 text NOT NULL,
  line2 text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_addresses" ON addresses;
CREATE POLICY "select_own_addresses" ON addresses FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_addresses" ON addresses;
CREATE POLICY "insert_own_addresses" ON addresses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_addresses" ON addresses;
CREATE POLICY "update_own_addresses" ON addresses FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_addresses" ON addresses;
CREATE POLICY "delete_own_addresses" ON addresses FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ MEASUREMENTS ============
CREATE TABLE IF NOT EXISTS measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  dress_type text NOT NULL,
  shoulder numeric(5,1),
  chest numeric(5,1),
  waist numeric(5,1),
  hip numeric(5,1),
  length numeric(5,1),
  sleeve_length numeric(5,1),
  neck_depth numeric(5,1),
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_measurements" ON measurements;
CREATE POLICY "select_own_measurements" ON measurements FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_measurements" ON measurements;
CREATE POLICY "insert_own_measurements" ON measurements FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_measurements" ON measurements;
CREATE POLICY "update_own_measurements" ON measurements FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_measurements" ON measurements;
CREATE POLICY "delete_own_measurements" ON measurements FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ APPOINTMENTS ============
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  dress_type text,
  notes text,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_appointments" ON appointments;
CREATE POLICY "select_own_appointments" ON appointments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_appointments" ON appointments;
CREATE POLICY "insert_own_appointments" ON appointments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_appointments" ON appointments;
CREATE POLICY "delete_own_appointments" ON appointments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ CUSTOM DESIGNS ============
CREATE TABLE IF NOT EXISTS custom_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  occasion text,
  fabric text,
  thread text,
  embroidery_type text,
  stone_type text,
  mirror_work boolean NOT NULL DEFAULT false,
  neck_style text,
  sleeve_style text,
  back_neck text,
  border_style text,
  budget numeric(10,2),
  deadline date,
  inspiration_urls text[] NOT NULL DEFAULT '{}',
  notes text,
  status text NOT NULL DEFAULT 'Submitted',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE custom_designs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_designs" ON custom_designs;
CREATE POLICY "select_own_designs" ON custom_designs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_designs" ON custom_designs;
CREATE POLICY "insert_own_designs" ON custom_designs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_designs" ON custom_designs;
CREATE POLICY "delete_own_designs" ON custom_designs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ ORDERS ============
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  total numeric(10,2) NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  shipping numeric(10,2) NOT NULL DEFAULT 0,
  gst numeric(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  delivery_notes text,
  gift_message text,
  tracking_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

-- ============ ORDER ITEMS ============
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text,
  size text,
  color text,
  quantity int NOT NULL CHECK (quantity > 0),
  price numeric(10,2) NOT NULL
);
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
