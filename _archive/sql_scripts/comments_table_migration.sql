-- ================================================================
-- Marinduque Connect — Universal Comments System
-- ================================================================

CREATE TABLE IF NOT EXISTS public.comments (
    id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_id       text NOT NULL,
    entity_type     text NOT NULL CHECK (entity_type IN ('listing', 'post', 'business', 'gem', 'event')),
    author_id       uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content         text NOT NULL,
    created_at      timestamptz DEFAULT now() NOT NULL,
    updated_at      timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 1. Everyone can read comments
CREATE POLICY "Everyone can read comments"
    ON public.comments FOR SELECT
    USING (true);

-- 2. Authenticated users can post comments
CREATE POLICY "Authenticated users can post comments"
    ON public.comments FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = author_id);

-- 3. Authors can delete their own comments
CREATE POLICY "Authors can delete own comments"
    ON public.comments FOR DELETE
    TO authenticated
    USING (auth.uid() = author_id);

-- 4. Admins/Moderators can delete any comment
CREATE POLICY "Admins/Mods can delete any comment"
    ON public.comments FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
        )
    );

-- Create index for performance
CREATE INDEX IF NOT EXISTS comments_entity_idx ON public.comments (entity_type, entity_id);
