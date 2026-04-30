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
    slug: 'giant-python-captured-lipata-buenavista-2026',
    title: 'Massive Python Captured in Barangay Lipata Pit After Devouring 25kg Pig',
    summary: 'A 9-foot reticulated python was safely captured in Barangay Lipata, Buenavista. The massive reptile was found bloated in a pit after consuming a missing 25-kilogram pig.',
    image_url: '/news/massive_python.png',
    content: `
      <p><strong>BUENAVISTA, Marinduque</strong> — Local authorities successfully captured an exceptionally large python over the weekend after it was discovered trapped in a pit in Barangay Lipata, Buenavista.</p>

      <p>The incident occurred on <strong>Saturday, April 25, 2026</strong>, causing a stir among local residents. A passerby initially spotted the gigantic reptile coiled at the bottom of an earthy pit and immediately alerted barangay officials. The snake was visibly sluggish and weighed down, featuring an enormous bulge in its midsection.</p>

      <h2>The Culprit Behind Missing Livestock</h2>
      <p>Prior to the discovery, local farmers had been reporting the disappearance of their livestock. Upon capturing the snake, it was determined that the python had recently devoured a local farmer's 25-kilogram (55-pound) pig, resulting in its massive, bloated state which likely caused it to fall into and become trapped inside the pit.</p>

      <h2>A Heavy Lift for the Rescue Team</h2>
      <p>The Marinduque Animal and Wildlife Rescue Emergency Response Team (MAWRET) was dispatched to handle the situation. Due to the python's massive size—measuring over 9 feet in length—and its engorged state, responders proceeded with extreme caution. Utilizing proper snake-handling techniques, it took four individuals to safely hoist the heavy reptile out of the deep pit and temporarily place it in a secure transport cage.</p>

      <p>While encounters with reticulated pythons—which are native to the Philippines—do happen in Marinduque's more rural and forested areas, finding a specimen large enough to consume livestock of that size is a rare and startling event for the community. However, residents remain cautious due to local reports suggesting other potentially large snakes may still be in the area.</p>

      <h2>Safe Relocation</h2>
      <p>Following the capture, Provincial Veterinarian <strong>Dr. JM Victoria</strong> confirmed that the animal would undergo a thorough assessment. Once cleared, the local Department of Environment and Natural Resources (DENR) will determine the appropriate time and location to safely release the python back into its natural forest habitat, far away from human settlements and agricultural zones.</p>

      <p>Local officials remind residents to secure their livestock, especially those living near forested borders, and to immediately contact local authorities for safe wildlife removal rather than attempting to handle large animals themselves.</p>
    `,
    key_takeaways: [
      'A 9-foot python was found trapped in a pit in Barangay Lipata, Buenavista on April 25, 2026.',
      'The python was visibly engorged, having recently swallowed a local farmer\'s missing 25kg pig.',
      'It took four members of the MAWRET rescue team to safely lift and secure the massive snake.',
      'The python is being assessed by Provincial Vet Dr. JM Victoria before safe relocation by the DENR.'
    ],
    faq_json: [
      {
        question: "Where was the python found?",
        answer: "The python was discovered trapped inside a deep earthy pit in Barangay Lipata, Buenavista, Marinduque on April 25, 2026."
      },
      {
        question: "How big was the snake?",
        answer: "According to the rescue team, the python measured over 9 feet in length and was heavily bloated from consuming a 25kg pig."
      },
      {
        question: "Was anyone hurt?",
        answer: "No humans were harmed. The snake was safely captured by four members of the Marinduque Animal and Wildlife Rescue Emergency Response Team (MAWRET)."
      },
      {
        question: "What will happen to the python now?",
        answer: "Provincial Veterinarian Dr. JM Victoria is assessing the animal, after which it will be safely relocated to a remote forest habitat by the DENR."
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
