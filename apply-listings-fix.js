import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function applySql() {
    console.log('Applying migration to add missing columns to "listings" table...');

    const sql = `
    -- Add missing image and metadata columns to the listings table
    ALTER TABLE IF EXISTS public.listings 
    ADD COLUMN IF NOT EXISTS img text,
    ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS price_value numeric DEFAULT 0,
    ADD COLUMN IF NOT EXISTS posted_ago text,
    ADD COLUMN IF NOT EXISTS posted_date date DEFAULT now(),
    ADD COLUMN IF NOT EXISTS seller jsonb DEFAULT '{"name": "", "avatar": "", "memberSince": "", "responseRate": "", "phone": ""}'::jsonb,
    ADD COLUMN IF NOT EXISTS seo jsonb DEFAULT '{"title": "", "description": "", "keywords": []}'::jsonb;
  `;

    // We use a simple RPC to a generic 'exec_sql' if available, 
    // but since we don't know if that exists, we'll try to run it via a temporary function.
    // This is a common pattern for bypassing the lack of a direct 'query' method in the client JS.

    const { error } = await supabase.rpc('bulk_import_businesses', { rows: [] });
    // Note: I saw 'bulk_import_businesses' exists in CsvImporter.tsx. 
    // However, for raw DDL (ALTER TABLE), we usually need the SQL Editor or a superuser-linked edge function.

    // Since I cannot run raw SQL directly through the standard JS client without a specific RPC,
    // I will create a temporary .sql file and recommend the user run it if the script fails,
    // OR I will try to use the MCP tool again which might have failed due to project_id mismatch.
}

// Plan B: Write a proper Node script that uses the postgres driver if available, 
// but sticking to what's easiest for the user: A standalone .js file they can run with 'node' or 'npx tsx'.

const runMigration = async () => {
    // Using the Supabase REST API to execute SQL is not possible.
    // I will instead provide a script that uses 'postgres' or similar if installed.
    console.log("Please run the following SQL in your Supabase SQL Editor:");
    console.log(`
    ALTER TABLE public.listings 
    ADD COLUMN IF NOT EXISTS img text,
    ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS price_value numeric DEFAULT 0,
    ADD COLUMN IF NOT EXISTS posted_ago text,
    ADD COLUMN IF NOT EXISTS posted_date date DEFAULT now(),
    ADD COLUMN IF NOT EXISTS seller jsonb DEFAULT '{"name": "", "avatar": "", "memberSince": "", "responseRate": "", "phone": ""}'::jsonb,
    ADD COLUMN IF NOT EXISTS seo jsonb DEFAULT '{"title": "", "description": "", "keywords": []}'::jsonb;
  `);
};

runMigration();
