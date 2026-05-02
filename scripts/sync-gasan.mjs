import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { updateMissingBarangays } from './update_barangays_db.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const [k, ...vParts] = line.split('=');
  if (k && vParts.length > 0) {
    acc[k.trim()] = vParts.join('=').trim().replace(/^["']|["']$/g, '');
  }
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Helper to map scraped keywords to DB categories
function mapCategory(name, snippets) {
    const text = (name + ' ' + snippets.join(' ')).toLowerCase();
    if (text.includes('pharmacy') || text.includes('drugstore') || text.includes('medical')) return 'Healthcare / Medical';
    if (text.includes('grocery') || text.includes('mart') || text.includes('supermarket') || text.includes('store') || text.includes('market')) return 'Retail / Shop';
    if (text.includes('hotel') || text.includes('resort') || text.includes('inn') || text.includes('transient')) return 'Accommodation';
    if (text.includes('restaurant') || text.includes('food') || text.includes('kusina') || text.includes('bistro') || text.includes('pub') || text.includes('grill')) return 'Restaurant';
    if (text.includes('cafe') || text.includes('coffee') || text.includes('brew')) return 'Cafe';
    if (text.includes('hardware') || text.includes('construction') || text.includes('supplies')) return 'Construction / Hardware';
    if (text.includes('bank') || text.includes('cooperative') || text.includes('finance')) return 'Finance / Banking';
    if (text.includes('university') || text.includes('school') || text.includes('college') || text.includes('deped')) return 'Education / School';
    return 'Other';
}

async function syncResults() {
    const resultsPath = path.join(process.cwd(), 'gasan_pilot_results.json');
    if (!fs.existsSync(resultsPath)) {
        console.error("No gasan_pilot_results.json found.");
        return;
    }

    const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    console.log(`Syncing ${results.length} businesses to Supabase...`);

    for (const biz of results) {
        if (!biz.name || biz.name.includes('Log into Facebook') || biz.name === 'About Meta' || biz.name === 'Facebook') continue;

        const category = mapCategory(biz.name, biz.address_snippets || []);
        
        const payload = {
            business_name: biz.name,
            location: 'Gasan', // Set explicitly for this batch
            owner_id: '7da9eb71-7757-4335-97c3-34eb40e4f34a', // Marko
            contact_info: biz.phones?.[0] || biz.emails?.[0] || '',
            description: biz.description_snippet || `${biz.name} is a local establishment in Gasan, Marinduque.`,
            categories: [category],
            social_media: { facebook: biz.url },
            is_verified: false,
            verification_status: 'rejected'
        };

        // Manual Upsert
        const { data: existing } = await supabase
            .from('business_profiles')
            .select('id')
            .eq('business_name', biz.name)
            .eq('location', 'Gasan')
            .maybeSingle();

        if (existing) {
            const { error } = await supabase
                .from('business_profiles')
                .update(payload)
                .eq('id', existing.id);
            if (error) console.error(`❌ Error updating ${biz.name}:`, error.message);
            else console.log(`✅ Updated: ${biz.name}`);
        } else {
            const { error } = await supabase
                .from('business_profiles')
                .insert(payload);
            if (error) console.error(`❌ Error inserting ${biz.name}:`, error.message);
            else console.log(`✨ Inserted: ${biz.name} (${category})`);
        }
    }

    console.log('\nRunning automatic Barangay scrubbing pass...');
    await updateMissingBarangays();
}

syncResults();
