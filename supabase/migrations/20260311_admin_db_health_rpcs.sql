-- Migration: Admin DB Health RPCs
-- Creates two helper functions queryable only by the service_role (admin client).
-- These read from pg system catalogs which require SECURITY DEFINER to expose safely.

-- 1. Total database size in bytes
CREATE OR REPLACE FUNCTION get_db_size()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT pg_database_size(current_database());
$$;

-- 2. Per-table live row count + dead rows + total disk size
CREATE OR REPLACE FUNCTION get_table_stats()
RETURNS TABLE(
  table_name       text,
  live_rows        bigint,
  dead_rows        bigint,
  total_size_bytes bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.relname::text                   AS table_name,
    s.n_live_tup                      AS live_rows,
    s.n_dead_tup                      AS dead_rows,
    pg_total_relation_size(s.relid)   AS total_size_bytes
  FROM pg_stat_user_tables s
  ORDER BY live_rows DESC;
$$;

-- Grant execute to service_role only (used by createAdminClient)
GRANT EXECUTE ON FUNCTION get_db_size() TO service_role;
GRANT EXECUTE ON FUNCTION get_table_stats() TO service_role;
