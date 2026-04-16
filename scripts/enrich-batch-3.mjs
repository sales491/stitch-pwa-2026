import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const enrichments = [
  {
    name: "Minido Preschool ",
    description: "A DepEd-recognized early childhood education center in Boac, Marinduque. Minido is dedicated to providing a nurturing and creative learning environment for young learners, focusing on holistic development and academic excellence.",
    social_media: { facebook: "Minido Preschool" },
    location: "Boac",
    business_type: "Preschool"
  },
  {
    name: "Nine Balconies Island stay",
    description: "A boutique guesthouse located in the heart of Boac at Nepomuceno corner Lardizabal St. Known for its serene ambiance, it offers nine uniquely designed rooms with private balconies, personalized service, and an on-site cafe.",
    social_media: { facebook: "Nine Balconies Island Stay" },
    location: "Boac",
    business_type: "Hotel"
  },
  {
    name: "Curba Grill",
    description: "A popular artsy restaurant in Boac known for its rustic, vintage-inspired decor. Famous for its generous servings of Calamares, signature burgers, and roasted chicken, it provides a warm, homey atmosphere for families and friends.",
    social_media: { facebook: "Curba Grill" },
    location: "Boac",
    business_type: "Restaurant"
  },
  {
    name: "R&R Bistro",
    description: "A chic and modern bistro in Boac offering a contemporary take on local favorites and international cafe fare. Popular for its specialty coffee and intimate dining setting, it's a premier spot for food enthusiasts in the capital.",
    social_media: { facebook: "R&R Bistro" },
    location: "Boac",
    business_type: "Bistro / Cafe"
  },
  {
    name: "Phil-oil Boac",
    description: "A reliable petroleum provider in Boac, ensuring high-quality fuel and friendly service to the Marinduque community. A key pit-stop along the provincial road for both local commuters and travelers.",
    location: "Boac",
    business_type: "Gas Station"
  },
  {
    name: "Chenggey's Cafe",
    description: "A charming local cafe offering specialty coffee, home-baked pastries, and a relaxed atmosphere. It's a favorite neighborhood spot in Boac for morning brews and quiet afternoon treats.",
    social_media: { facebook: "Chenggey's Cafe" },
    location: "Boac",
    business_type: "Cafe"
  },
  {
    name: "Little Shop of Flowers",
    description: "Located in Barangay Murallon, Boac, this florist provides beautiful, fresh arrangements for all occasions. Known for creative floral designs and door-to-door delivery across Marinduque.",
    social_media: { facebook: "Little Shop of Flowers Marinduque" },
    location: "Boac",
    business_type: "Florist"
  }
];

async function enrich() {
    let count = 0;
    for (const e of enrichments) {
        // Try to update first
        const { data: current, error: fetchError } = await supabase.from('business_profiles')
            .select('id, contact_info, social_media')
            .eq('business_name', e.name)
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
            } else {
                console.error(`Error updating ${e.name}:`, updateError.message);
            }
        } else {
            // Upsert / Insert new Elite business if missing
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
    console.log(`Successfully processed ${count} businesses in Batch 3.`);
}

enrich();
