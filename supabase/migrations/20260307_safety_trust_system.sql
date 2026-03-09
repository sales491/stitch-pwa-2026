-- =====================================================================
-- SAFETY & TRUST SYSTEM — Full Migration
-- Run this in the Supabase SQL Editor
-- =====================================================================

-- 1. Add flag_count to posts, comments, listings (counter-cache)
ALTER TABLE posts    ADD COLUMN IF NOT EXISTS flag_count integer NOT NULL DEFAULT 0;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS flag_count integer NOT NULL DEFAULT 0;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS flag_count integer NOT NULL DEFAULT 0;

-- 2. Add unique constraint on moderation_queue(content_type, content_id)
--    so we can upsert without duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'moderation_queue_content_type_content_id_key'
  ) THEN
    ALTER TABLE moderation_queue
      ADD CONSTRAINT moderation_queue_content_type_content_id_key
      UNIQUE (content_type, content_id);
  END IF;
END;
$$;

-- 3. 3-Strike Trigger: after every content_flag INSERT
--    a) increment flag_count on the parent table
--    b) at >= 3 flags: set status='hidden', push to moderation_queue
CREATE OR REPLACE FUNCTION handle_new_content_flag()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_flag_count integer;
  table_name     text;
BEGIN
  -- Map content_type to actual table
  CASE NEW.content_type
    WHEN 'post'     THEN table_name := 'posts';
    WHEN 'comment'  THEN table_name := 'comments';
    WHEN 'listing'  THEN table_name := 'listings';
    WHEN 'job'      THEN table_name := 'jobs';
    WHEN 'commute'  THEN table_name := 'transport_services';
    ELSE table_name := NULL;
  END CASE;

  IF table_name IS NULL THEN
    RETURN NEW;
  END IF;

  -- Increment flag_count counter cache (only on tables that have it)
  IF table_name IN ('posts', 'comments', 'listings') THEN
    EXECUTE format(
      'UPDATE %I SET flag_count = flag_count + 1 WHERE id = $1 RETURNING flag_count',
      table_name
    ) USING NEW.content_id INTO new_flag_count;
  ELSE
    -- For tables without flag_count, count from source of truth
    SELECT COUNT(*) INTO new_flag_count
    FROM content_flags
    WHERE content_type = NEW.content_type
      AND content_id   = NEW.content_id;
  END IF;

  -- At 3+ flags: auto-hide content and queue for admin review
  IF new_flag_count >= 3 THEN
    -- Set status = 'hidden' on content tables that have a status column
    IF table_name IN ('posts', 'listings') THEN
      EXECUTE format(
        'UPDATE %I SET status = ''hidden'' WHERE id = $1 AND (status IS NULL OR status NOT IN (''hidden'',''deleted''))',
        table_name
      ) USING NEW.content_id;
    ELSIF table_name = 'comments' THEN
      -- comments use status column too
      EXECUTE format(
        'UPDATE %I SET status = ''hidden'' WHERE id = $1 AND (status IS NULL OR status != ''hidden'')',
        table_name
      ) USING NEW.content_id;
    END IF;

    -- Upsert row into moderation_queue for admin dashboard
    INSERT INTO moderation_queue (content_type, content_id, flag_count, status, queued_at)
    VALUES (NEW.content_type, NEW.content_id, new_flag_count, 'pending', NOW())
    ON CONFLICT (content_type, content_id) DO UPDATE
      SET flag_count = EXCLUDED.flag_count,
          status     = 'pending',
          queued_at  = NOW();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_content_flag_inserted ON content_flags;
CREATE TRIGGER on_content_flag_inserted
  AFTER INSERT ON content_flags
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_content_flag();

-- =====================================================================
-- 4. Business Reviews → auto-update average_rating + review_count
-- =====================================================================

CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  bid text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    bid := OLD.business_id;
  ELSE
    bid := NEW.business_id;
  END IF;

  UPDATE business_profiles
  SET
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM business_reviews
      WHERE business_id = bid
    ),
    review_count = (
      SELECT COUNT(*)
      FROM business_reviews
      WHERE business_id = bid
    )
  WHERE id = bid;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS on_business_review_change ON business_reviews;
CREATE TRIGGER on_business_review_change
  AFTER INSERT OR UPDATE OR DELETE ON business_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_business_rating();

-- =====================================================================
-- 5. Operator Trust Score → updated from transport_vouches count
--    trust_score on profiles is the vouch count for the operator's service
-- =====================================================================

CREATE OR REPLACE FUNCTION update_operator_trust_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  op_provider_id text;
  vouch_count    integer;
BEGIN
  -- Get the provider_id of the service being vouched
  IF TG_OP = 'DELETE' THEN
    SELECT provider_id INTO op_provider_id
    FROM transport_services
    WHERE id = OLD.service_id;
  ELSE
    SELECT provider_id INTO op_provider_id
    FROM transport_services
    WHERE id = NEW.service_id;
  END IF;

  IF op_provider_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Count total vouches for all services owned by this provider
  SELECT COUNT(*) INTO vouch_count
  FROM transport_vouches tv
  JOIN transport_services ts ON ts.id = tv.service_id
  WHERE ts.provider_id = op_provider_id;

  -- Map vouch count to a 0-5 trust score
  -- 0 vouches = 3.0 base, +0.1 per vouch, capped at 5.0
  UPDATE profiles
  SET trust_score = LEAST(5.0, 3.0 + (vouch_count::numeric * 0.1))
  WHERE id = op_provider_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS on_transport_vouch_change ON transport_vouches;
CREATE TRIGGER on_transport_vouch_change
  AFTER INSERT OR DELETE ON transport_vouches
  FOR EACH ROW
  EXECUTE FUNCTION update_operator_trust_score();

-- =====================================================================
-- 6. Operator Incident Flag → also creates moderation_queue row 
--    for content_type = 'commute' (transport_services)
-- =====================================================================
-- This is already handled by handle_new_content_flag() above.
-- When a 'commute' type flag reaches 3, it will be queued for admin.

-- =====================================================================
-- 7. Backfill: recalculate all existing business ratings right now
-- =====================================================================
UPDATE business_profiles bp
SET
  average_rating = sub.avg,
  review_count   = sub.cnt
FROM (
  SELECT
    business_id,
    AVG(rating)::numeric(3,2) AS avg,
    COUNT(*)                  AS cnt
  FROM business_reviews
  GROUP BY business_id
) sub
WHERE bp.id = sub.business_id;

-- =====================================================================
-- 8. Backfill: recalculate trust_scores for all operators
-- =====================================================================
UPDATE profiles p
SET trust_score = LEAST(5.0, 3.0 + (
  (SELECT COUNT(*) FROM transport_vouches tv
   JOIN transport_services ts ON ts.id = tv.service_id
   WHERE ts.provider_id = p.id)::numeric * 0.1
))
WHERE p.id IN (
  SELECT DISTINCT provider_id FROM transport_services
);
