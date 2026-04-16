import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const enrichments = [
  {
    name: "Tahanan sa Isok",
    description: "A premier garden hotel in Boac offering a tranquil and comfortable stay. Tahanan sa Isok features a refreshing swimming pool, lush gardens, and an on-site restaurant serving local favorites. Within walking distance to the town's historic landmarks.",
    contact_info: { phone: "(042) 332-1231", website: "tahanansaisok.com" },
    location: "Boac",
    business_type: "Hotel / Resort"
  },
  {
    name: "Eomma's K-Grill Samgyupsal House",
    description: "The most popular Korean BBQ destination in Boac. Known for its high-quality pork and beef samgyupsal, savory side dishes, and relaxing atmosphere. With a 4.8/5 rating, it's a top choice for meat lovers and groups.",
    location: "Boac",
    business_type: "Restaurant (Korean BBQ)"
  },
  {
    name: "Cafe Mauro",
    description: "A charming heritage cafe located in a classic ancestral house in Boac. Known for its authentic Marinduque atmosphere, it serves traditional coffee, snacks, and local delicacies in a setting that feels like a step back in time.",
    location: "Boac",
    business_type: "Heritage Cafe"
  },
  {
    name: "Katala Beach Resort",
    description: "A beautiful beachfront getaway in Brgy. Bacong-Bacong, Gasan. Offers cozy seaside accommodations, an in-house restaurant, and spectacular views of the Tres Reyes Islands, especially during the sunset golden hour.",
    contact_info: { phone: "+63 915 512 4784" },
    location: "Gasan",
    business_type: "Resort"
  },
  {
    name: "DFTE (Don't Forget to Eat)",
    description: "A trendy and hip dining spot in Boac famous for its gourmet burgers, oversized pizzas, and creative beverages. DFTE is the town's favorite hangout for the younger generation and foodies seeking bold, modern flavors.",
    location: "Boac",
    business_type: "Restaurant (Burgers/Pizza)"
  },
  {
    name: "Palm Beach Resort",
    description: "A quiet and relaxing resort located in the scenic Balanacan area of Mogpog. Offering direct beach access and a peaceful environment near the Balanacan harbor, it's perfect for travelers seeking a nature-focused retreat.",
    contact_info: { phone: "0915-567-9085" },
    location: "Mogpog",
    business_type: "Resort"
  },
  {
    name: "Rezidencia Faeldo Resort and Cafe",
    description: "A unique farm-stay and cafe in Gasan that emphasizes a 'farm-to-table' experience. Guests can enjoy organic meals made from locally sourced ingredients in a lush, green environment that celebrates Marinduque's agricultural roots.",
    location: "Gasan",
    business_type: "Farm Resort / Cafe"
  },
  {
    name: "10 y.o. Cafe",
    description: "A popular central cafe located right in the heart of Boac's plaza area. Known for its wide array of coffee blends, refreshing iced drinks, and light snacks, it's a convenient and bustling meeting point for locals and visitors.",
    location: "Boac",
    business_type: "Cafe"
  },
  {
    name: "Abingara Cafe & Restaurant",
    description: "A boutique coastal dining experience in Gasan. Offering a curated menu of fresh seafood and international cafe favorites, Abingara is known for its intimate setting and being a hidden gem for romantic seaside dinners.",
    location: "Gasan",
    business_type: "Boutique Restaurant"
  },
  {
    name: "Tito Pancho's",
    description: "An established institution in Boac's dining scene. Tito Pancho's is famous for its consistent quality, traditional Filipino hospitality, and authentic local recipes that have made it a household name in the capital for generations.",
    location: "Boac",
    business_type: "Restaurant (Filipino)"
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
    console.log(`Successfully processed ${count} businesses in Batch 8.`);
}

enrich();
