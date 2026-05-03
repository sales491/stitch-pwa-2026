import { TAGALOG_KEYWORDS_GEMS, TAGALOG_KEYWORDS_TRAVEL } from '@/utils/seo';

export interface TownData {
    name: string;
    slug: string;
    tagline: string;
    description: string;
    icon: string;
    image_url?: string;
    content: string;
    keywords: string[];
}

export const TOWNS: Record<string, TownData> = {
    'boac': {
        name: 'Boac',
        slug: 'boac',
        tagline: 'The Heritage Capital of Marinduque',
        description: 'Explore Boac, the vibrant capital of Marinduque known for its Spanish-era ancestral houses, the historic Boac Cathedral, and as the epicenter of the Moriones Festival.',
        icon: 'church',
        image_url: '/images/towns/boac_cathedral_art.png', // Main Hero Image
        keywords: ['Boac', 'Boac Cathedral', 'Marinduque capital', 'Moriones Festival Boac', 'heritage town Philippines', 'Boac ancestral houses', ...TAGALOG_KEYWORDS_GEMS, ...TAGALOG_KEYWORDS_TRAVEL],
        content: `
<h2>The Sacred Heart of Marinduque: A Biography of Boac</h2>
<p>Boac is more than the capital of Marinduque; it is the spiritual and administrative heart of the Philippine archipelago. To walk its streets is to navigate a "Total History"—a place where 18th-century miracles, modern economic data, and futuristic urban blueprints coexist in a single, living entity.</p>

<hr />

<h2>The Fortress of Faith: A Hagiography of the Soul</h2>
<p>In the lore of the island, Boac was born of a cosmic symmetry. Shaped like a human heart and resting at the center of the nation, the city’s origins are steeped in the divine. The very name of the province, Marinduque, echoes the tragic romance of <strong>Maring and Duque</strong>, whose spirits are said to have formed the mountains that shield the town.</p>

<figure>
  <img src="/images/towns/boac_cathedral_art.png" alt="Boac Cathedral, a massive red-brick fortress" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">The historic Boac Cathedral, a fortress of faith overlooking the city.</figcaption>
</figure>

<p>However, the "Soul" of Boac is most visible in its stones. The <strong>Boac Cathedral</strong>, a massive red-brick fortress, stands as a testament to the <strong>Biglang Awa</strong> (Our Lady of Prompt Succor). Legend tells that during a pirate siege in the 1700s, the Lady appeared upon the church walls, casting down the invaders with celestial light. This is not mere history to the people of Boac; it is a living reality. Each Lenten season, the streets are sanctified by the <strong>Moriones</strong>, masked penitents who transform the city into a stage for Roman-era drama, ensuring that the city’s legendary spirit remains untarnished by the passage of time.</p>

<figure>
  <img src="/images/towns/moriones_festival_art.png" alt="Moriones Festival in Boac" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">Centurions march during the annual Moriones Festival.</figcaption>
</figure>

<hr />

<h2>The Administrative Pulse: A Profile of the Body</h2>
<p>Descending from the heights of myth, we find the "Body" of Boac: a thriving, grounded <strong>1st Class Municipality</strong>. As the province's nerve center, Boac serves as the primary gateway for trade, education, and governance.</p>

<ul>
<li><strong>The Inhabitants:</strong> Boac is home to approximately <strong>57,000 residents</strong> across 61 barangays, a population that balances traditional agricultural lifestyles with modern professional roles.</li>
<li><strong>The Engine:</strong> The economy is built on a tripartite foundation of agriculture (coconut and rice), local fisheries, and a seasonal tourism boom driven by the world-renowned Moriones Festival.</li>
<li><strong>The Intellect:</strong> As the seat of <strong>Marinduque State University</strong>, the city serves as the island’s intellectual forge, producing a steady stream of graduates who fuel the local civil service and commerce.</li>
</ul>

<p>While the "Soul" of the city looks to the heavens, the "Body" of Boac manages the daily realities of a maritime economy, navigating the logistical complexities of island life and the seasonal challenges of the typhoon belt.</p>

<hr />

<h2>The Heritage Citadel: A Blueprint for the Future</h2>
<p>The final layer of Boac is its "Skeleton"—the visionary urban plan that will carry it into the next century. The goal is not merely growth, but <strong>Heritage-Led Urbanism</strong>, where architecture and policy serve as the guardians of the city’s sacred identity.</p>

<h3>1. The Living Museum</h3>
<p>The city's future centers on a strict <strong>Zoning Reform</strong>. By establishing a "Visual Corridor" ordinance, Boac ensures that no modern skyscraper will ever eclipse the view of the Cathedral. The preservation of Spanish-era ancestral houses in the <em>poblacion</em> ensures that the city remains a "Museum-City," where residents live within their own history.</p>

<h3>2. Ecological Resilience</h3>
<p>The <strong>Boac River Project</strong> reimagines the city's relationship with its waterways. Through the creation of riverine buffer zones and green belts, the city is building natural defenses against erosion and flooding, effectively merging environmental safety with public leisure spaces.</p>

<h3>3. The Digital Horizon</h3>
<p>To support a new generation of "Digital Nomads," the urban plan integrates fiber-optic infrastructure within its historic core. This allows Boac to participate in the global digital economy without sacrificing the quiet, sacred atmosphere that defines it.</p>

<hr />

<h2>Summary of Forward-Looking Investments</h2>
<div class="overflow-x-auto my-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
  <table class="w-full text-left text-sm md:text-base border-collapse">
    <thead class="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300">
      <tr>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Sector</th>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Investment Focus</th>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Goal for 2030</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-300">
      <tr>
        <td class="p-3 font-medium">Heritage</td>
        <td class="p-3">Visual Corridor Zoning</td>
        <td class="p-3">Protect the Cathedral's visual dominance and preserve the Museum-City.</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Environment</td>
        <td class="p-3">Boac River Project</td>
        <td class="p-3">Build natural defenses against flooding via riverine green belts.</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Technology</td>
        <td class="p-3">Historic Core Fiber-Optics</td>
        <td class="p-3">Support "Digital Nomads" while preserving sacred atmosphere.</td>
      </tr>
    </tbody>
  </table>
</div>

<hr />

<h2>Conclusion: The Total City</h2>
<p>Boac is a rare example of a city that knows exactly what it is. It is a fortress of faith, a center of commerce, and a blueprint for sustainable heritage. By honoring its "creation myths" while rigorously managing its "hard data," Boac is evolving into its ultimate form: a sanctuary that is as technically resilient as it is divinely inspired. To visit Boac is to witness a city that has finally reached its "sacred" state—a place where the past is not behind us, but beneath our feet, supporting the future.</p>
        `
    },
    'buenavista': {
        name: 'Buenavista',
        slug: 'buenavista',
        tagline: 'The Gateway to Mount Malindig',
        description: 'Buenavista offers breathtaking views of the imposing Mount Malindig, therapeutic sulfur hot springs, and unparalleled coastal beauty.',
        icon: 'volcano',
        image_url: '/images/towns/buenavista_malindig_art.png',
        keywords: ['Buenavista Marinduque', 'Mount Malindig', 'Malbog Sulfur Spring', 'Bellarocca', 'Elephant Island', 'hiking Marinduque', ...TAGALOG_KEYWORDS_GEMS, ...TAGALOG_KEYWORDS_TRAVEL],
        content: `
<h2>The Geothermal Retreat: A Biography of Buenavista</h2>
<p>Nestled in the shadow of Marinduque's highest peak, Buenavista is rapidly evolving into a sanctuary for nature enthusiasts and wellness seekers. To understand Buenavista is to explore a "Total History" where imposing natural monoliths, agricultural rhythms, and a futuristic vision for geothermal wellness converge.</p>

<hr />

<h2>The Natural Monuments: A Hagiography of the Soul</h2>
<p>The "Soul" of Buenavista is forged in fire and stone. Dominating the southern horizon is <strong>Mount Malindig</strong>, a potentially active stratovolcano that defines the town's landscape and local lore. Its lush, mist-covered slopes are revered by locals as a guardian entity, providing a haven for biodiversity and serving as the ultimate pilgrimage for mountaineers.</p>

<figure>
  <img src="/images/towns/buenavista_malindig_art.png" alt="Mount Malindig towering over Buenavista" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">The majestic peak of Mount Malindig towering over the coconut groves of Buenavista.</figcaption>
</figure>

<p>At the foot of this sleeping giant lie the <strong>Malbog Sulfur Springs</strong>. For generations, the mineral-rich, naturally heated waters bubbling up from the earth have been a site of healing. Locals and tourists alike bathe in these therapeutic pools, which are believed to cure ailments and wash away exhaustion. This geothermal gift is the true spiritual core of Buenavista—a place where the earth directly nurtures its people.</p>

<figure>
  <img src="/images/towns/buenavista_malbog_art.png" alt="Malbog Sulfur Springs" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">The serene, therapeutic waters of the Malbog Sulfur Springs.</figcaption>
</figure>

<hr />

<h2>The Agricultural Base: A Profile of the Body</h2>
<p>The "Body" of Buenavista is grounded in the fertile volcanic soil that sustains its people. As a 4th Class Municipality, its daily life revolves around a quiet but robust agricultural economy.</p>

<ul>
<li><strong>The Inhabitants:</strong> Home to a tight-knit community across 15 barangays, Buenavista’s residents are deeply connected to the land, maintaining generational farming traditions while slowly adapting to a growing eco-tourism influx.</li>
<li><strong>The Engine:</strong> The local economy is primarily driven by coconut and cacao plantations. The volcanic soil provides ideal conditions for these crops, making Buenavista a critical player in the island's agricultural output.</li>
<li><strong>The Coastal Connection:</strong> While defined by its mountain, Buenavista also maintains a strong fishing industry, with coastal barangays providing a steady harvest from the Tablas Strait.</li>
</ul>

<hr />

<h2>The Eco-Tourism Citadel: A Blueprint for the Future</h2>
<p>The "Skeleton" of Buenavista—its visionary blueprint for 2030 and beyond—positions the town as the province's premier "Wellness and Eco-Tourism Capital," carefully balancing high-value tourism with strict environmental stewardship.</p>

<h3>1. Geothermal Wellness Tourism</h3>
<p>Investments are being channeled into upgrading the facilities surrounding the Malbog Sulfur Springs. The goal is to transform it into a world-class, eco-friendly spa destination that utilizes sustainable architecture, ensuring the healing waters remain pristine.</p>

<h3>2. Elephant Island Redevelopment</h3>
<p>The famous Elephant Island (formerly the Bellarocca resort) is undergoing a strategic reassessment. The blueprint envisions reintroducing sustainable luxury tourism that deeply integrates with the local economy, prioritizing local hiring and farm-to-table supply chains over isolated resort models.</p>

<h3>3. Agri-Tourism Integration</h3>
<p>To support local farmers, there is a strong push to combine agriculture with tourism. Experiential "farm-to-table" destinations are being developed within cacao and coconut plantations, offering tourists immersive agricultural experiences.</p>

<hr />

<h2>Summary of Forward-Looking Investments</h2>
<div class="overflow-x-auto my-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
  <table class="w-full text-left text-sm md:text-base border-collapse">
    <thead class="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300">
      <tr>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Sector</th>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Investment Focus</th>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Goal for 2030</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-300">
      <tr>
        <td class="p-3 font-medium">Tourism</td>
        <td class="p-3">Malbog Eco-Spa Facilities</td>
        <td class="p-3">Establish a world-class geothermal wellness hub.</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Infrastructure</td>
        <td class="p-3">Mountain Access Roads</td>
        <td class="p-3">Improve access for eco-hikers while preventing erosion.</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Agriculture</td>
        <td class="p-3">Agri-Tourism Farm Integration</td>
        <td class="p-3">Diversify local income beyond traditional copra.</td>
      </tr>
    </tbody>
  </table>
</div>

<hr />

<h2>Conclusion: The Total Municipality</h2>
<p>Buenavista is a town that draws its power directly from the earth. By honoring the majestic presence of Mount Malindig and the healing energy of its sulfur springs, while simultaneously building a modern eco-tourism framework, Buenavista is achieving a perfect symbiosis of nature and progress. To visit Buenavista is to experience Marinduque in its most elemental and rejuvenating form—a place where the future is grown from fertile volcanic soil.</p>
        `
    },
    'gasan': {
        name: 'Gasan',
        slug: 'gasan',
        tagline: 'The Cultural Hub',
        description: 'Discover Gasan, famous for the Tres Reyes Islands, exquisite butterfly gardens, and arguably the most beautiful sunsets in Marinduque.',
        icon: 'palette',
        image_url: '/images/towns/gasan_tres_reyes_art.png',
        keywords: ['Gasan Marinduque', 'Tres Reyes Islands', 'Marinduque butterflies', 'Gasang-Gasang Festival', 'Gasan sunset', 'culture', ...TAGALOG_KEYWORDS_GEMS, ...TAGALOG_KEYWORDS_TRAVEL],
        content: `
<h2>Sustainable Coastal Urbanism: A Biography of Gasan</h2>
<p>As the cultural and logistical gateway of the province, Gasan is moving toward a future defined by Sustainable Coastal Urbanism. This "Total History" explores the town through the lens of its mythic origins, its current logistical power, and its transformation into a "Blue-Green Economy" hub by 2030.</p>

<hr />

<h2>The Coral Foundation: A Hagiography of the Soul</h2>
<p>In the spiritual geography of Marinduque, Gasan is the child of the reef. Its name is whispered to have come from <em>Gasáng-gasáng</em>—the sharp, white corals that once carpeted its shores. The city does not just sit by the water; it is born from it.</p>

<figure>
  <img src="/images/towns/gasan_tres_reyes_art.png" alt="Tres Reyes Islands, Gasan Marinduque" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">The Tres Reyes Islands standing watch in the Tablas Strait.</figcaption>
</figure>

<p>The town’s spirit is guarded by the <strong>Tres Reyes Islands</strong> (Melchor, Gaspar, and Baltazar), three limestone giants standing watch in the Tablas Strait. Locals view these islands as silent sentinels that have shielded the town from storms and invaders for centuries. At the heart of the <em>poblacion</em> stands the <strong>St. Joseph the Worker Parish</strong>, perched on a hill like a shepherd overlooking his flock. Here, the "soul" of Gasan is one of meticulous beauty and rhythmic devotion, best expressed in the <strong>Gasang-Gasang Festival</strong>, where the streets explode into a synchronized dance of gratitude for the harvest of both land and sea.</p>

<hr />

<h2>The Coastal Pulse: A Profile of the Body</h2>
<p>Transitioning to the empirical, the "Body" of Gasan is grounded in its role as the primary entry point for the province's air travel and as a leader in environmental governance.</p>

<ul>
<li><strong>Logistics Hub:</strong> As the host of the Marinduque Airport, Gasan is the administrative anchor for the province’s connectivity. In early 2026, new aviation infrastructure, including the CSIS office facility and terminal enhancements, solidified its role as a regional transport leader.</li>
<li><strong>The "Cleanest & Greenest" Legacy:</strong> Consistently awarded for its environmental management, Gasan maintains a 3rd Class status with a heavy focus on artisanal fisheries and coconut agriculture, balancing economic output with strict cleanliness.</li>
<li><strong>The Butterfly Capital:</strong> Gasan accounts for a significant portion of the Philippines' butterfly pupae exports. This niche "Bio-Economy" provides livelihoods for hundreds of families, merging traditional farming with global scientific exports and serving as a major tourist attraction.</li>
</ul>

<figure>
  <img src="/images/towns/gasan_butterfly_art.png" alt="Butterfly Gardens of Gasan" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">Gasan is widely known as the Butterfly Capital of the Philippines.</figcaption>
</figure>

<hr />

<h2>The Eco-Citadel: A Blueprint for the Future</h2>
<p>The "Skeleton" of Gasan is anchored in forward-looking infrastructure and the "Blue Economy." The urban plan envisions a town that is both an "Aerotropolis" and an ecological sanctuary.</p>

<h3>1. Aviation Expansion & the "2,100-Meter" Vision</h3>
<p>Aligning with the national Department of Transportation (DOTr) mandate for 2026, the blueprint for Gasan includes the expansion of the Marinduque Airport runway to 2,100 meters. This will allow for larger jet aircraft (like the Airbus A320) and night-rating capabilities, effectively lowering airfares and cementing Gasan as a competitive regional travel hub.</p>

<h3>2. The Tres Reyes Marine Sanctuary</h3>
<p>The 2026–2030 development cycle prioritizes the Marine Protected Area (MPA) Expansion. Investment is being channeled into sustainable "Blue Tourism" facilities on Gaspar Island, including eco-lodges that utilize solar power, ensuring that the "Coral Foundation" remains biologically viable for tourists and locals alike.</p>

<h3>3. The Butterfly Bio-Hub</h3>
<p>The urban plan outlines a specialized "Bio-Export Zone." This technical facility will professionalize butterfly breeding with climate-controlled laboratories and a centralized logistics center, turning a cottage industry into a world-class biotechnological asset.</p>

<hr />

<h2>Summary of Forward-Looking Investments</h2>
<div class="overflow-x-auto my-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
  <table class="w-full text-left text-sm md:text-base border-collapse">
    <thead class="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300">
      <tr>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Sector</th>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Investment Focus</th>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Goal for 2030</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-300">
      <tr>
        <td class="p-3 font-medium">Aviation</td>
        <td class="p-3">Runway extension & Night-rating</td>
        <td class="p-3">Direct jet flights and lower travel costs.</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Tourism</td>
        <td class="p-3">Tres Reyes Eco-Lodges</td>
        <td class="p-3">Sustainable, high-value "Blue Tourism."</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Export</td>
        <td class="p-3">Butterfly Bio-Hub</td>
        <td class="p-3">Scientific-grade export and lab facilities.</td>
      </tr>
    </tbody>
  </table>
</div>

<hr />

<h2>Conclusion: The Total Municipality</h2>
<p>By 2030, Gasan will serve as the Philippines' premier example of an "Eco-Gateway"—a place where the technical efficiency of a modern airport serves the delicate, mythic beauty of its coral reefs and butterfly gardens. In embracing its identity as a cultural and ecological protector, Gasan has built a "Total History" that honors its past while fiercely innovating for the future.</p>
        `
    },
    'mogpog': {
        name: 'Mogpog',
        slug: 'mogpog',
        tagline: 'Origin of the Moriones',
        description: 'Mogpog is the historical birthplace of the Moriones tradition and the geographic center of the Philippines, marked by the Luzon Datum of 1911.',
        icon: 'masks',
        image_url: '/images/towns/mogpog_balanacan_art.png',
        keywords: ['Mogpog Marinduque', 'origin of Moriones', 'Balanacan Port', 'Luzon Datum', 'Paadyao Cascades', 'Mogpog tourist spots', ...TAGALOG_KEYWORDS_GEMS, ...TAGALOG_KEYWORDS_TRAVEL],
        content: `
<h2>The Historic Gateway: A Biography of Mogpog</h2>
<p>As the northernmost municipality, Mogpog is the beating heart of Marinduque's logistics and the undisputed origin of its most famous cultural export. To traverse Mogpog is to navigate a "Total History" where the mythic origins of the Moriones tradition seamlessly intersect with the massive steel hulls of modern Ro-Ro vessels.</p>

<hr />

<h2>The Geographic Heart: A Hagiography of the Soul</h2>
<p>The "Soul" of Mogpog is defined by deep historical roots and geographical supremacy. Above all else, Mogpog is revered as the birthplace of the <strong>Moriones</strong> tradition. It was here, in the late 1800s, that a local priest first organized the masked penitents to dramatize the story of Longinus. This profound Lenten devotion has since become the defining cultural symbol of the entire province.</p>

<p>Equally significant is the town's geographic anchoring. Situated atop Mount Mataas, the <strong>Luzon Datum of 1911</strong> serves as the primary geodetic reference center for all map-making in the Philippines. This historical marker literally makes Mogpog the "Heart of the Philippines," a title residents hold with immense pride.</p>

<figure>
  <img src="/images/towns/mogpog_luzon_datum_art.png" alt="Luzon Datum Marker in Mogpog" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">A panoramic view from the Luzon Datum, the geographic center of the Philippines.</figcaption>
</figure>

<p>Finally, there is <strong>Balanacan Port</strong>. Nestled in a naturally protected cove and watched over by the towering statue of Our Lady of Peace and Good Voyage, it is the welcoming embrace of the island. For nearly every traveler, the mythic journey into Marinduque begins by sailing into this stunning, mountainous harbor.</p>

<figure>
  <img src="/images/towns/mogpog_balanacan_art.png" alt="Balanacan Port in Mogpog" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">Inter-island ferries docked at the bustling, picturesque Balanacan Port.</figcaption>
</figure>

<hr />

<h2>The Logistics Engine: A Profile of the Body</h2>
<p>The "Body" of Mogpog is a powerhouse of commerce and transit. As a 3rd Class Municipality, its daily operations dictate the economic heartbeat of the entire island.</p>

<ul>
<li><strong>The Inhabitants:</strong> With a population spread across 37 barangays, Mogpog’s residents balance agricultural life with the demands of a high-throughput maritime port economy.</li>
<li><strong>The Transit Hub:</strong> Balanacan Port handles the vast majority of the province's Ro-Ro passenger and cargo traffic. The continuous flow of goods, fuel, and tourists makes Mogpog the island's undisputed logistical engine.</li>
<li><strong>Agricultural Reserves:</strong> Beyond the port, the town maintains robust coconut farming and fishing sectors, alongside hidden natural tourist gems like the Paadyao Cascades and Bintakay Cave.</li>
</ul>

<hr />

<h2>The Maritime Citadel: A Blueprint for the Future</h2>
<p>The "Skeleton" of Mogpog's future involves balancing massive infrastructure upgrades with the rigorous preservation of its sacred heritage, ensuring it remains more than just a transit point.</p>

<h3>1. Balanacan Port Modernization</h3>
<p>The Philippine Ports Authority (PPA) is executing ongoing expansions to Balanacan to accommodate larger Ro-Ro vessels and potentially cruise ships. This involves dredging, expanded passenger terminals, and streamlined cargo trade to lower commodity prices island-wide.</p>

<h3>2. Heritage Tourism Integration</h3>
<p>To capitalize on the transit traffic, Mogpog is investing in cultural tourism zones. Improved access roads to the Luzon Datum and eco-parks around the Paadyao Cascades are designed to entice visitors to stay and explore the municipality rather than just passing through to Boac.</p>

<h3>3. The Moriones Cultural Center</h3>
<p>Plans are underway to establish a dedicated museum and artisan workshop space to preserve the traditional carving of wooden Moriones masks. This ensures the craft survives the next generation and provides a central hub for tourists to engage with the town's core identity.</p>

<hr />

<h2>Summary of Forward-Looking Investments</h2>
<div class="overflow-x-auto my-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
  <table class="w-full text-left text-sm md:text-base border-collapse">
    <thead class="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300">
      <tr>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Sector</th>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Investment Focus</th>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Goal for 2030</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-300">
      <tr>
        <td class="p-3 font-medium">Logistics</td>
        <td class="p-3">Balanacan Port Expansion</td>
        <td class="p-3">Handle larger vessels and streamline island cargo trade.</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Heritage</td>
        <td class="p-3">Luzon Datum Park Development</td>
        <td class="p-3">Create a premier national historical tourism site.</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Culture</td>
        <td class="p-3">Moriones Artisan Workshops</td>
        <td class="p-3">Subsidize and protect the traditional mask-making industry.</td>
      </tr>
    </tbody>
  </table>
</div>

<hr />

<h2>Conclusion: The Total Municipality</h2>
<p>Mogpog is a city defined by motion—the steady arrival of ferries, the march of the Moriones, the historic drawing of map lines. By fiercely protecting its status as the origin of the island's soul while radically expanding its capacity as the island's economic gateway, Mogpog is securing its place as a "Total Municipality." It stands as the vital bridge between Marinduque's legendary past and its interconnected future.</p>
        `
    },
    'santa-cruz': {
        name: 'Santa Cruz',
        slug: 'santa-cruz',
        tagline: 'The Island Paradise Gateway',
        description: 'Santa Cruz is the largest municipality, offering access to the stunning Palad Sandbar, Maniwaya Island, and the mystical Bathala Caves.',
        icon: 'sailing',
        image_url: '/images/towns/santacruz_palad_art.png',
        keywords: ['Santa Cruz Marinduque', 'Maniwaya Island', 'Palad Sandbar', 'Mongpong Island', 'Bathala Caves', 'Buyabod Port', 'island hopping', ...TAGALOG_KEYWORDS_GEMS, ...TAGALOG_KEYWORDS_TRAVEL],
        content: `
<h2>The Archipelago's Playground: A Biography of Santa Cruz</h2>
<p>Santa Cruz is the largest municipality in Marinduque, both in land area and in the sheer scale of its natural attractions. A "Total History" of Santa Cruz reveals a town where mystical ancient caverns, a booming island-hopping economy, and strict marine conservation blueprints form a vibrant, dynamic whole.</p>

<hr />

<h2>The Wonders of Sea and Stone: A Hagiography of the Soul</h2>
<p>The "Soul" of Santa Cruz is etched into its limestone and scattered across its offshore islands. Inland, the town hides a complex network of caverns known as the <strong>Bathala Caves</strong>. Believed by pre-colonial locals to be the dwelling place of the supreme god <em>Bathala</em>, the caves feature stunning stalactites, underground pools, and dramatic light rays piercing through natural skylights. This is a place of profound reverence and ancient magic.</p>

<figure>
  <img src="/images/towns/santacruz_bathala_art.png" alt="Bathala Caves interior" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">Dramatic light rays illuminate the mystical interior of the Bathala Caves.</figcaption>
</figure>

<p>Off the coast, the soul of the town extends into the sea. The crown jewels are the offshore islands: <strong>Maniwaya Island</strong> offers pristine white sands, while the mystical <strong>Palad Sandbar</strong> emerges only during low tide, offering visitors a fleeting, surreal experience of walking on water amidst the vibrant turquoise ocean. These are not just tourist spots; they are the natural monuments that define the town's identity.</p>

<figure>
  <img src="/images/towns/santacruz_palad_art.png" alt="Palad Sandbar in Santa Cruz" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">The breathtaking Palad Sandbar, surrounded by the crystal-clear waters of the Sibuyan Sea.</figcaption>
</figure>

<hr />

<h2>The Agricultural Giant: A Profile of the Body</h2>
<p>The "Body" of Santa Cruz is expansive. As a 1st Class Municipality and the largest by land area, it boasts a thriving, multifaceted economy.</p>

<ul>
<li><strong>The Inhabitants:</strong> With a population of over 60,000 spread across 55 barangays, it is a bustling hub of commerce and agriculture in the northeastern part of the island.</li>
<li><strong>The Economic Engine:</strong> Beyond the high-revenue island-hopping tourism, Santa Cruz possesses vast agricultural expanses. It is a major producer of rice, copra, and arrowroot (the primary ingredient for the famous Marinduque arrowroot cookies).</li>
<li><strong>The Marine Economy:</strong> Its long coastline and offshore islands support a massive fishing industry, providing seafood not just for the town, but for the entire province and beyond.</li>
</ul>

<hr />

<h2>The Ecotourism Citadel: A Blueprint for the Future</h2>
<p>The "Skeleton" of Santa Cruz addresses the challenges of its own popularity. The strategic plan focuses heavily on upgrading marine infrastructure and establishing strict ecological carrying capacities to prevent over-tourism.</p>

<h3>1. Buyabod Port Modernization</h3>
<p>Buyabod Port, the primary jump-off point for island hopping, is being upgraded with better passenger terminals, regulated docking fees, and improved safety protocols to provide a world-class, organized experience for international tourists.</p>

<h3>2. Strict Marine Conservation</h3>
<p>To protect the fragile coral reefs around Mongpong and Maniwaya from boat anchors and pollution, the local government is deploying artificial reefs and establishing strict "No-Take" marine zones, allowing fish populations to recover and ensuring the reefs remain vibrant for decades.</p>

<h3>3. Ecotourism Guide Certification</h3>
<p>The municipality is heavily investing in training local boatmen and guides, certifying them in ecological preservation, marine biology basics, and first-aid. This professionalizes the local workforce and elevates the standard of service.</p>

<hr />

<h2>Summary of Forward-Looking Investments</h2>
<div class="overflow-x-auto my-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
  <table class="w-full text-left text-sm md:text-base border-collapse">
    <thead class="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300">
      <tr>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Sector</th>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Investment Focus</th>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Goal for 2030</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-300">
      <tr>
        <td class="p-3 font-medium">Tourism</td>
        <td class="p-3">Buyabod Port Upgrades</td>
        <td class="p-3">Provide a safe, world-class terminal for island-hoppers.</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Environment</td>
        <td class="p-3">Reef Restoration & Zoning</td>
        <td class="p-3">Prevent coral bleaching and protect the marine economy.</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Education</td>
        <td class="p-3">Eco-Guide Certification</td>
        <td class="p-3">Professionalize local tourism workers.</td>
      </tr>
    </tbody>
  </table>
</div>

<hr />

<h2>Conclusion: The Total Municipality</h2>
<p>Santa Cruz is the undisputed adventure capital of Marinduque. By treating its mythical caves and pristine sandbars not just as commodities, but as sacred natural endowments requiring strict protection, Santa Cruz is charting a sustainable path forward. It stands as a "Total Municipality"—vast, bountiful, and fiercely committed to preserving the natural wonders that make it an island paradise.</p>
        `
    },
    'torrijos': {
        name: 'Torrijos',
        slug: 'torrijos',
        tagline: 'The Scenic Southeast',
        description: 'Torrijos is home to the famous Poctoy White Beach, historic battle sites, and the traditional art of loom weaving.',
        icon: 'beach_access',
        image_url: '/images/towns/torrijos_poctoy_art.png',
        keywords: ['Torrijos Marinduque', 'Poctoy White Beach', 'Battle of Pulang Lupa', 'loom weaving Marinduque', 'Torrijos tourist spots', 'beaches', ...TAGALOG_KEYWORDS_GEMS, ...TAGALOG_KEYWORDS_TRAVEL],
        content: `
<h2>The Eastern Sanctuary: A Biography of Torrijos</h2>
<p>Situated on the southeastern coast, Torrijos is synonymous with relaxation, pristine shorelines, and fierce historical pride. To delve into Torrijos is to read a "Total History" where the scars of revolutionary battles coexist with peaceful beachfronts and forward-looking heritage industries.</p>

<hr />

<h2>The Coast and the Conflict: A Hagiography of the Soul</h2>
<p>The "Soul" of Torrijos is a striking dichotomy of peace and valor. On one hand, it is the sanctuary of the island. <strong>Poctoy White Beach</strong> is arguably the most famous and accessible public beach on the Marinduque mainland. With its fine white sand, clear blue waters, and the towering silhouette of Mount Malindig in the distance, it represents the ultimate, idyllic provincial escape.</p>

<figure>
  <img src="/images/towns/torrijos_poctoy_art.png" alt="Poctoy White Beach in Torrijos" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">Relaxing views of Poctoy White Beach, set against a stunning mountainous backdrop.</figcaption>
</figure>

<p>Yet, high in the mountains above these peaceful shores lies the town's fiercely proud historical core: the <strong>Pulang Lupa Historical Park</strong>. This monument commemorates the September 1900 Battle of Pulang Lupa, where Filipino revolutionaries achieved a brilliant, decisive victory against American forces during the Philippine-American War. This blood-soaked soil gives Torrijos an aura of profound nationalistic pride that permeates the local culture.</p>

<figure>
  <img src="/images/towns/torrijos_pulang_lupa_art.png" alt="Pulang Lupa Historical Monument" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">The Pulang Lupa monument, honoring the bravery of Marinduqueño revolutionaries.</figcaption>
</figure>

<hr />

<h2>The Heritage Loom: A Profile of the Body</h2>
<p>The "Body" of Torrijos is grounded in meticulous craftsmanship and coastal agriculture. As a 3rd Class Municipality, its economy is steady and deeply rooted in tradition.</p>

<ul>
<li><strong>The Inhabitants:</strong> Torrijos is home to a peaceful population spread across 25 barangays, characterized by a relaxed coastal lifestyle and strong community ties.</li>
<li><strong>The Master Weavers:</strong> The town is famous throughout the country for its traditional loom weaving. Artisans meticulously craft textiles, placemats, and bags from buntal and abaca fibers, a heritage industry that provides significant local employment.</li>
<li><strong>The Coastal Yield:</strong> A thriving local fishing industry and extensive coconut plantations form the backbone of daily life, supported by the steady influx of local tourists visiting Poctoy White Beach.</li>
</ul>

<hr />

<h2>The Resilient Citadel: A Blueprint for the Future</h2>
<p>The "Skeleton" of Torrijos involves charting a course that physically protects its coastal environment while reviving its heritage industries for the global digital market.</p>

<h3>1. Coastal Resilience & Protection</h3>
<p>Faced with changing climate patterns and rising tides, local initiatives are prioritizing mangrove reforestation and subtle seawall enhancements. The goal is to protect the structural integrity of the Poctoy shoreline from erosion without disrupting its natural aesthetic.</p>

<h3>2. Modernizing Loom Weaving</h3>
<p>To ensure the survival of its weaving heritage, the government is providing grants and training to local weavers. By integrating modern design trends and establishing e-commerce channels, Torrijos aims to elevate its local textiles to global export quality, securing the craft for the next generation.</p>

<h3>3. The Historical Tourism Circuit</h3>
<p>Investments are being made to improve the winding mountain access roads to Pulang Lupa. Plans include building an interactive visitor center that properly honors the historical significance of the site, drawing tourists away from the beach to engage with the island's revolutionary history.</p>

<hr />

<h2>Summary of Forward-Looking Investments</h2>
<div class="overflow-x-auto my-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
  <table class="w-full text-left text-sm md:text-base border-collapse">
    <thead class="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300">
      <tr>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Sector</th>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Investment Focus</th>
        <th class="p-3 font-bold border-b border-slate-200 dark:border-zinc-700">Goal for 2030</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-300">
      <tr>
        <td class="p-3 font-medium">Environment</td>
        <td class="p-3">Coastal Erosion Defenses</td>
        <td class="p-3">Preserve the structural integrity of Poctoy White Beach.</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Economy</td>
        <td class="p-3">Loom Weaving Grants</td>
        <td class="p-3">Elevate local textiles to global export quality via e-commerce.</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Heritage</td>
        <td class="p-3">Pulang Lupa Road Access</td>
        <td class="p-3">Increase historical tourism foot traffic safely.</td>
      </tr>
    </tbody>
  </table>
</div>

<hr />

<h2>Conclusion: The Total Municipality</h2>
<p>Torrijos perfectly balances the tranquility of its beaches with the fiery pride of its history. By reinforcing its shores against the changing climate and modernizing its ancient weaving looms for the digital age, Torrijos is ensuring its identity remains intact. It stands as a "Total Municipality"—a sanctuary that is as deeply rooted in revolutionary valor as it is dedicated to a peaceful, prosperous future.</p>
        `
    }
};
