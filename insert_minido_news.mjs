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
    slug: 'minido-preschool-joins-pta-boac-2026',
    title: 'Minido Preschool Officially Joins Philippine Taekwondo Association',
    summary: 'Minido Preschool in Boac announces its new martial arts program is now an official member of the Philippine Taekwondo Association (PTA), offering certified training for young children.',
    image_url: '/news/tkd_hands.png',
    content: `
      <p><strong>BOAC, Marinduque</strong> — Minido Preschool has officially leveled up its physical education offerings. Today, the DepEd-recognized early childhood institution announced that its new sports branch, <strong>Minido Martial Arts</strong>, is officially a proud member of the <strong>Philippine Taekwondo Association (PTA)</strong>.</p>

      <p>This exciting development makes Minido Martial Arts the newest recognized PTA chapter in the Boac area. The official announcement was made via the school's social media channels this morning, celebrating a major milestone for local youth sports.</p>

      <h2>Bringing National Standards to Boac</h2>
      <p>While Minido Preschool has always focused heavily on purposeful and meaningful early childhood education, this new national affiliation means their martial arts students will now train under the official curriculum and rigorous standards set by the PTA.</p>

      <p>This affiliation opens the door for local children to participate in official belt promotion testing, regional tournaments, and national-level clinics. The program is designed to build foundational strength, mental focus, and discipline in young learners.</p>

      <h2>Expanding Beyond the Classroom</h2>
      <p>Located at 14 Magsaysay Rd, Isok, Boac, Minido has built a strong reputation for keeping abreast with educational innovations and ensuring their students are well-rounded, early readers. By adding an officially sanctioned Taekwondo program, they are further emphasizing the importance of socio-emotional and physical development.</p>

      <p>The timing is perfect, tying into their recently launched summer classes aimed at children ages 3 to 12.</p>

      <h2>How to Enroll</h2>
      <p>Parents interested in enrolling their children in the newest PTA chapter in Boac can reach out directly to the school at <strong>+63 917 850 4544</strong> or via email at <strong>minidosch@gmail.com</strong>.</p>
      
      <p>You can also message them directly on their official Facebook page: <a href="https://www.facebook.com/people/Minido-Preschool/100063925586617/" target="_blank" rel="noopener noreferrer"><strong>Minido Preschool Facebook Page</strong></a>.</p>
    `,
    key_takeaways: [
      'Minido Martial Arts has officially joined the Philippine Taekwondo Association (PTA).',
      'They are the newest recognized PTA chapter operating in Boac, Marinduque.',
      'The affiliation allows young students to train under national standards and participate in official belt promotions.',
      'Programs are currently available for children ages 3 to 12.'
    ],
    faq_json: [
      {
        question: "Is Minido Martial Arts an official PTA member?",
        answer: "Yes, as of April 30, 2026, Minido Martial Arts is an officially recognized chapter of the Philippine Taekwondo Association."
      },
      {
        question: "What ages can enroll in the Taekwondo program?",
        answer: "The summer classes and Taekwondo programs are designed for children ages 3 to 12."
      },
      {
        question: "Where is Minido Preschool located?",
        answer: "The school is located at 14 Magsaysay Rd, Isok, Boac, Marinduque."
      },
      {
        question: "How do I contact Minido Preschool?",
        answer: "You can reach them at +63 917 850 4544, via email at minidosch@gmail.com, or through their official Facebook page."
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
