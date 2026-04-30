import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const env = readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...vParts] = line.split('=');
  if (k && vParts.length > 0) {
    acc[k.trim()] = vParts.join('=').trim().replace(/^["']|["']$/g, '');
  }
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const payload = {
    business_name: 'R & R Bistro',
    location: 'Boac',
    owner_id: '7da9eb71-7757-4335-97c3-34eb40e4f34a',
    contact_info: '',
    description: 'R & R Bistro is a local dining establishment located in Boac, Marinduque.',
    categories: ['Restaurant'],
    social_media: {},
    is_verified: false,
    verification_status: 'pending'
  };

  const { error } = await supabase
    .from('business_profiles')
    .insert(payload);

  if (error) {
    console.error("❌ Error inserting R & R Bistro:", error.message);
  } else {
    console.log("✅ Successfully created R & R Bistro in the directory!");
  }
}

run();
