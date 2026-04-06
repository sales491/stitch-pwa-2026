---
description: Safe, auditable Supabase database migrations for the Marinduque Market Hub
---

# /db-migration — Supabase Schema Change Workflow

Run this workflow any time you need to add/alter a column, create a table, add an index, or change an RLS policy. **Never modify the schema directly in the Supabase dashboard without completing this workflow.**

---

## Step 1 — Name and create the migration file

Migration files live in `next-app/supabase/migrations/`.

Filename format: `YYYYMMDDHHMMSS_short_description.sql`

Example:
```
next-app/supabase/migrations/20260406143000_add_ai_moderator_columns.sql
```

Use the current UTC timestamp for the prefix. Create the file before writing any SQL.

---

## Step 2 — Write the migration SQL

Write idempotent SQL using `IF NOT EXISTS` / `IF EXISTS` guards wherever possible.

✅ Good:
```sql
ALTER TABLE content_flags ADD COLUMN IF NOT EXISTS ai_confidence_score INT DEFAULT NULL;
ALTER TABLE content_flags ADD COLUMN IF NOT EXISTS ai_reasoning TEXT DEFAULT NULL;
```

❌ Bad (not idempotent — will error if run twice):
```sql
ALTER TABLE content_flags ADD COLUMN ai_confidence_score INT;
```

Include a rollback comment block at the bottom:
```sql
-- ROLLBACK:
-- ALTER TABLE content_flags DROP COLUMN IF EXISTS ai_confidence_score;
-- ALTER TABLE content_flags DROP COLUMN IF EXISTS ai_reasoning;
```

---

## Step 3 — Validate with MCP before touching production

Use the Supabase MCP server to inspect the current schema and confirm the migration is needed:

```
supabase_query: SELECT column_name FROM information_schema.columns WHERE table_name = 'your_table';
```

Confirm the column does NOT already exist before running the SQL.

---

## Step 4 — Commit the migration file FIRST

**Before running the SQL against production**, commit the `.sql` file to git:

```bash
git add supabase/migrations/YYYYMMDDHHMMSS_description.sql
git commit -m "db: add ai_moderator columns to content_flags and profiles"
```

This ensures the migration is in version control even if something goes wrong during execution.

---

## Step 5 — Execute via Supabase MCP

Run the migration SQL using the Supabase MCP `execute_sql` tool.
Do NOT run ad-hoc `.mjs` scripts with hardcoded credentials for schema changes.

---

## Step 6 — Verify

After execution, run a quick schema check via MCP to confirm the columns/tables exist as expected.

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'your_table'
ORDER BY ordinal_position;
```

---

## Quick Reference — Migration File Template

```sql
-- Migration: YYYYMMDDHHMMSS_description
-- Purpose: [What this changes and why]
-- Tables affected: [table_name]

ALTER TABLE your_table ADD COLUMN IF NOT EXISTS new_column TEXT DEFAULT NULL;

-- ROLLBACK:
-- ALTER TABLE your_table DROP COLUMN IF EXISTS new_column;
```

---

## Rules

- One concern per migration file (don't bundle unrelated changes)
- Always use `IF NOT EXISTS` / `IF EXISTS` guards
- Always write the rollback block
- Always commit the file before executing
- Never drop columns or tables without explicit user confirmation
