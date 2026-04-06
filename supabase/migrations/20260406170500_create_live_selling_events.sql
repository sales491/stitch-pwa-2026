-- Migration: 20260406170500_create_live_selling_events
-- Purpose: Create Live Selling Hub table so locals can post TikTok/Shopee live schedules
-- Tables affected: live_selling_events

CREATE TABLE IF NOT EXISTS live_selling_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    stream_link TEXT NOT NULL,
    title TEXT NOT NULL,
    scheduled_start TIMESTAMPTZ NOT NULL,
    estimated_duration INTEGER NOT NULL DEFAULT 120,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE live_selling_events ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view events
CREATE POLICY "Public profiles can view live selling events" 
ON live_selling_events FOR SELECT 
USING (true);

-- Policy: Authenticated users can insert their own events
CREATE POLICY "Users can insert their own live selling events" 
ON live_selling_events FOR INSERT 
WITH CHECK (auth.uid() = seller_id);

-- Policy: Authenticated users can update their own events
CREATE POLICY "Users can update their own live selling events" 
ON live_selling_events FOR UPDATE 
USING (auth.uid() = seller_id)
WITH CHECK (auth.uid() = seller_id);

-- Policy: Authenticated users can delete their own events
CREATE POLICY "Users can delete their own live_selling_events" 
ON live_selling_events FOR DELETE 
USING (auth.uid() = seller_id);

-- ROLLBACK:
-- DROP POLICY IF EXISTS "Public profiles can view live selling events" ON live_selling_events;
-- DROP POLICY IF EXISTS "Users can insert their own live selling events" ON live_selling_events;
-- DROP POLICY IF EXISTS "Users can update their own live selling events" ON live_selling_events;
-- DROP POLICY IF EXISTS "Users can delete their own live_selling_events" ON live_selling_events;
-- DROP TABLE IF EXISTS live_selling_events;
