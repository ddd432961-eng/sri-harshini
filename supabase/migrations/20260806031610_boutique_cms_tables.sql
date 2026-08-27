/*
# Boutique CMS — content tables for admin-managed content

## Overview
Adds admin-manageable content tables so every customer-facing section can be
edited from an admin portal later: hero banners, homepage sections, offers,
gallery images, videos, FAQs, site settings (contact info, social links).

## New Tables
1. `hero_banners` — homepage hero slider items (image/video, title, CTAs)
2. `homepage_sections` — ordered configurable sections on the homepage
3. `offers` — promotional offers / coupon banners
4. `gallery_images` — Pinterest-style gallery entries
5. `videos` — video gallery entries (category + thumbnail + embed/url)
6. `faqs` — FAQ entries grouped by category
7. `site_settings` — singleton key/value store for contact info, socials, footer

## Security
- All tables public read for anon+authenticated (content is customer-facing).
- Writes restricted to authenticated (admin will use service role or a future
  admin role). No user_id ownership since these are operator-managed.
*/

CREATE TABLE IF NOT EXISTS hero_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text NOT NULL,
  video_url text,
  primary_cta_label text,
  primary_cta_link text,
  secondary_cta_label text,
  secondary_cta_link text,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "hero_public_read" ON hero_banners;
CREATE POLICY "hero_public_read" ON hero_banners FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "hero_auth_write" ON hero_banners;
CREATE POLICY "hero_auth_write" ON hero_banners FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "hero_auth_update" ON hero_banners;
CREATE POLICY "hero_auth_update" ON hero_banners FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "hero_auth_delete" ON hero_banners;
CREATE POLICY "hero_auth_delete" ON hero_banners FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS homepage_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  title text,
  subtitle text,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "hs_public_read" ON homepage_sections;
CREATE POLICY "hs_public_read" ON homepage_sections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "hs_auth_write" ON homepage_sections;
CREATE POLICY "hs_auth_write" ON homepage_sections FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "hs_auth_update" ON homepage_sections;
CREATE POLICY "hs_auth_update" ON homepage_sections FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "hs_auth_delete" ON homepage_sections;
CREATE POLICY "hs_auth_delete" ON homepage_sections FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  coupon_code text UNIQUE,
  discount_type text NOT NULL DEFAULT 'percentage',
  discount_value numeric(10,2) NOT NULL DEFAULT 0,
  min_order numeric(10,2),
  starts_at timestamptz DEFAULT now(),
  ends_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "offers_public_read" ON offers;
CREATE POLICY "offers_public_read" ON offers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "offers_auth_write" ON offers;
CREATE POLICY "offers_auth_write" ON offers FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "offers_auth_update" ON offers;
CREATE POLICY "offers_auth_update" ON offers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "offers_auth_delete" ON offers;
CREATE POLICY "offers_auth_delete" ON offers FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'Bridal',
  width int,
  height int,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gallery_public_read" ON gallery_images;
CREATE POLICY "gallery_public_read" ON gallery_images FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "gallery_auth_write" ON gallery_images;
CREATE POLICY "gallery_auth_write" ON gallery_images FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "gallery_auth_update" ON gallery_images;
CREATE POLICY "gallery_auth_update" ON gallery_images FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "gallery_auth_delete" ON gallery_images;
CREATE POLICY "gallery_auth_delete" ON gallery_images FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Workshop',
  video_url text NOT NULL,
  thumbnail_url text,
  duration text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "videos_public_read" ON videos;
CREATE POLICY "videos_public_read" ON videos FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "videos_auth_write" ON videos;
CREATE POLICY "videos_auth_write" ON videos FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "videos_auth_update" ON videos;
CREATE POLICY "videos_auth_update" ON videos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "videos_auth_delete" ON videos;
CREATE POLICY "videos_auth_delete" ON videos FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'General',
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "faqs_public_read" ON faqs;
CREATE POLICY "faqs_public_read" ON faqs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "faqs_auth_write" ON faqs;
CREATE POLICY "faqs_auth_write" ON faqs FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "faqs_auth_update" ON faqs;
CREATE POLICY "faqs_auth_update" ON faqs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "faqs_auth_delete" ON faqs;
CREATE POLICY "faqs_auth_delete" ON faqs FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settings_public_read" ON site_settings;
CREATE POLICY "settings_public_read" ON site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "settings_auth_write" ON site_settings;
CREATE POLICY "settings_auth_write" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "settings_auth_update" ON site_settings;
CREATE POLICY "settings_auth_update" ON site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
