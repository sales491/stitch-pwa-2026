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
  const curbaId = '67d94f45-d0c6-4256-9370-0c7dff466173';
  const minidoId = 'f11fc539-1abc-4664-819c-58edec31d41c';

  const now = new Date();
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  console.log(`Swapping Best of Boac spotlight for ${monthYear}...`);
  const { error: spotlightError } = await supabase
    .from('boac_spotlights')
    .upsert({
      month_year: monthYear,
      display_label: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      // SWAPPED: Minido is now the winner
      winner_business_id: minidoId,
      winner_writeup_1: 'Minido Preschool remains a beloved institution for early childhood education in Boac. With its nurturing environment and recent community initiatives like summer classes, it truly stands out as a pillar of the local community.',
      winner_writeup_2: 'Their dedication to fostering young minds makes them this month\'s top standout in Boac.',
      // SWAPPED: Curba is now the shoutout
      business_id_1: curbaId,
      writeup_1: 'Recently embracing a cafe-oriented vibe, Curba Grill & Cafe (also known locally as Tambayan sa Curba) continues to be a staple in Boac. With its rustic charm and generous servings of local favorites alongside new coffee offerings, it is a must-visit.',
    }, { onConflict: 'month_year' });

  if (spotlightError) console.error("Error updating spotlight:", spotlightError);
  else console.log("Spotlight swapped successfully!");
}

run();
