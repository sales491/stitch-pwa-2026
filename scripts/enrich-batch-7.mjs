import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const enrichments = [
  {
    name: "Boac Cathedral (Immaculate Conception Parish)",
    description: "A historic fortress-style stone church completed in 1792. Declared an Important Cultural Property, it serves as the spiritual heart of Marinduque and houses the venerated image of Our Lady of Prompt Succor. A significant landmark for both history buffs and pilgrims.",
    social_media: { facebook: "facebook.com/icpboac/" },
    location: "Boac",
    business_type: "Historical Landmark / Church"
  },
  {
    name: "Rejano's Bakery",
    description: "The home of Marinduque's most iconic delicacy—the Arrowroot (Uraro) cookies. Located in Santa Cruz, Rejano's is a pioneering establishment that has put local treats on the national map. A must-visit stop for every traveler looking for authentic Marinduque pasalubong.",
    location: "Santa Cruz",
    business_type: "Bakery / Pasalubong"
  },
  {
    name: "Poctoy White Beach Entrance & Registration",
    description: "The primary entry point to Torrijos' famous one-kilometer white sand beach. Environmental/Entrance fees are typically ₱25-₱50. Features public cottages, crystal-clear waters, and a direct view of Mt. Malindig. Perfect for day-trips and seaside gatherings.",
    contact_info: { phone: "0998 416 0903" },
    location: "Torrijos",
    business_type: "Public Beach / Park"
  },
  {
    name: "Mt. Malindig Registration Hub (Barangay Sihi)",
    description: "The official registration point for trekkers looking to reach the highest peak in Marinduque. Located in Buenavista, Barangay Sihi officials assist with climbing permits and assigned local guides. [Important: Registration is mandatory for all hikers].",
    location: "Buenavista",
    business_type: "Trekking Service"
  },
  {
    name: "Marinduque Provincial Capitol",
    description: "A stunning neo-classical government building completed in 1928 during the American colonial era. It stands as a symbol of the province's independent history and is home to the central administrative offices of the Marinduque Provincial Government.",
    contact_info: { website: "marinduque.gov.ph" },
    location: "Boac",
    business_type: "Government Building"
  },
  {
    name: "Santa Cruz Municipal Hall",
    description: "The administrative center of Marinduque's largest municipality. Located in the Poblacion area, it handles all local government services for the eastern part of the island. Contact: municipalityofsantacruz@yahoo.com.",
    contact_info: { phone: "0949-996-7911" },
    location: "Santa Cruz",
    business_type: "Government Office"
  },
  {
    name: "Torrijos Municipal Hall",
    description: "The primary government service hub for the southeastern municipality of Torrijos. A key contact point for tourism inquiries related to Poctoy White Beach and Mt. Malindig adventures. Contact: (042) 753-0038.",
    location: "Torrijos",
    business_type: "Government Office"
  },
  {
    name: "Santa Cruz Public Market",
    description: "The leading commercial trading hub for the eastern district. A bustling center where you can find fresh produce, fish from the Tayabas Bay, and local Marinduque snacks at competitive prices. Best visited early in the morning.",
    location: "Santa Cruz",
    business_type: "Public Market"
  }
];

async function enrich() {
    let count = 0;
    for (const e of enrichments) {
        const { data: current } = await supabase.from('business_profiles')
            .select('id, contact_info, social_media')
            .ilike('business_name', `%${e.name.split(' (')[0]}%`)
            .maybeSingle();
        
        if (current) {
            const updatedContact = { ...current.contact_info, ...e.contact_info };
            const updatedSocial = { ...current.social_media, ...e.social_media };

            const { error: updateError } = await supabase.from('business_profiles').update({
                description: e.description,
                operating_hours: e.operating_hours || null,
                contact_info: updatedContact,
                social_media: updatedSocial,
                location: e.location,
                business_type: e.business_type
            }).eq('id', current.id);

            if (!updateError) {
                console.log(`Enriched existing: ${e.name}`);
                count++;
            }
        } else {
            const { error: insertError } = await supabase.from('business_profiles').insert([{
                business_name: e.name,
                description: e.description,
                operating_hours: e.operating_hours || null,
                contact_info: e.contact_info || {},
                social_media: e.social_media || {},
                location: e.location,
                business_type: e.business_type,
                is_verified: true,
                owner_id: "7da9eb71-7757-4335-97c3-34eb40e4f34a",
                verification_status: "verified"
            }]);

            if (!insertError) {
                console.log(`Added missing Elite: ${e.name}`);
                count++;
            } else {
                console.error(`Error adding ${e.name}:`, insertError.message);
            }
        }
    }
    console.log(`Successfully processed ${count} businesses in Batch 7.`);
}

enrich();
