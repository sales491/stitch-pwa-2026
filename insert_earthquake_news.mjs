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
    slug: 'minor-earthquake-santa-cruz-april-2026',
    title: 'Minor Magnitude 2.4 Earthquake Recorded off Santa Cruz, Marinduque',
    summary: 'A minor magnitude 2.4 earthquake was recorded off the coast of Santa Cruz on Tuesday night. Authorities confirm no damage or injuries from the shallow tremor.',
    image_url: '/news/seismograph.png',
    content: `
      <p><strong>SANTA CRUZ, Marinduque</strong> — A minor earthquake was recorded off the coast of Santa Cruz on Tuesday night, reminding residents of the island province's placement near active fault zones.</p>

      <p>According to the Philippine Institute of Volcanology and Seismology (PHIVOLCS) and international seismic monitoring networks, the tremor occurred at exactly <strong>9:12 PM on April 28, 2026</strong>.</p>

      <h2>Earthquake Details</h2>
      <ul>
        <li><strong>Magnitude:</strong> 2.4</li>
        <li><strong>Epicenter:</strong> 11 kilometers Northwest of Santa Cruz, Marinduque</li>
        <li><strong>Depth of Focus:</strong> 6 kilometers (Shallow)</li>
      </ul>

      <p>Because of its low magnitude and shallow depth, the earthquake was categorized as "light" and "non-felt" by most residents on the island. Local disaster risk reduction and management offices in Santa Cruz and neighboring municipalities have reported <strong>no damage to infrastructure or property</strong>, and there have been no reports of injuries.</p>

      <h2>Routine Seismic Activity</h2>
      <p>Seismic activity of this magnitude is considered routine in the Philippines, which sits along the Pacific Ring of Fire. While Marinduque is not considered a high-risk epicenter compared to other provinces, it does experience occasional minor tremors from nearby fault lines running through the Sibuyan Sea and the Tayabas Isthmus.</p>

      <p>Authorities remind the public to remain calm but vigilant during such events. The local government continues to encourage participation in nationwide earthquake drills to ensure households and businesses are prepared for more significant seismic events.</p>
    `,
    key_takeaways: [
      'A magnitude 2.4 earthquake struck 11km NW of Santa Cruz on the evening of April 28, 2026.',
      'The tremor was too weak to be felt by most people and caused no damage or injuries.',
      'The event is a routine geological occurrence, but authorities remind locals to maintain earthquake preparedness.'
    ],
    faq_json: [
      {
        question: "When and where did the earthquake happen?",
        answer: "The magnitude 2.4 earthquake occurred at 9:12 PM on April 28, 2026. The epicenter was located 11 kilometers Northwest of Santa Cruz, Marinduque."
      },
      {
        question: "Was there any damage reported?",
        answer: "No. Due to the low magnitude and shallow depth, there was no damage to infrastructure or property, and no injuries were reported."
      },
      {
        question: "Is Marinduque at high risk for earthquakes?",
        answer: "While the Philippines sits on the Pacific Ring of Fire, Marinduque is generally less prone to major epicenters compared to other provinces, though it routinely experiences minor tremors."
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
