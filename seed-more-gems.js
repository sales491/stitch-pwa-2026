const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const gems = [
  {
    title: 'Ungab Rock Formation',
    town: 'Santa Cruz', // Actually Mongpong Island is governed by Santa Cruz
    description: 'A colossal natural rock arch rising dramatically from the turquoise sea. Nestled on the coast of Mongpong Island, this majestic formation shelters a quiet, cream-colored pebble beach beneath it, offering breathtaking photography spots and a rugged, isolated escape from the main island.',
    images: ['/images/gems/ungab-rock.png'], // High fidelity AI generated from real images
    is_approved: true,
    category: 'Coastal'
  },
  {
    title: 'Kawa-Kawa Falls',
    town: 'Santa Cruz',
    description: 'Tucked deep in the lush tropical jungles of Santa Cruz, Kawa-Kawa features three distinct, continuously cascading plunge pools that have been naturally carved out of the bedrock. The refreshing, clear river water makes it a spectacular, less-frequented spot for a restorative swim.',
    images: ['/images/gems/kawa-kawa.png'],
    is_approved: true,
    category: 'Falls'
  },
  {
    title: 'Palad Sandbar',
    town: 'Santa Cruz', // Off Maniwaya
    description: 'An ephemeral paradise that only reveals itself during low tide. When the waters recede, a pristine stretch of bright, powdery white sand emerges like a mirage amidst incredibly clear, waist-deep turquoise and emerald waters, offering an unbelievable tropical experience.',
    images: ['/images/gems/palad.png'],
    is_approved: true,
    category: 'Coastal'
  },
  {
    title: 'Bathala Caves',
    town: 'Santa Cruz',
    description: 'A deeply mystical and rugged underground network. The crown jewel is the "Church Cave", an immense, cathedral-like cavern featuring a dramatic natural skylight that beams intense sunrays down onto the rugged, stalactite-filled floor below. A must-see for adventurous spelunkers.',
    images: ['/images/gems/bathala.png'],
    is_approved: true,
    category: 'Cave'
  },
  {
    title: 'Mount Malindig',
    town: 'Buenavista',
    description: 'The highest peak in Marinduque, this dormant stratovolcano dominates the southern skyline. A rewarding, strenuous trek through dense coconut plantations and upper mossy forests culminates in unparalleled panoramic views of neighboring islands and the sprawling ocean.',
    images: ['/images/gems/malindig.png'],
    is_approved: true,
    category: 'Mountain'
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
