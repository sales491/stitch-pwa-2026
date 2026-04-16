import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const enrichments = [
  {
    name: "Luxor Resort",
    description: "A serene Mediterranean-style beachfront resort in Pangi, Gasan. Known for its landscaped gardens, relaxing sea views, and comfortable chalets, it offers a peaceful island escape facing the Tres Reyes Marine Sanctuary.",
    social_media: { facebook: "Luxor Resort and Restaurant" },
    contact_info: { website: "luxormarinduque.com", phone: "(042) 332-0562" },
    location: "Gasan",
    business_type: "Resort"
  },
  {
    name: "Beach Club Cagpo",
    description: "A laid-back beachfront destination in Torrijos, perfect for nature lovers and group getaways. Home of 'Harry's Bar & Resto'—famous for its signature burgers—the club features a chill atmosphere, miniature golf, and cozy island-style rooms.",
    social_media: { facebook: "Beach Club Cagpo" },
    contact_info: { phone: "+63 961 432 4209", website: "beachclubcagpo.com" },
    location: "Torrijos",
    business_type: "Resort / Bar"
  },
  {
    name: "Curba Grill & Restobar Buenavista",
    description: "The artsy sibling of the Boac favorite, located in Buenavista. It offers the same rustic, homey vibe and budget-friendly grilled Filipino comfort food, making it a popular stop for road-trippers touring the south of the island.",
    location: "Buenavista",
    business_type: "Restaurant"
  },
  {
    name: "Wawie's Beach Resort",
    description: "A popular and lively resort on the front lines of Poctoy White Beach in Torrijos. Known for its accessibility and family-friendly atmosphere, it offers standard beach cottages and direct access to the finest white sand in Marinduque.",
    location: "Torrijos",
    business_type: "Resort"
  },
  {
    name: "Rendezvous Beach Resort",
    description: "Conveniently located at Poctoy White Beach, Torrijos. Rendezvous is a favorite for families and groups who enjoy cooking their own meals by the sea. It provides clean, straightforward accommodations with a stunning view of Mt. Malindig.",
    location: "Torrijos",
    business_type: "Resort"
  },
  {
    name: "Mercury Drug Store - Marinduque Boac Governor Damian Reyes Branch",
    description: "The primary pharmacy and health utility landmark in the capital. Providing a comprehensive range of medicines, medical supplies, and basic grocery items to the residents of Boac and surrounding towns.",
    contact_info: { website: "mercurydrug.com" },
    location: "Boac",
    business_type: "Pharmacy"
  },
  {
    name: "Blue Sea Resort",
    description: "A minimalist, tranquility-focused retreat in Gasan. Ideal for nature lovers and those seeking a quiet 'wild beach' experience away from the crowds. Perfect for beachcombing and long, contemplative walks by the sea.",
    location: "Gasan",
    business_type: "Resort"
  },
  {
    name: "Bellarocca Island Resort & Spa",
    description: "Formerly known as the 'Santorini of the Philippines', Bellarocca is a luxury landmark on Elephant Island in Buenavista. [NOTE: Currently Inactive] Its white-washed Mediterranean architecture remains an iconic symbol of Marinduque's luxury tourism history.",
    location: "Buenavista",
    business_type: "Resort (Inactive)"
  },
  {
    name: "A&B Beach Resort",
    description: "A cozy and affordable seaside staycation spot located along the Boac-Gasan road. Popular for its clean, private atmosphere and proximity to the capital, making it a convenient base for exploring both Boac and Gasan.",
    contact_info: { phone: "(042) 754-5823" },
    location: "Boac",
    business_type: "Resort"
  }
];

async function enrich() {
    let count = 0;
    for (const e of enrichments) {
        const { data: current } = await supabase.from('business_profiles')
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
    console.log(`Successfully processed ${count} businesses in Batch 5.`);
}

enrich();
