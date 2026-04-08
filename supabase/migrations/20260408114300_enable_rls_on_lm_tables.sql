-- Migration: 20260408114300_enable_rls_on_lm_tables
-- Purpose: Enable Row Level Security on all 5 Live Market tables to fix critical
--          Supabase security linter errors (rls_disabled_in_public + sensitive_columns_exposed).
--          These tables are Phase 0 placeholders — no app code reads/writes them yet.
--          RLS is enabled with a default-deny posture. Permissive policies will be added
--          in a follow-up migration when the Live Market feature is actively developed.
-- Tables affected: lm_sessions, lm_products, lm_claims, lm_messages, lm_strikes

-- ── lm_sessions ────────────────────────────────────────────────────────────────
ALTER TABLE public.lm_sessions ENABLE ROW LEVEL SECURITY;

-- ── lm_products ────────────────────────────────────────────────────────────────
ALTER TABLE public.lm_products ENABLE ROW LEVEL SECURITY;

-- ── lm_claims ──────────────────────────────────────────────────────────────────
ALTER TABLE public.lm_claims ENABLE ROW LEVEL SECURITY;

-- ── lm_messages ────────────────────────────────────────────────────────────────
ALTER TABLE public.lm_messages ENABLE ROW LEVEL SECURITY;

-- ── lm_strikes ─────────────────────────────────────────────────────────────────
ALTER TABLE public.lm_strikes ENABLE ROW LEVEL SECURITY;

-- ROLLBACK:
-- ALTER TABLE public.lm_strikes  DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.lm_messages DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.lm_claims   DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.lm_products DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.lm_sessions DISABLE ROW LEVEL SECURITY;
