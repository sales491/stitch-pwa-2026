import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const enrichments = [
  {
    name: "Beach Club Cagpo",
    description: "A serene beachfront retreat in Cagpo offering panoramic views of the Sibuyan Sea. Features an on-site bar and restaurant serving fresh local seafood in a tranquil, secluded environment.",
    location: "Torrijos",
    business_type: "Beach Resort",
    contact_info: { website: "https://beachclubcagpo.com" }
  },
  {
    name: "Poctoy White Beach",
    description: "The most famous public beach in Marinduque, known for its fine white sand and crystal-clear waters. A perfect spot for swimming, picnics, and viewing MT. Malindig's majestic silhouette from across the bay.",
    location: "Torrijos",
    business_type: "Beach / Landmark"
  },
  {
    name: "Wawie's Beach Resort",
    description: "A popular mid-tier beach resort at Poctoy White Beach. Offers affordable cottages, friendly service, and a prime location for those wanting to wake up to the sound of waves on the island's premier white sand beach.",
    location: "Torrijos",
    business_type: "Beach Resort"
  },
  {
    name: "Pulang Lupa Historical Monument",
    description: "Site of the historic Battle of Pulang Lupa (1900), where Filipino revolutionaries defeated American forces. The monument offers spectacular views of the province and serves as a vital historical landmark.",
    location: "Torrijos",
    business_type: "Historical Landmark"
  },
  {
    name: "Malbog Sulfur Hot Spring",
    description: "A natural therapeutic spring at the foot of Mt. Malindig. Famous for its sulfur-rich waters believed to heal skin conditions and provide deep muscle relaxation in a rustic, verdant setting.",
    location: "Buenavista",
    business_type: "Wellness / Hot Spring"
  },
  {
    name: "Mount Malindig",
    description: "The highest peak in Marinduque (1,157m), this dormant stratovolcano is the premier destination for hikers and nature lovers. Offers lush mossy forests and breathtaking 360-degree views of the archipelago.",
    location: "Buenavista",
    business_type: "Hiking / Landmark"
  },
  {
    name: "Elephant Island",
    description: "A scenic island off the coast of Buenavista, known for its distinct shape and crystal-clear surrounding waters. A popular spot for coastal sightseeing and photography near the Malbog area.",
    location: "Buenavista",
    business_type: "Natural Landmark"
  },
  {
    name: "Curba Grill (Buenavista)",
    description: "The southern branch of Marinduque's home-grown grill house. Serving local favorites and comfort food in a relaxed, friendly environment. A go-to spot for both locals and travelers in Buenavista.",
    location: "Buenavista",
    business_type: "Restaurant"
  }
];

async function enrich() {
    let count = 0;
    for (const e of enrichments) {
        // Broaden search to find misclassified ones (e.g. Cagpo listed in Gasan)
        const searchName = e.name.split(' (')[0].split(' - ')[0];
        const { data: current } = await supabase.from('business_profiles')
            .select('id, contact_info, social_media, location')
            .ilike('business_name', `%${searchName}%`)
            .maybeSingle();
        
        if (current) {
            // If location was wrong (e.g. Gasan for Cagpo), we correct it
            const locationUpdate = (current.location !== e.location) ? { location: e.location } : {};
            
            const updatedContact = { ...current.contact_info, ...e.contact_info };
            const updatedSocial = { ...current.social_media, ...e.social_media };

            const { error: updateError } = await supabase.from('business_profiles').update({
                description: e.description,
                operating_hours: e.operating_hours || null,
                contact_info: updatedContact,
                social_media: updatedSocial,
                business_type: e.business_type,
                is_verified: true,
                verification_status: "verified",
                ...locationUpdate
            }).eq('id', current.id);

            if (!updateError) {
                console.log(`Enriched existing: ${e.name}${locationUpdate.location ? ` (Corrected to ${e.location})` : ''}`);
                count++;
            } else {
                console.error(`Error updating ${e.name}:`, updateError.message);
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
    console.log(`Successfully processed ${count} businesses in Batch 12.`);
}

enrich();
