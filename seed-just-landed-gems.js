const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const gems = [
  {
    title: 'Balanacan Shrine',
    town: 'Mogpog',
    description: 'Also known as the Shrine of Our Lady of Biglang Awa, this monumental statue of the Virgin Mary overlooks Balanacan Cove. Erected to welcome every traveler arriving by sea, the site features a view deck that provides stunning panoramic vistas of the natural harbor, the arriving ferries, and the deep blue sea.',
    images: ['/images/gems/balanacan.png'],
    is_approved: true,
    category: 'Cultural'
  },
  {
    title: 'Luzon Datum of 1911',
    town: 'Mogpog',
    description: 'Atop Mt. Mataas in Barangay Hinanggayon stands the historical Luzon Datum of 1911, the primary geodetic reference center of the Philippines. Reached by climbing nearly 500 steps, this national landmark rewards hikers with breathtaking 360-degree views of Tayabas Bay and the Tablas Strait.',
    images: ['/images/gems/luzon-datum.png'],
    is_approved: true,
    category: 'Historical'
  },
  {
    title: 'Paadyao Cascades',
    town: 'Mogpog',
    description: 'Tucked away in Barangay Bocboc, Paadyao Cascades is a serene, tiered waterfall that plummets 100 feet into a cool, jade-green natural plunge pool. This lush tropical oasis is a favorite among locals for its tranquil vibe, natural Jacuzzi-like rock tubs, and pristine uncommercialized beauty.',
    images: ['/images/gems/paadyao.png'],
    is_approved: true,
    category: 'Falls'
  },
  {
    title: 'Tarug Rock Formation',
    town: 'Mogpog',
    description: 'A striking geological wonder, the Tarug Rock Formation is a massive, steep limestone monolith rising abruptly from the rolling greenery of Mogpog. It houses a multi-chambered cave system, offering adventurers a quick but thrilling spelunking experience and dramatic views of the rural landscape.',
    images: ['/images/gems/tarug.png'],
    is_approved: true,
    category: 'Cave'
  },
  {
    title: 'Boac Cathedral',
    town: 'Boac',
    description: 'The Immaculate Conception Cathedral Parish is a stunning testament to Spanish-era architecture in Marinduque. Built in 1792 with reddish-brown terracotta bricks and thick buttresses, this earthquake-baroque fortress church famously protected the townspeople from pirate raids and stands as a major cultural landmark.',
    images: ['/images/gems/boac-cathedral.png'],
    is_approved: true,
    category: 'Cultural'
  },
  {
    title: 'Marinduque National Museum',
    town: 'Boac',
    description: 'Located in the heart of Boac\'s historic town plaza, this beautifully preserved Spanish colonial building once served as a school, prison, and government tribunal. Today, it hosts rich exhibits on Marinduque\'s heritage, featuring the Moriones tradition, historical artifacts, and ancient Ming-dynasty shipwreck ceramics.',
    images: ['/images/gems/marinduque-museum.png'],
    is_approved: true,
    category: 'Cultural'
  }
];

async function seed() {
  const { data: users, error: uErr } = await supabase
    .from('profiles')
    .select('id')
    .limit(1);

  if (uErr) {
    console.error('Error fetching admin user:', uErr);
    return;
  }

  const author_id = users[0].id;

  for (const gem of gems) {
    // Prevent duplicate entries
    const { data: existing } = await supabase.from('gems').select('id').eq('title', gem.title);
    if (existing && existing.length > 0) {
      console.log('Skipping existing:', gem.title);
      continue;
    }

    const { data, error } = await supabase
      .from('gems')
      .insert({
        ...gem,
        author_id
      })
      .select();

    if (error) {
      console.error('Error inserting', gem.title, error);
    } else {
      console.log('Inserted', gem.title, data[0].id);
    }
  }
  
  console.log('Finished seeding.');
}

seed();
