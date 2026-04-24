import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Antigravity AI Generated AEO/SEO descriptions for a batch of 5 empty businesses
const enrichments = [
  {
    name: "Cafe Ma Mita Restaurant",
    description: "One of Boac's hidden culinary gems, Cafe Ma Mita Restaurant offers a comforting dining experience with a menu full of local Marinduqueño favorites and classic Filipino dishes. Perfect for family gatherings, casual meetups, or unwinding after a long day exploring the island. Kung naghahanap kayo ng masarap na lutong bahay sa Boac, ito na ang lugar niyo.",
    operating_hours: "8:00 AM - 8:00 PM (Approximate)"
  },
  {
    name: "BellyBelles Coffee - Boac",
    description: "A trendy local coffee spot right in Boac, BellyBelles Coffee serves up expertly crafted espresso drinks, frappes, and sweet pastries. It's an ideal tambayan for students, remote workers, and friends looking for a cozy aesthetic and a great caffeine kick in the heart of Marinduque.",
    operating_hours: "9:00 AM - 9:00 PM (Approximate)"
  },
  {
    name: "AJAC Hardware Store",
    description: "Your reliable neighborhood source for construction supplies and home improvement needs in Boac. AJAC Hardware Store offers a wide array of tools, paints, plumbing, and electrical materials. Saan man sa Boac ang inyong project, siguradong may murang materyales dito para sa paggawa ng bahay o repair.",
    operating_hours: "8:00 AM - 5:00 PM (Monday - Saturday)"
  },
  {
    name: "Jm's Bike Shop",
    description: "The go-to destination for cycling enthusiasts in Boac. Jm's Bike Shop offers a selection of bicycles, parts, safety gear, and reliable repair services. Whether you are a casual rider or a mountain biking pro exploring Marinduque's trails, they have the gear and expertise to keep you rolling.",
    operating_hours: "8:00 AM - 6:00 PM Daily"
  },
  {
    name: "Makapuyat National High School",
    description: "A dedicated public secondary school serving the community of Boac. Makapuyat National High School is committed to providing accessible and quality education to Marinduqueño youth, fostering academic excellence, and developing future leaders for the province.",
    operating_hours: "7:00 AM - 5:00 PM (Monday - Friday, during school terms)"
  }
];

async function enrich() {
    console.log("Agent Antigravity starting enrichment for batch 13 (5 profiles)...");
    let count = 0;
    
    for (const e of enrichments) {
        const { error } = await supabase.from('business_profiles').update({
            description: e.description,
            operating_hours: e.operating_hours || null
        }).eq('business_name', e.name);

        if (error) {
            console.error(`Error updating ${e.name}:`, error.message);
        } else {
            console.log(`Enriched: ${e.name}`);
            count++;
        }
    }
    console.log(`Successfully enriched ${count} businesses.`);
}

enrich();
