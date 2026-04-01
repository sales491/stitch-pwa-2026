-- Migration: Lost & Found Table
-- Derived from src/app/actions/lost-found.ts (table name: lost_found)

CREATE TABLE IF NOT EXISTS public.lost_found (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    posted_by    uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
    type         text        NOT NULL CHECK (type IN ('lost', 'found')),
    category     text        NOT NULL CHECK (category IN ('animal', 'item', 'document', 'person')),
    title        text        NOT NULL,
    description  text,
    image_url    text,
    location     text,
    municipality text,
    contact      text,
    status       text        NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
    created_at   timestamptz NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS lost_found_status_idx       ON public.lost_found (status);
CREATE INDEX IF NOT EXISTS lost_found_type_idx         ON public.lost_found (type);
CREATE INDEX IF NOT EXISTS lost_found_category_idx     ON public.lost_found (category);
CREATE INDEX IF NOT EXISTS lost_found_municipality_idx ON public.lost_found (municipality);
CREATE INDEX IF NOT EXISTS lost_found_created_at_idx   ON public.lost_found (created_at DESC);

-- Row Level Security
ALTER TABLE public.lost_found ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can read posts
CREATE POLICY "Public can read lost_found"
    ON public.lost_found FOR SELECT USING (true);

-- Authenticated users can create their own posts
CREATE POLICY "Authenticated users can create lost_found"
    ON public.lost_found FOR INSERT
    WITH CHECK (auth.uid() = posted_by);

-- The poster, or any admin/mod, can update status
CREATE POLICY "Owner or admin can update lost_found"
    ON public.lost_found FOR UPDATE
    USING (
        auth.uid() = posted_by
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
        )
    );

-- The poster, or any admin/mod, can delete posts
CREATE POLICY "Owner or admin can delete lost_found"
    ON public.lost_found FOR DELETE
    USING (
        auth.uid() = posted_by
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
        )
    );
