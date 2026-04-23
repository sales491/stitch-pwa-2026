-- Migration: 20260423002600_add_business_review_triggers
-- Purpose: Add triggers to automatically update average_rating and review_count on business_profiles
-- Tables affected: business_reviews, business_profiles

-- 1. Create the function
CREATE OR REPLACE FUNCTION public.update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle NEW (INSERT/UPDATE)
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    UPDATE public.business_profiles
    SET 
      review_count = (
        SELECT COUNT(*) 
        FROM public.business_reviews 
        WHERE business_id = NEW.business_id
      ),
      average_rating = (
        SELECT ROUND(AVG(rating)::numeric, 1) 
        FROM public.business_reviews 
        WHERE business_id = NEW.business_id
      )
    WHERE id = NEW.business_id;
  END IF;

  -- Handle OLD (DELETE/UPDATE changing business_id)
  IF (TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.business_id != NEW.business_id)) THEN
    UPDATE public.business_profiles
    SET 
      review_count = (
        SELECT COUNT(*) 
        FROM public.business_reviews 
        WHERE business_id = OLD.business_id
      ),
      average_rating = (
        SELECT ROUND(AVG(rating)::numeric, 1) 
        FROM public.business_reviews 
        WHERE business_id = OLD.business_id
      )
    WHERE id = OLD.business_id;
  END IF;

  RETURN NULL; -- AFTER trigger
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS trigger_update_business_rating ON public.business_reviews;
CREATE TRIGGER trigger_update_business_rating
AFTER INSERT OR UPDATE OR DELETE ON public.business_reviews
FOR EACH ROW EXECUTE FUNCTION public.update_business_rating();

-- 3. Backfill existing counts
UPDATE public.business_profiles bp
SET 
  review_count = COALESCE((SELECT COUNT(*) FROM public.business_reviews br WHERE br.business_id = bp.id), 0),
  average_rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM public.business_reviews br WHERE br.business_id = bp.id)
WHERE EXISTS (SELECT 1 FROM public.business_reviews br WHERE br.business_id = bp.id);

-- ROLLBACK:
-- DROP TRIGGER IF EXISTS trigger_update_business_rating ON public.business_reviews;
-- DROP FUNCTION IF EXISTS public.update_business_rating();
