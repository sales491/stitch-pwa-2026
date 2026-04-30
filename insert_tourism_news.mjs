import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const env = readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...vParts] = line.split('=');
  if (k && vParts.length > 0) {
    acc[k.trim()] = vParts.join('=').trim().replace(/^["']|["']$/g, '');
  }
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const article = {
    slug: 'marinduque-tourism-push-2026',
    title: 'Marinduque Tourism Push 2026: Beyond Moryonan, Local Festivals, and The Loop',
    summary: 'Marinduque is expanding its tourism appeal for 2026, highlighting year-round attractions, vibrant local town festivals, and scenic motorcycle and bicycling routes.',
    image_url: 'https://images.unsplash.com/photo-1629837926210-908006b0d91d?q=80&w=1200&auto=format&fit=crop', // A tropical beach/road placeholder
    content: `
      <p>As of April 2026, Marinduque’s tourism officials are launching new initiatives to showcase the island province as a premier, year-round destination. Historically famous for its Moriones Lenten Rites, the province is now pivoting to highlight its rich natural attractions, diverse cultural celebrations, and growing appeal to adventure seekers.</p>

      <h2>The "Beyond Moryonan" Tourism Push</h2>
      <p>Provincial tourism officials, including the Provincial Tourism and Cultural Office, are actively promoting Marinduque's appeal outside of the Holy Week season. The "Beyond Moryonan" campaign aims to draw attention to the island's unspoiled beaches, mountain landscapes, and historical landmarks. A major focal point of this campaign is the <strong>Luzon Datum of 1911</strong> in Balanacan, Mogpog, which officially marks Marinduque as the geographic "Heart of the Philippines."</p>

      <h2>Highlighting Diverse Local Festivals</h2>
      <p>To ensure a steady stream of cultural events throughout the year, the province is heavily promoting its variety of town-specific festivals. These vibrant celebrations offer tourists unique experiences tailored to the local livelihoods and traditions of each municipality:</p>
      <ul>
        <li><strong>Bila-bila Festival (Boac):</strong> A celebration honoring butterflies, reflecting the town's vibrant local culture.</li>
        <li><strong>Kangga Festival (Mogpog):</strong> A tribute to the farmers and the bountiful harvest, highlighted by sleds (kangga) pulled by carabaos.</li>
        <li><strong>Seafood Festival (Sta. Cruz):</strong> Showcasing the rich aquatic resources and culinary heritage of the coastal municipality.</li>
        <li><strong>Torrijos Festival (Torrijos):</strong> A colorful display of the town's historical roots and local industries.</li>
      </ul>

      <h2>The Philippine Loop: Motorcycle & Bicycling Tourism</h2>
      <p>In addition to cultural and natural attractions, Marinduque is rapidly emerging as a favorite destination for both motorized and non-motorized two-wheel adventurers. Local authorities have aligned the island's scenic routes with the national <strong>"Philippine Loop"</strong> adventure tour initiative. The province's well-paved coastal roads, challenging mountain passes, and stunning ocean views make it an ideal circuit for motorcycle enthusiasts.</p>
      <p>Furthermore, <strong>bicycling the loop</strong> has grown significantly in popularity. Cycling groups from across the country are drawn to the island's relatively low traffic, clean air, and the physical challenge of completing the circumferential road. This influx of riders is bringing a welcome boost to local eateries, cafes, and accommodations situated along the route.</p>

      <p>With these comprehensive strategies, Marinduque is cementing its reputation not just as a Holy Week destination, but as a diverse, exciting, and accessible province for all types of travelers year-round.</p>
    `,
    key_takeaways: [
      'Marinduque is pushing "Beyond Moryonan" to promote year-round tourism focusing on natural attractions and the Luzon Datum of 1911.',
      'Local town festivals like Boac\'s Bila-bila and Mogpog\'s Kangga are being highlighted to attract cultural tourists.',
      'The island\'s scenic circumferential road is becoming a major destination for both motorcycle touring and bicycling as part of the "Philippine Loop".'
    ],
    faq_json: [
      {
        question: "What is the 'Beyond Moryonan' campaign?",
        answer: "It is a tourism initiative by the Marinduque Provincial Tourism Office aimed at promoting the island's attractions, such as its beaches and historical sites, beyond the traditional Holy Week Moriones festival."
      },
      {
        question: "What is the Luzon Datum of 1911?",
        answer: "Located in Mogpog, Marinduque, the Luzon Datum of 1911 is the geodetic center of the Philippines, marking the island as the geographic 'Heart of the Philippines.'"
      },
      {
        question: "Is Marinduque good for bicycling and motorcycle touring?",
        answer: "Yes, Marinduque's circumferential road offers well-paved paths, low traffic, and stunning coastal and mountain views, making it a highly popular segment for both motorcyclists and bicyclists doing the 'Philippine Loop'."
      }
    ],
    status: 'published',
    published_at: new Date().toISOString()
  };

  console.log("Inserting news article...");
  const { error } = await supabase
    .from('news')
    .upsert(article, { onConflict: 'slug' });

  if (error) {
    console.error("Error inserting news:", error);
  } else {
    console.log("Successfully inserted news article!");
  }
}

run();
