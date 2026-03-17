-- 1. Remove confusing legacy trust score trigger from transport vouches
DROP TRIGGER IF EXISTS on_transport_vouch_change ON transport_vouches;
DROP FUNCTION IF EXISTS update_operator_trust_score();

-- We leave the `trust_score` column in `profiles` for now just in case other views depend on it, 
-- but it will no longer be dynamically updated or used for logic.

-- 2. Create seller_vouches table for Marketplace sellers
CREATE TABLE IF NOT EXISTS public.seller_vouches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vouched_seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vouched_by_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(vouched_seller_id, vouched_by_user_id)
);

-- Enable RLS
ALTER TABLE public.seller_vouches ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Anyone can read seller vouches"
  ON public.seller_vouches FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own vouches"
  ON public.seller_vouches FOR INSERT
  WITH CHECK (auth.uid() = vouched_by_user_id);

CREATE POLICY "Users can delete their own vouches"
  ON public.seller_vouches FOR DELETE
  USING (auth.uid() = vouched_by_user_id);
