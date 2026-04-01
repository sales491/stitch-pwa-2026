-- Alignment Migration: Sync Schema with TypeScript Types
-- Date: 2026-03-31

-- 1. Profiles: Adding missing columns defined in database.types.ts
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS notification_preferences jsonb,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS trust_score numeric DEFAULT 3.0,
  ADD COLUMN IF NOT EXISTS barangay text,
  ADD COLUMN IF NOT EXISTS accepted_guidelines boolean DEFAULT false;

-- 2. Business Profiles: Adding missing columns defined in database.types.ts
ALTER TABLE public.business_profiles
  ADD COLUMN IF NOT EXISTS gallery_image text,
  ADD COLUMN IF NOT EXISTS gallery_images text[],
  ADD COLUMN IF NOT EXISTS social_media jsonb,
  ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS operating_hours text,
  ADD COLUMN IF NOT EXISTS contact_info jsonb,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS menu_images text[],
  ADD COLUMN IF NOT EXISTS delivery_available boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS categories text[];

-- 3. Posts: Adding missing columns defined in database.types.ts
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS category_label text,
  ADD COLUMN IF NOT EXISTS comments_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS likes_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS poll_data jsonb,
  ADD COLUMN IF NOT EXISTS tags text[];

-- 4. Listings: Adding missing columns defined in database.types.ts
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS condition text,
  ADD COLUMN IF NOT EXISTS img text,
  ADD COLUMN IF NOT EXISTS posted_ago text,
  ADD COLUMN IF NOT EXISTS posted_date text,
  ADD COLUMN IF NOT EXISTS price_value numeric,
  ADD COLUMN IF NOT EXISTS seller jsonb,
  ADD COLUMN IF NOT EXISTS seo jsonb,
  ADD COLUMN IF NOT EXISTS flag_count integer DEFAULT 0;
