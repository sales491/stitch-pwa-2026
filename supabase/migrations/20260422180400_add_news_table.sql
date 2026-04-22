-- Migration: 20260422180400_add_news_table
-- Purpose: Create news table for the Marinduque News PWA with auto-delete tracking.
-- Tables affected: news

CREATE TABLE IF NOT EXISTS public.news (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  summary text, 
  content text NOT NULL, 
  image_url text,
  source_url text,
  status text DEFAULT 'pending', 
  key_takeaways jsonb, 
  faq_json jsonb, 
  created_at timestamp with time zone DEFAULT now(),
  published_at timestamp with time zone
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'news' AND policyname = 'Public news are viewable by everyone'
    ) THEN
        CREATE POLICY "Public news are viewable by everyone" ON public.news
            FOR SELECT USING (status = 'published');
    END IF;
END $$;
-- Service role key bypasses RLS naturally.

-- ROLLBACK:
-- DROP TABLE IF EXISTS public.news CASCADE;
