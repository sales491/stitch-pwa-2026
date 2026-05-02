import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const taglishFaqs = [
  // Food & Dining / Cafes
  {
    category: 'general',
    question: 'Saan may cafe sa Boac na mabilis ang internet pang work-from-home?',
    answer: 'Kung kailangan mo ng reliable WiFi at magandang ambiance pang-work or study, you should check out the local cafes in Boac town proper. Maraming nag-ooffer ng free WiFi para sa customers. You can search our "Cafe" directory para makita ang mga top spots.'
  },
  {
    category: 'general',
    question: 'Saan masarap mag-dinner sa Gasan na budget-friendly?',
    answer: 'Gasan has great options for budget-friendly meals! Pwede kang pumunta sa mga local eateries near the Gasan Baywalk or try the ihaw-ihaw stands in the evening. Check our "Restaurant" directory to find affordable places to eat.'
  },
  {
    category: 'general',
    question: 'May open pa bang kainan or fast food sa gabi around Mogpog?',
    answer: 'Most establishments in Mogpog close early, usually around 8 PM. Kung inabot ka ng gabi, you might need to head towards Boac town proper where some convenience stores and select cafes operate later. Visit our directory and filter by "Open Now" kung may emergency cravings ka.'
  },
  // Accommodation
  {
    category: 'general',
    question: 'Saan may murang transient house sa Santa Cruz para sa barkada?',
    answer: 'Yes! Maraming affordable transient houses near Buyabod Port or along the coast of Santa Cruz perfect for large groups. Mas maganda mag-book nang maaga lalo na kung summer or Holy Week. Browse our "Accommodation" section for direct contact numbers.'
  },
  {
    category: 'general',
    question: 'Pwede ba magdala ng dog sa mga beach resort sa Torrijos?',
    answer: 'Some resorts along Poctoy White Beach allow pets, but they usually require that dogs are leashed in common areas and have a small pet fee. Always call the resort beforehand to confirm. Pwede mong makuha ang contact info nila sa aming directory.'
  },
  // Retail, Hardware, & Services
  {
    category: 'general',
    question: 'Saan makakabili ng construction supplies na nagde-deliver sa Gasan?',
    answer: 'May mga hardware stores both in Boac and Gasan na nag-ooffer ng delivery service for bulk construction supplies like cement and plywood. Para sure, check the "Construction / Hardware" category in our directory to call them directly.'
  },
  {
    category: 'general',
    question: 'Saan may magandang salon for hair rebonding sa Boac?',
    answer: 'Boac has several highly-rated beauty salons offering hair rebonding, coloring, and spa services. Look up "Salon" or "Services" sa aming directory to read reviews and book an appointment with local stylists.'
  },
  // Ports & RoRo Schedules
  {
    category: 'general',
    question: 'Magkano ang bayad kapag magpapasakay ng motor sa RoRo pa-Marinduque?',
    answer: 'For a standard motorcycle (2-wheels), the rolling cargo fee ranges from ₱500 to ₱800 on Montenegro or Starhorse ferries, plus terminal fees. Note that the driver usually still has to pay for a passenger ticket. Always check our "Ports" page for the latest updates.'
  },
  {
    category: 'general',
    question: 'Kailangan ba mag-book in advance ng ticket sa Montenegro or Starhorse kapag Holy Week?',
    answer: 'Absolutely yes! Sobrang haba ng pila sa Dalahican Port during the Moriones Festival. It is highly recommended to book online if possible or arrive at the port at least 4-6 hours before your desired trip. Visit our "Ports" and "Ferry Schedule" pages to plan ahead.'
  },
  // Commute & Transport
  {
    category: 'general',
    question: 'Saan ang terminal ng jeep sa Boac papuntang Torrijos at hanggang anong oras?',
    answer: 'Ang main jeepney terminal sa Boac ay malapit sa public market. Ang mga biyahe pa-Torrijos usually run from early morning hanggang around 4:00 PM or 5:00 PM lang. Kapag naubusan ka ng jeep, you might need to rent a special tricycle trip or van. Check our "Commute" page for more info.'
  },
  {
    category: 'general',
    question: 'Bukas na ba ang Marinduque airport para sa flights from Manila?',
    answer: 'Currently, the Marinduque Airport in Gasan is closed to major commercial airlines like Cebu Pacific. Ang pinaka-reliable na way to get here right now is via Bus + RoRo ferry from Lucena. Check our "Manila to Marinduque Guide" for step-by-step travel tips.'
  },
  // Palengke
  {
    category: 'general',
    question: 'Anong oras pinakamaganda pumunta sa Buyabod palengke para sa fresh isda?',
    answer: 'The best time to catch the freshest seafood in Buyabod Port, Santa Cruz is very early in the morning around 5:00 AM to 7:00 AM. Ito yung oras na dumarating ang mga mangingisda galing laot. Check out our "Palengke" section for daily market updates.'
  },
  {
    category: 'general',
    question: 'Saan makakabili ng legit na uraro cookies pang-pasalubong?',
    answer: 'Uraro (arrowroot) cookies are the ultimate Marinduque pasalubong! You can find the best and most authentic ones in local bakeries in Boac or at souvenir shops near the Balanacan Port. Search "Souvenirs" or "Pasalubong" sa ating directory.'
  },
  // Jobs
  {
    category: 'general',
    question: 'Paano mag-apply ng trabaho sa mga resorts dito sa Marinduque?',
    answer: 'Many local resorts frequently hire for front desk, housekeeping, and kitchen staff especially before the summer peak season. You can check our "Jobs" board or search for "Accommodation" sa directory to contact the resorts directly for vacancies.'
  }
];

async function insertFaqs() {
  const { error } = await supabase.from('faqs').insert(taglishFaqs);
  if (error) {
    console.error('Error inserting FAQs:', error);
  } else {
    console.log('Successfully inserted new batch of Taglish FAQs!');
  }
}

insertFaqs();
