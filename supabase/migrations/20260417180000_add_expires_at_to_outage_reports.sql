-- Migration: 20260417180000_add_expires_at_to_outage_reports
-- Purpose: Add missing expires_at column to outage_reports table to fix runtime schema cache errors
-- Tables affected: outage_reports

ALTER TABLE outage_reports ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE NULL;

-- ROLLBACK:
-- ALTER TABLE outage_reports DROP COLUMN IF EXISTS expires_at;
