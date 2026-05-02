import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const taglishFaqs = [
  {
    category: 'general',
    question: 'Saan ang best ube halaya sa Marinduque?',
    answer: 'If you are looking for authentic and the best ube halaya, you have to visit the local markets in Gasan or check out specific bakeries in Boac. Madalas itong sold out during Holy Week, so it is best to pre-order from local sellers in our directory!'
  },
  {
    category: 'general',
    question: 'Paano mag-join sa Moriones parade?',
    answer: 'Anyone can watch the parade for free along the main streets of Boac, Gasan, and Mogpog during Holy Week. But if you want to actually wear the mask and join as a Morion, you usually need to register with the local parish. Maraming locals ang nag-pa-participate as a panata (religious vow).'
  },
  {
    category: 'general',
    question: 'Magkano ang pamasahe sa tricycle from Balanacan port to Boac?',
    answer: 'Tricycle fares usually cost around ₱30 to ₱50 per head for a regular shared trip. Kapag "special trip" or inarkila mo yung buong tricycle, it ranges from ₱200 to ₱300 depending on the drop-off point sa Boac town proper.'
  },
  {
    category: 'general',
    question: 'Ano ang pinaka-magandang beach sa Marinduque na hindi crowded?',
    answer: 'Poctoy White Beach sa Torrijos is the most famous, but it can get crowded during summer. Kung gusto mo ng quiet and relaxing vibe, try booking a boat to Maniwaya Island or Palad Sandbar in Santa Cruz. Sobrang clear ng water at perfect for island hopping!'
  },
  {
    category: 'general',
    question: 'Saan masarap kumain ng seafood around Santa Cruz?',
    answer: 'Maraming hidden gems malapit sa Buyabod Port. You can buy fresh catch of the day directly from the palengke and ask nearby carinderias to "paluto" (cook it for you). Check our Food & Dining directory para sa mga top-rated local spots.'
  },
  {
    category: 'general',
    question: 'May signal ba ng Globe at Smart sa mga resorts?',
    answer: 'Yes, major towns like Boac, Gasan, and Santa Cruz have strong 4G/LTE signal for both networks. However, expect some dead spots kapag pumunta ka inland or sa malalayong beaches. Maganda ring i-download offline yung maps sa phone mo.'
  }
];

async function insertFaqs() {
  const { error } = await supabase.from('faqs').insert(taglishFaqs);
  if (error) {
    console.error('Error inserting FAQs:', error);
  } else {
    console.log('Successfully inserted Taglish FAQs!');
  }
}

insertFaqs();
