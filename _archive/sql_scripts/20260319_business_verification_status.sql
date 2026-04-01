-- Add verification_status to business_profiles for the admin approval flow.
-- New businesses start as 'pending', admins approve to 'verified' or reject to 'rejected'.
-- Existing rows (created before this migration) are considered already active/approved.
ALTER TABLE business_profiles
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'verified'
  CHECK (verification_status IN ('pending', 'verified', 'rejected'));

-- New business profiles should default to 'pending', not 'verified'.
-- The DEFAULT 'verified' above is only for backward compat with existing rows.
-- After this migration, the application code sets 'pending' explicitly on insert.

-- Index for fast pending business queries
CREATE INDEX IF NOT EXISTS idx_business_profiles_pending
  ON business_profiles(verification_status)
  WHERE verification_status = 'pending';
