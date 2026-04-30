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
    slug: 'balanacan-port-passenger-terminal-overhaul-2026',
    title: 'PPA Announces Massive Overhaul for Balanacan Port Passenger Terminal',
    summary: 'The Philippine Ports Authority (PPA) is set to construct a modern, larger passenger terminal building at Balanacan Port to solve peak-season congestion and upgrade the island\'s primary gateway.',
    image_url: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1200&auto=format&fit=crop', // Port/shipping aesthetic
    content: `
      <p>As part of its continued efforts to modernize regional maritime infrastructure, the Philippine Ports Authority (PPA) has formally announced ambitious plans for 2026 to overhaul the <strong>Balanacan Port</strong> in Mogpog, Marinduque. At the center of this initiative is the construction of an entirely new, modern Passenger Terminal Building (PTB).</p>

      <h2>Solving the Peak Season Congestion</h2>
      <p>Balanacan Port serves as the primary gateway to the island province, handling the vast majority of Roll-on/Roll-off (RoRo) and passenger traffic from Dalahican Port in Lucena City. For years, residents and tourists have faced severe congestion, limited seating, and inadequate waiting facilities during peak travel seasons—most notably during the annual <strong>Moriones Festival</strong> and Holy Week, as well as the Undas and Christmas holidays.</p>
      
      <p>The new passenger terminal is designed specifically to address these bottlenecks. By drastically increasing the capacity of the holding areas, the PPA aims to ensure that the massive influx of holidaymakers and returning locals can be accommodated safely and comfortably.</p>

      <h2>What to Expect from the New Terminal</h2>
      <p>While full architectural blueprints are still being finalized, the PPA's announcement highlighted several key upgrades expected in the new facility:</p>
      <ul>
        <li><strong>Expanded Seating Capacity:</strong> A massive increase in comfortable seating to accommodate hundreds of waiting passengers simultaneously.</li>
        <li><strong>Modernized Ticketing and Boarding:</strong> Streamlined electronic ticketing booths and clearer, more organized boarding gates to speed up passenger flow.</li>
        <li><strong>Upgraded Amenities:</strong> Clean, modern restrooms, dedicated nursing stations for mothers, and improved accessibility features for senior citizens and persons with disabilities (PWDs).</li>
        <li><strong>Better Commercial Spaces:</strong> Dedicated zones for local vendors and food stalls, providing travelers with better dining options while supporting Marinduqueño businesses.</li>
      </ul>

      <h2>A Boost for Local Tourism and Economy</h2>
      <p>Local government officials have enthusiastically welcomed the announcement. A modernized Balanacan Port will not only ease the burden on everyday commuters but is also viewed as a crucial step in boosting the province's tourism industry. First impressions matter, and a state-of-the-art terminal will provide a much more welcoming experience for first-time visitors arriving on the island.</p>

      <p>Construction timelines and budget specifics are expected to be detailed in subsequent PPA briefings later this year, but the commitment to modernize Marinduque's primary maritime gateway marks a major win for the island's infrastructure development in 2026.</p>
    `,
    key_takeaways: [
      'PPA is building a new, larger Passenger Terminal Building (PTB) at Balanacan Port.',
      'The overhaul aims to solve the severe passenger congestion experienced during peak seasons like Holy Week and the Moriones Festival.',
      'Upgrades will include expanded seating, modern ticketing, better amenities, and improved commercial spaces.'
    ],
    faq_json: [
      {
        question: "Why is Balanacan Port getting a new terminal?",
        answer: "The current facilities are often overwhelmed during peak travel seasons. The new terminal will expand capacity, improve passenger flow, and provide modern amenities."
      },
      {
        question: "Where is Balanacan Port located?",
        answer: "Balanacan Port is located in the municipality of Mogpog, Marinduque, and serves as the primary RoRo gateway connecting the island to Lucena City."
      },
      {
        question: "What improvements will the new terminal have?",
        answer: "Expected improvements include increased seating capacity, streamlined ticketing, upgraded restrooms, PWD accessibility, and better commercial spaces for local vendors."
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
