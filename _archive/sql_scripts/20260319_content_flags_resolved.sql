-- Add resolved column to content_flags so admins can dismiss reports
-- Also add resolved_at and resolved_by for audit trail
ALTER TABLE content_flags
  ADD COLUMN IF NOT EXISTS resolved boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz,
  ADD COLUMN IF NOT EXISTS resolved_by uuid REFERENCES auth.users(id);

-- Index for fast unresolved flag queries
CREATE INDEX IF NOT EXISTS idx_content_flags_unresolved
  ON content_flags(content_type, resolved)
  WHERE resolved = false OR resolved IS NULL;
