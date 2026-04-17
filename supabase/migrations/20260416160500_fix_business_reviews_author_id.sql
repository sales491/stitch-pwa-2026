-- Migration: 20260416160500_fix_business_reviews_author_id
-- Purpose: Fix type mismatch in business_reviews.author_id which causes RLS errors and breaks profile relationships
-- Tables affected: business_reviews

-- 1. Cast the current text values to UUID (will error if there are non-uuid values, but none exist yet we assume)
ALTER TABLE business_reviews 
  ALTER COLUMN author_id TYPE uuid USING author_id::uuid;

-- 2. Add the missing foreign key constraint to profiles to fix the joined queries
ALTER TABLE IF EXISTS business_reviews
  ADD CONSTRAINT business_reviews_author_id_fkey 
  FOREIGN KEY (author_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

-- ROLLBACK:
-- ALTER TABLE business_reviews DROP CONSTRAINT IF EXISTS business_reviews_author_id_fkey;
-- ALTER TABLE business_reviews ALTER COLUMN author_id TYPE text;
