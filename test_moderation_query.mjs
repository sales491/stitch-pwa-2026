import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runQueries() {
    console.log("Running Pending Businesses Query...");
    const { data: pendingBusinesses, error: pbError } = await supabase
        .from('business_profiles')
        .select('id, name:business_name, category:business_type, town:location, description, created_at, owner_id, is_verified')
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: true });

    if (pbError) {
        console.error("Pending Businesses Error:", pbError);
    } else {
        console.log(`Found ${pendingBusinesses?.length || 0} pending businesses.`);
    }

    console.log("\nRunning Claim Requests Query...");
    const { data: claimRequests, error: crError } = await supabase
        .from('business_claim_requests')
        .select(`
            id,
            business_id,
            requester_name,
            requester_email,
            requester_phone,
            message,
            created_at,
            status,
            business:business_profiles!business_claim_requests_business_id_fkey (
                name:business_name,
                category:business_type,
                town:location
            )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    if (crError) {
        console.error("Claim Requests Error:", crError);
    } else {
        console.log(`Found ${claimRequests?.length || 0} claim requests.`);
        if (claimRequests?.length > 0) {
            console.log(JSON.stringify(claimRequests, null, 2));
        }
    }
}

runQueries();
