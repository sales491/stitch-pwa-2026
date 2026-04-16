import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const enrichments = [
  {
    name: "Hotel Zenturia",
    description: "A modern 3-star hotel located in the heart of Boac. Hotel Zenturia offers spacious, air-conditioned rooms, an on-site spa, and a rooftop restaurant with city views. Ideal for business travelers and tourists exploring the capital.",
    contact_info: { phone: "+63 917 305 2689", email: "hotel.zenturia@gmail.com" },
    location: "Boac",
    business_type: "Hotel"
  },
  {
    name: "Kusina sa Plaza",
    description: "A beloved culinary landmark in Boac known for its authentic Filipino 'Luton-bahay' (home-cooked) meals. Famous for its kare-kare, crispy pata, and specialty pizzas, served in a warm, garden-inspired setting across the museum.",
    operating_hours: "Daily: 7:00 AM - 6:00 PM",
    contact_info: { phone: "+63 42 332 1699" },
    location: "Boac",
    business_type: "Restaurant"
  },
  {
    name: "Café Mamita (Boac Hotel)",
    description: "A walk down memory lane, this historic restaurant inside Boac Hotel features retro-vintage decor and serves traditional Filipino comfort food. Famous for its 'manakla' (local crayfish) and being a home for local 'urarò' cookies.",
    location: "Boac",
    business_type: "Heritage Restaurant"
  },
  {
    name: "Freedom Eco Adventure Park by Cocotel",
    description: "An eco-adventure gateway in Boac offering a blend of relaxation and outdoor fun. Features multiple swimming pools, massage services, and a serene garden environment. A top-rated destination for family staycations.",
    location: "Boac",
    business_type: "Eco Resort"
  },
  {
    name: "Cavesera Residencia Farm and Resort",
    description: "A unique and tranquil farm-resort in Santa Cruz featuring igloo-style accommodations and lush green surroundings. Perfect for those seeking a quiet, nature-focused retreat with pool access and farm-to-table vibes.",
    contact_info: { phone: "+63 917 630 7407" },
    location: "Santa Cruz",
    business_type: "Farm Resort"
  },
  {
    name: "Balanacan Port Terminal",
    description: "The primary maritime gateway to Marinduque. Serving RORO ferries from Lucena (Starhorse & Montenegro lines). The terminal offers local food stalls, ticketing offices, and is famous for the stunning fjord-like view of the harbor.",
    location: "Mogpog",
    business_type: "Transportation Hub"
  },
  {
    name: "Marinduque Airport (Gasan)",
    description: "The province's only airport, located in Brgy. Masiga. It serves general aviation and occasional commercial flights, providing a vital air link for the island's residents and cargo services to metropolitan Manila.",
    contact_info: { phone: "(042) 333-7001" },
    location: "Gasan",
    business_type: "Airport"
  },
  {
    name: "Buyabod Port (Gateway to Maniwaya)",
    description: "The essential jump-off point for Maniwaya Island adventures. Public boats typically depart at 7 AM and 11:30 AM (₱70-₱80). The port area features local eateries and boat charter services for island hopping.",
    location: "Santa Cruz",
    business_type: "Seaport"
  },
  {
    name: "Santa Cruz District Hospital",
    description: "A secondary government healthcare facility in Santa Cruz. Providing essential inpatient and outpatient medical services to the eastern municipalities of Marinduque with PhilHealth-accredited services.",
    location: "Santa Cruz",
    business_type: "Hospital"
  },
  {
    name: "Villa Atilana Maniwaya",
    description: "A popular beachfront sanctuary on Maniwaya Island. Villa Atilana is highly recommended for its clean, beachfront cottages, vibrant group activities, and its prime location for sunset watching and bonfire nights.",
    location: "Santa Cruz (Maniwaya)",
    business_type: "Resort"
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
    console.log(`Successfully processed ${count} businesses in Batch 10.`);
}

enrich();
