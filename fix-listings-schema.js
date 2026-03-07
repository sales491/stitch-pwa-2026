const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

// Note: Standard Supabase JS client doesn't support raw DDL by default.
// However, we can try to use the REST API directly or a fetch request to the PostgREST /rpc if available.
// Since we don't have a reliable DDL RPC, and the MCP tool is failing, 
// the gold standard is for the USER to run the SQL.

async function checkConnection() {
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { data, error } = await supabase.from('listings').select('id').limit(1);
    if (error && error.message.includes('column "img" does not exist')) {
        console.log("Confirmed: 'img' column is missing.");
    } else if (error) {
        console.error("Connection check error:", error.message);
    } else {
        console.log("Connection successful. 'img' column might already exist?");
    }
}

console.log("\n================================================================");
console.log("SQL MIGRATION SCRIPT FOR LISTINGS");
console.log("================================================================\n");
console.log("I tried to apply the SQL automatically, but Supabase standard JS client");
console.log("prevents raw DDL (ALTER TABLE) commands for security reasons.\n");
console.log("PLEASE COPY AND PASTE THE FOLLOWING INTO YOUR SUPABASE SQL EDITOR:");
console.log("----------------------------------------------------------------");
console.log(`
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS img text,
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS price_value numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS posted_ago text,
ADD COLUMN IF NOT EXISTS posted_date date DEFAULT now(),
ADD COLUMN IF NOT EXISTS seller jsonb DEFAULT '{"name": "", "avatar": "", "memberSince": "", "responseRate": "", "phone": ""}'::jsonb,
ADD COLUMN IF NOT EXISTS seo jsonb DEFAULT '{"title": "", "description": "", "keywords": []}'::jsonb;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
`);
console.log("----------------------------------------------------------------");
console.log("\nAfter running the SQL above, your Listings error will be resolved.");

checkConnection();
