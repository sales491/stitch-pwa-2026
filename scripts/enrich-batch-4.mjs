import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const enrichments = [
  {
    name: "Goodchow Food Express",
    description: "Boac's beloved local fast-food icon. Known for its juicy chicken, signature gravy, and cheesy pizzas, it offers a diverse menu that rivals national chains. Features a cozy 3rd-floor air-conditioned dining area with a great view of the town.",
    operating_hours: "Mon-Sat: 8am-6pm, Sun: 8am-12pm",
    social_media: { facebook: "Goodchow Food Express Boac" },
    contact_info: { phone: "+63 42 754 0003" },
    location: "Boac",
    business_type: "Fast Food / Restaurant"
  },
  {
    name: "Doughboys Cafe & Bakeshop",
    description: "A premier artisan bakery and cafe in Boac. Doughboys is famous for its fresh-baked pastries, specialty breads, and high-quality coffee. It's a favorite spot for breakfast and afternoon snacks in a modern, welcoming setting.",
    social_media: { facebook: "Doughboys Cafe & Bakeshop" },
    location: "Boac",
    business_type: "Bakery / Cafe"
  },
  {
    name: "Adi's Resort Hotel and Restaurant",
    description: "A beautiful seaside resort in Boac offering quality accommodations and a relaxing tropical atmosphere. Perfect for family gatherings and events, Adi's is known for its friendly service and stunning sunset views over the Marinduque coastline.",
    contact_info: { email: "adisresort@gmail.com", phone: "+63 997 415 4059" },
    location: "Boac",
    business_type: "Resort / Hotel"
  },
  {
    name: "BFC Restaurant (Boac Food Corner)",
    description: "An established culinary landmark in Boac since 1996. With the motto 'Life tastes better with BFC', this cozy spot offers big flavors in a modest setting, serving a wide variety of Filipino favorites and cafe specialties.",
    operating_hours: "Daily: 8am-6pm",
    contact_info: { phone: "+63 916 435 8799" },
    location: "Boac",
    business_type: "Restaurant / Cafe"
  },
  {
    name: "Duo Brew - Canovas St., Isok 1 Boac Branch",
    description: "A modern, trendy coffee shop in Boac catering to the digital generation. Offering specialty brews, a quiet workspace, and a selection of curated snacks, it's the ideal spot for students and professionals alike.",
    social_media: { facebook: "Duo Brew Boac" },
    location: "Boac",
    business_type: "Coffee Shop"
  },
  {
    name: "Marketpoint Hotel",
    description: "The primary hotel in Mogpog, conveniently located near the town market. It features modern amenities including a swimming pool, bar, and fitness center, making it the top choice for travelers staying in the northern part of the province.",
    location: "Mogpog",
    business_type: "Hotel"
  },
  {
    name: "Poblacion Pares Atbp.",
    description: "The go-to spot for authentic Filipino Pares in Mogpog. This busy local eatery is famous for its savory beef stew and generous servings, providing a true taste of local street-food culture in a clean, welcoming environment.",
    location: "Mogpog",
    business_type: "Eatery"
  },
  {
    name: "Hilltop Hotel",
    description: "Situated in Brgy. Mataas na Bayan, Mogpog, this hotel offers peaceful lodging with panoramic views of the town. A quiet retreat for those looking to stay slightly away from the center while remaining close to Mogpog's landmarks.",
    contact_info: { phone: "0907-675-9412" },
    location: "Mogpog",
    business_type: "Hotel"
  },
  {
    name: "1Stop Business Center Remittance Inc.",
    description: "A vital service hub in Boac and Mogpog, providing essential remittance, payment, and business support services. Known for its speed and reliability, it serves as a central point for the local community's daily financial needs.",
    location: "Boac",
    business_type: "Business Services"
  },
  {
    name: "A-Risha General Merchandise - Sta Cruz Branch",
    description: "A major retail destination in Santa Cruz, providing a wide array of home goods, hardware, and essential supplies. Known for its extensive inventory and being a one-stop-shop for the eastern part of Marinduque.",
    location: "Santa Cruz",
    business_type: "General Merchandise"
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
                social_media: updatedSocial
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
    console.log(`Successfully processed ${count} businesses in Batch 4.`);
}

enrich();
