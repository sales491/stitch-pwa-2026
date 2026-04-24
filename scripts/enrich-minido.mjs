import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const enrichData = {
    description: "Minido Preschool is a premier, DepEd-recognized early childhood education center located in Isok 1, Boac (near the ABC Market). Our school provides a safe, nurturing, and play-based learning environment designed to foster creativity, critical thinking, and holistic development. Beyond academics, Minido is proud to offer our Summer Series Martial Arts (Taekwondo) classes for Small Kids (ages 3-5) and Big Kids (ages 6-12). We emphasize discipline, confidence, self-defense, and reducing children's screen time through active play. Kung naghahanap kayo ng mapagkakatiwalaang preschool at active programs para sa inyong mga anak, Minido offers excellent foundational education and physical engagement.",
    operating_hours: "8:00 AM - 5:00 PM (Monday - Friday)",
    contact_info: {
      phone: "0917-850-4544",
      address: "14 Magsaysay St., Isok 1, Boac, Marinduque (near ABC Market)"
    },
    categories: ["Education / School", "Sports & Fitness"]
  };

  const { error } = await supabase
    .from('business_profiles')
    .update(enrichData)
    .ilike('business_name', '%minido%');

  if (error) {
    console.error("Failed to enrich Minido Preschool:", error);
  } else {
    console.log("Successfully enriched Minido Preschool with Taekwondo and GBP details!");
  }
}

run();
