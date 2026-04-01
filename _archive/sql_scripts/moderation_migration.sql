-- ================================================================
-- Marinduque Connect — Moderation System Migration (V2 - Idempotent)
-- Run this in your Supabase SQL Editor:
-- Project Dashboard → SQL Editor → New Query → Paste & Run
-- ================================================================

-- ─── 1. Enable the uuid extension (usually already enabled) ─────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 2. Content Flags Table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.content_flags (
    id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type    text NOT NULL CHECK (content_type IN ('listing', 'job', 'post', 'business', 'commute', 'review')),
    content_id      text NOT NULL,
    flagged_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    reason          text,
    created_at      timestamptz DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS content_flags_unique_per_user
    ON public.content_flags (content_type, content_id, flagged_by);

CREATE INDEX IF NOT EXISTS content_flags_content_idx
    ON public.content_flags (content_type, content_id);

-- ─── 3. Row Level Security for Flags ────────────────────────────
ALTER TABLE public.content_flags ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can flag content" ON public.content_flags;
    CREATE POLICY "Authenticated users can flag content"
        ON public.content_flags FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = flagged_by);

    DROP POLICY IF EXISTS "Users can see own flags" ON public.content_flags;
    CREATE POLICY "Users can see own flags"
        ON public.content_flags FOR SELECT TO authenticated
        USING (auth.uid() = flagged_by);
END $$;

-- ─── 4. Moderation Queue Table ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.moderation_queue (
    id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type    text NOT NULL,
    content_id      text NOT NULL,
    status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    flag_count      int DEFAULT 1,
    queued_at       timestamptz DEFAULT now() NOT NULL,
    reviewed_at     timestamptz,
    reviewed_by     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    review_note     text
);

CREATE UNIQUE INDEX IF NOT EXISTS moderation_queue_unique
    ON public.moderation_queue (content_type, content_id);

ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Authenticated can read moderation queue" ON public.moderation_queue;
    CREATE POLICY "Authenticated can read moderation queue"
        ON public.moderation_queue FOR SELECT TO authenticated
        USING (true);
END $$;

-- ─── 5. Function & Trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_content_flag()
RETURNS TRIGGER AS $$
DECLARE
    v_flag_count int;
BEGIN
    SELECT COUNT(*) INTO v_flag_count
    FROM public.content_flags
    WHERE content_type = NEW.content_type
      AND content_id   = NEW.content_id;

    INSERT INTO public.moderation_queue (content_type, content_id, flag_count, status)
    VALUES (NEW.content_type, NEW.content_id, v_flag_count, 'pending')
    ON CONFLICT (content_type, content_id)
    DO UPDATE SET flag_count = v_flag_count;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_content_flagged ON public.content_flags;
CREATE TRIGGER on_content_flagged
    AFTER INSERT ON public.content_flags
    FOR EACH ROW EXECUTE FUNCTION public.handle_content_flag();
