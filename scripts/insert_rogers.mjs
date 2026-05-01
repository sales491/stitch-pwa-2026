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

async function insertRogers() {
  const payload = {
      business_name: "Roger's Cafe Grill",
      location: 'Gasan',
      owner_id: '7da9eb71-7757-4335-97c3-34eb40e4f34a',
      contact_info: '',
      description: "Roger's Cafe Grill is a local dining establishment in Gasan, Marinduque.",
      categories: ['Restaurant'],
      social_media: { facebook: 'https://www.facebook.com/p/Rogers-Cafe-Grill-61577923678606/' },
      is_verified: false,
      verification_status: 'pending'
  };

  const { error } = await supabase.from('business_profiles').insert(payload);
  if (error) console.error("Error inserting:", error.message);
  else console.log("✅ Successfully inserted Roger's Cafe Grill!");
}

insertRogers();
