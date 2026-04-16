import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const enrichments = [
  {
    name: "Maniwaya Island & Palad Sandbar Tours",
    description: "The premier island-hopping destination in Marinduque. Famous for its pristine white sand beach, the mystical Palad Sandbar that appears at low tide, and vibrant turquoise waters. A must-visit hub for snorkelers and beach lovers.",
    location: "Santa Cruz (Offshore)",
    business_type: "Tourism / Boat Services"
  },
  {
    name: "Luzon Datum of 1911 (Station Balanacan)",
    description: "Known as the primary geodetic reference point of the Philippines. This national landmark offers breathtaking panoramic views of the Balanacan coastline and is a significant site for both history and geography enthusiasts.",
    location: "Mogpog",
    business_type: "Historical Landmark"
  },
  {
    name: "Islas Moriones Beach Resort",
    description: "A well-regarded beachfront resort in Santa Cruz, providing an ideal base for exploring Maniwaya Island. Offers comfortable accommodations with a relaxing seaside vibe and authentic local hospitality.",
    location: "Santa Cruz",
    business_type: "Resort"
  },
  {
    name: "D' Arco Resort",
    description: "A favored budget-friendly resort in Santa Cruz known for its relaxed atmosphere and family-friendly amenities. A popular choice for local staycations and travelers seeking a peaceful coastal retreat.",
    location: "Santa Cruz",
    business_type: "Resort"
  },
  {
    name: "Bricks & Coals",
    description: "A modern smokehouse and pizzeria in Boac. Bricks & Coals is celebrated for its wood-fired pizzas, slow-cooked meats, and industrial-chic atmosphere, making it a top-rated dinner destination.",
    location: "Boac",
    business_type: "Restaurant (Pizza/Smokehouse)"
  },
  {
    name: "Tanawin Cafe & Glamping",
    description: "Torrijos' most famous viewpoint cafe offering stunning 360-degree vistas of the mountains and sea. Known for its creative local menu and unique glamping experience high above the clouds.",
    location: "Torrijos",
    business_type: "Cafe / Glamping"
  },
  {
    name: "Precision Diagnostics and Medical Clinic",
    description: "A leading private medical utility in Boac. Providing comprehensive laboratory tests, X-ray, and clinical services with modern equipment and professional healthcare staff.",
    contact_info: { address: "Nepomuceno St., San Miguel" },
    location: "Boac",
    business_type: "Medical Clinic / Diagnostic"
  },
  {
    name: "LBC Express - Boac Branch",
    description: "The province's primary courier and remittance link. Offering reliable domestic and international shipping, money transfers, and bills payment services centrally located in the capital.",
    contact_info: { address: "Gov. D. Reyes St., Murallon" },
    location: "Boac",
    business_type: "Logistics / Remittance"
  },
  {
    name: "J&T Express Boac-1",
    description: "A fast and efficient courier service located in the heart of Boac. Essential for E-commerce sellers and residents for reliable door-to-door delivery and parcel drop-off services across the island.",
    location: "Boac",
    business_type: "Logistics"
  },
  {
    name: "MR.DIY Santa Cruz",
    description: "The major general merchandise and hardware hub for the eastern district. Offering a vast selection of home improvement tools, kitchenware, and household essentials at affordable prices.",
    location: "Santa Cruz",
    business_type: "General Merchandise / Hardware"
  }
];

async function enrich() {
    let count = 0;
    for (const e of enrichments) {
        const { data: current } = await supabase.from('business_profiles')
            .select('id, contact_info, social_media')
            .ilike('business_name', `%${e.name.split(' (')[0].split(' - ')[0]}%`)
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
    console.log(`Successfully processed ${count} businesses in Batch 9.`);
}

enrich();
