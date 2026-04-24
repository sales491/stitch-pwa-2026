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
<h2>The Geothermal Retreat: A Vision for Buenavista</h2>
<p>Nestled in the shadow of Marinduque's highest peak, Buenavista stands as the island's premier destination for eco-tourism and geothermal wellness. Combining breathtaking topography with healing natural springs, the town is rapidly evolving into a sanctuary for nature enthusiasts and wellness seekers alike.</p>

<hr />

<h2>I. The Natural Monuments</h2>
<h3>Mount Malindig: The Sleeping Giant</h3>
<p>Dominating the southern horizon, <strong>Mount Malindig</strong> is a potentially active stratovolcano that defines Buenavista's landscape. Its lush slopes are a haven for biodiversity and a prime destination for mountaineers looking for a challenging yet rewarding ascent.</p>

<figure>
  <img src="/images/towns/buenavista_malindig_art.png" alt="Mount Malindig towering over Buenavista" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">The majestic peak of Mount Malindig towering over the coconut groves of Buenavista.</figcaption>
</figure>

<h3>Malbog Sulfur Springs: The Healing Waters</h3>
<p>Located at the foot of Mount Malindig, the <strong>Malbog Sulfur Springs</strong> offer naturally heated, mineral-rich waters. For generations, locals and tourists have bathed in these therapeutic pools, which are believed to cure various skin ailments and ease muscle tension.</p>

<figure>
  <img src="/images/towns/buenavista_malbog_art.png" alt="Malbog Sulfur Springs" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">The serene, therapeutic waters of the Malbog Sulfur Springs.</figcaption>
</figure>

<hr />

<h2>II. Future Plans & Economic Outlook</h2>
<p>Buenavista is actively positioning itself as the province's "Wellness and Eco-Tourism Capital." The local government's forward-looking strategies are centered on balancing tourism growth with strict environmental protections.</p>

<ul>
<li><strong>Geothermal Wellness Tourism:</strong> Investments are being funneled into upgrading the facilities surrounding the Malbog Sulfur Springs, turning it into a world-class, eco-friendly spa destination while preserving the natural landscape.</li>
<li><strong>Elephant Island Redevelopment:</strong> The famous Elephant Island (formerly Bellarocca) is undergoing strategic reassessment to reintroduce sustainable luxury tourism that benefits the local economy through jobs and localized supply chains.</li>
<li><strong>Agri-Tourism Integration:</strong> To support local farmers, there is a strong push to combine agriculture with tourism. Coconut and cacao plantations are being developed into experiential "farm-to-table" destinations.</li>
</ul>

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
<h2>Sustainable Coastal Urbanism: A Blueprint for Gasan</h2>
<p>As the cultural and logistical gateway of the province, Gasan is moving toward a future defined by Sustainable Coastal Urbanism. This article explores the town through the lens of its upcoming investments and its transformation into a "Blue-Green Economy" hub by 2030.</p>

<hr />

<h2>I. The Coral Foundation: A Hagiography of the Shore</h2>
<h3>The Soul: Mythic & Reverent</h3>
<p>In the spiritual geography of Marinduque, Gasan is the child of the reef. Its name is whispered to have come from <em>Gasáng-gasáng</em>—the sharp, white corals that once carpeted its shores. The city does not just sit by the water; it is born from it.</p>

<figure>
  <img src="/images/towns/gasan_tres_reyes_art.png" alt="Tres Reyes Islands, Gasan Marinduque" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">The Tres Reyes Islands standing watch in the Tablas Strait.</figcaption>
</figure>

<p>The town’s spirit is guarded by the <strong>Tres Reyes Islands</strong> (Melchor, Gaspar, and Baltazar), three limestone giants standing watch in the Tablas Strait. Locals view these islands as silent sentinels that have shielded the town from storms and invaders for centuries. At the heart of the <em>poblacion</em> stands the <strong>St. Joseph the Worker Parish</strong>, perched on a hill like a shepherd overlooking his flock. Here, the "spirit" of Gasan is one of meticulous beauty and rhythmic devotion, best expressed in the <strong>Gasang-Gasang Festival</strong>, where the streets explode into a synchronized dance of gratitude for the harvest of both land and sea.</p>

<hr />

<h2>II. The Coastal Pulse: The 2026 Economic Gateway</h2>
<h3>The Body: Objective & Grounded</h3>
<p>Transitioning to the empirical, Gasan is currently the primary entry point for the province's air travel and a leader in environmental governance.</p>

<ul>
<li><strong>Logistics Hub:</strong> As the host of the Marinduque Airport, Gasan is the administrative anchor for the province’s connectivity. In early 2026, new aviation infrastructure, including the CSIS office facility and terminal enhancements, has solidified its role as a regional transport leader.</li>
<li><strong>The "Cleanest & Greenest" Legacy:</strong> Consistently awarded for its environmental management, Gasan maintains a 3rd Class status with a heavy focus on artisanal fisheries and coconut agriculture.</li>
<li><strong>The Butterfly Capital:</strong> Gasan accounts for a significant portion of the Philippines' butterfly pupae exports. This niche "Bio-Economy" provides livelihoods for hundreds of families, merging traditional farming with global scientific exports.</li>
</ul>

<figure>
  <img src="/images/towns/gasan_butterfly_art.png" alt="Butterfly Gardens of Gasan" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">Gasan is widely known as the Butterfly Capital of the Philippines.</figcaption>
</figure>

<hr />

<h2>III. The Eco-Citadel: The Blueprint for 2030 and Beyond</h2>
<h3>The Skeleton: Technical & Visionary</h3>
<p>The future of Gasan is anchored in forward-looking infrastructure and the "Blue Economy." The urban plan envisions a town that is both an "Aerotropolis" and an ecological sanctuary.</p>

<h3>1. Aviation Expansion & the "2,100-Meter" Vision</h3>
<p>Aligning with the national Department of Transportation (DOTr) mandate for 2026, the blueprint for Gasan includes the expansion of the Marinduque Airport runway to 2,100 meters. This will allow for larger jet aircraft (like the Airbus A320) and night-rating capabilities, effectively lowering airfares and positioning Gasan as a competitive regional travel hub.</p>

<h3>2. The Tres Reyes Marine Sanctuary & Blue Investment</h3>
<p>The 2026–2030 development cycle prioritizes the Marine Protected Area (MPA) Expansion. Investment is being channeled into sustainable "Blue Tourism" facilities on Gaspar Island, including eco-lodges that utilize solar power and rainwater harvesting, ensuring that the "Coral Foundation" remains biologically viable for the next century.</p>

<h3>3. The Butterfly Bio-Hub</h3>
<p>The urban plan outlines a specialized "Bio-Export Zone" in Gasan. This technical facility will professionalize butterfly breeding with climate-controlled laboratories and a centralized logistics center, turning a cottage industry into a world-class biotechnological asset.</p>

<h3>4. Sustainable Infrastructure (SIPAG Projects)</h3>
<p>Under the 2026 Sustainable Infrastructure Projects Alleviating Gaps (SIPAG), Gasan is seeing the construction of advanced access roads and bridges in key barangays like Tapuyan. These routes are designed as "Green Corridors," integrating flood control with tree-lined boulevards to support both logistics and local wellness.</p>

<p><strong>The Vision:</strong> By 2030, Gasan will serve as the Philippines' premier example of an "Eco-Gateway"—a place where the technical efficiency of a modern airport serves the delicate, mythic beauty of its coral reefs and butterfly gardens.</p>

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
      <tr>
        <td class="p-3 font-medium">Environment</td>
        <td class="p-3">Marine Protected Area expansion</td>
        <td class="p-3">Restoration of the "Gasáng-gasáng" coral health.</td>
      </tr>
    </tbody>
  </table>
</div>
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
<h2>The Historic Gateway: Charting Mogpog's Future</h2>
<p>As the northernmost municipality, Mogpog is the beating heart of Marinduque's logistics and the undisputed origin of its most famous cultural export: the Moriones tradition. It is a town where modern maritime trade meets deep historical roots.</p>

<hr />

<h2>I. The Geographic and Cultural Heart</h2>
<h3>Balanacan Port: The Island's Lifeline</h3>
<p>For most travelers and cargo, <strong>Balanacan Port</strong> is the first and last thing they see of Marinduque. Nestled in a naturally protected cove, it is one of the most picturesque seaports in the Philippines, marked by the towering statue of Our Lady of Peace and Good Voyage.</p>

<figure>
  <img src="/images/towns/mogpog_balanacan_art.png" alt="Balanacan Port in Mogpog" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">Inter-island ferries docked at the bustling, picturesque Balanacan Port.</figcaption>
</figure>

<h3>The Luzon Datum of 1911</h3>
<p>Situated atop Mount Mataas, the <strong>Luzon Datum</strong> serves as the primary geodetic reference center for all map-making and surveys in the Philippines. This historical marker literally makes Marinduque the "Heart of the Philippines."</p>

<figure>
  <img src="/images/towns/mogpog_luzon_datum_art.png" alt="Luzon Datum Marker in Mogpog" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">A panoramic view from the Luzon Datum, the geographic center of the Philippines.</figcaption>
</figure>

<hr />

<h2>II. Future Plans & Economic Outlook</h2>
<p>Mogpog's future is heavily tied to its role as the primary logistics gateway. The municipality is balancing massive infrastructure upgrades with the preservation of its sacred Moriones heritage.</p>

<ul>
<li><strong>Balanacan Port Modernization:</strong> The Philippine Ports Authority (PPA) is executing ongoing expansions to Balanacan Port to accommodate larger Ro-Ro vessels and cruise ships, aiming to increase trade throughput and lower commodity prices island-wide.</li>
<li><strong>Heritage Tourism Integration:</strong> To capitalize on the transit traffic, Mogpog is investing in cultural tourism zones, including improved access roads to the Luzon Datum and the Paadyao Cascades, ensuring visitors stay in the municipality rather than just passing through.</li>
<li><strong>The Moriones Cultural Center:</strong> Plans are underway to establish a dedicated museum and artisan workshop space to preserve the traditional carving of wooden Moriones masks, ensuring the craft survives the next generation.</li>
</ul>

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
        <td class="p-3">Handle larger Ro-Ro vessels and streamline cargo trade.</td>
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
<h2>The Archipelago's Playground: Santa Cruz Tomorrow</h2>
<p>Santa Cruz is the largest municipality in Marinduque, both in land area and in the sheer scale of its natural attractions. As the undisputed adventure capital of the province, it is leveraging its offshore islands to become a premier destination for sustainable island-hopping.</p>

<hr />

<h2>I. The Wonders of the Sea and Stone</h2>
<h3>Maniwaya Island & Palad Sandbar</h3>
<p>The crown jewels of Santa Cruz are its offshore islands. <strong>Maniwaya Island</strong> offers pristine white sands, while the mystical <strong>Palad Sandbar</strong> emerges only during low tide, offering visitors a fleeting, surreal experience of walking on water amidst the vibrant turquoise ocean.</p>

<figure>
  <img src="/images/towns/santacruz_palad_art.png" alt="Palad Sandbar in Santa Cruz" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">The breathtaking Palad Sandbar, surrounded by the crystal-clear waters of the Sibuyan Sea.</figcaption>
</figure>

<h3>The Bathala Caves</h3>
<p>Inland, Santa Cruz hides a complex network of limestone caverns known as the <strong>Bathala Caves</strong>. Believed by pre-colonial locals to be the dwelling place of the supreme god <em>Bathala</em>, the caves feature stunning stalactites, underground pools, and dramatic light rays piercing through natural skylights.</p>

<figure>
  <img src="/images/towns/santacruz_bathala_art.png" alt="Bathala Caves interior" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">Dramatic light rays illuminate the mystical interior of the Bathala Caves.</figcaption>
</figure>

<hr />

<h2>II. Future Plans & Economic Outlook</h2>
<p>With tourism acting as the primary economic engine, the strategic plan for Santa Cruz focuses heavily on upgrading marine infrastructure and establishing strict ecological carrying capacities to prevent over-tourism.</p>

<ul>
<li><strong>Buyabod Port Modernization:</strong> Buyabod Port, the primary jump-off point for island hopping, is being upgraded with better passenger terminals and regulated docking fees to ensure safety and streamline the tourist experience.</li>
<li><strong>Marine Conservation Initiatives:</strong> To protect the fragile coral reefs around Mongpong and Maniwaya, the local government is deploying artificial reefs and establishing "No-Take" zones to allow fish populations to recover.</li>
<li><strong>Ecotourism Training:</strong> The municipality is heavily investing in training local boatmen and guides, certifying them in ecological preservation and first-aid to elevate the standard of service for international tourists.</li>
</ul>

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
<h2>The Eastern Sanctuary: Torrijos Beyond 2026</h2>
<p>Situated on the southeastern coast, Torrijos is synonymous with relaxation, pristine shorelines, and fierce historical pride. As it looks toward the future, the municipality is balancing the modernization of its traditional crafts with the protection of its beloved coastal assets.</p>

<hr />

<h2>I. The Coast and the Conflict</h2>
<h3>Poctoy White Beach</h3>
<p><strong>Poctoy White Beach</strong> is arguably the most famous and accessible public beach on the Marinduque mainland. With its fine white sand, clear blue waters, and the towering silhouette of Mount Malindig in the background, it represents the ultimate provincial beach experience.</p>

<figure>
  <img src="/images/towns/torrijos_poctoy_art.png" alt="Poctoy White Beach in Torrijos" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">Relaxing views of Poctoy White Beach, set against a stunning mountainous backdrop.</figcaption>
</figure>

<h3>The Battle of Pulang Lupa</h3>
<p>High in the mountains of Torrijos lies the <strong>Pulang Lupa Historical Park</strong>. This monument commemorates the September 1900 Battle of Pulang Lupa, where Filipino revolutionaries achieved a decisive and brilliant victory against American forces during the Philippine-American War.</p>

<figure>
  <img src="/images/towns/torrijos_pulang_lupa_art.png" alt="Pulang Lupa Historical Monument" />
  <figcaption class="text-center text-sm text-slate-500 mt-2 italic">The Pulang Lupa monument, honoring the bravery of Marinduqueño revolutionaries.</figcaption>
</figure>

<hr />

<h2>II. Future Plans & Economic Outlook</h2>
<p>Torrijos is charting a course that protects its coastal environment while reviving its heritage industries for the modern market.</p>

<ul>
<li><strong>Coastal Resilience & Protection:</strong> Faced with changing tides, local initiatives are focusing on mangrove reforestation and seawall enhancements to protect the Poctoy shoreline from erosion without disrupting the natural aesthetic.</li>
<li><strong>Modernizing Loom Weaving:</strong> Torrijos is famous for its traditional buntal and abaca loom weaving. The government is providing grants to local weavers to integrate modern designs and establish e-commerce channels, ensuring this heritage craft reaches international markets.</li>
<li><strong>Historical Tourism Circuit:</strong> Investments are being made to improve the winding access roads to Pulang Lupa, with plans to build an interactive visitor center that properly honors the historical significance of the site.</li>
</ul>

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
        <td class="p-3">Elevate local textiles to global export quality.</td>
      </tr>
      <tr>
        <td class="p-3 font-medium">Heritage</td>
        <td class="p-3">Pulang Lupa Road Access</td>
        <td class="p-3">Increase historical tourism foot traffic safely.</td>
      </tr>
    </tbody>
  </table>
</div>
        `
    }
};
