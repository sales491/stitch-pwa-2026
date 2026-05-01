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

async function updateRogers() {
  const payload = {
      description: "Welcome to Roger’s Cafe & Grill! Where coffee meets comfort food in a cozy, homey space. Serving coffee, comfort food, rice meals, croffles, and milk tea. \nAddress: 944 Gov J. Lopez, Brgy Tres, Gasan, Marinduque.\nHours: 10:00 AM – 10:00 PM."
  };

  const { error } = await supabase
    .from('business_profiles')
    .update(payload)
    .eq('business_name', "Roger's Cafe Grill")
    .eq('location', 'Gasan');
    
  if (error) console.error("Error updating:", error.message);
  else console.log("✅ Successfully updated Roger's Cafe Grill with fresh details!");
}

updateRogers();
