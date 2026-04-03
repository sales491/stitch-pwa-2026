export const dynamic = 'force-dynamic';
import IslandHoppingHub from '@/components/IslandHoppingHub';
import SeoTextBlock from '@/components/SeoTextBlock';

export const metadata = {
    title: 'Island Hopping & Boat Operators | Marinduque Market Hub',
    description: 'Find local boat operators and tour guides for Maniwaya Island, Palad Sandbar, Tres Reyes Islands, and island hopping in Marinduque.',
};

export default function Page() {
    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'TouristAttraction',
            name: 'Marinduque Island Hopping',
            description: 'Island hopping destinations including Tres Reyes Islands, Maniwaya Island, and Palad Sandbar.',
            availableLanguage: ['English', 'Tagalog'],
            touristType: ['Sightseeing', 'Adventure', 'Beach'],
            publicAccess: true,
            isAccessibleForFree: false,
        }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <IslandHoppingHub />
            <SeoTextBlock heading="Island Hopping in Marinduque">
                <p>Marinduque offers some of the best island hopping experiences in the Philippines. The most popular destinations include the <strong>Tres Reyes Islands</strong> — Gaspar, Melchor, and Baltazar — named after the Three Kings. These uninhabited islands feature pristine white sand beaches, crystal-clear waters, and vibrant coral reefs perfect for snorkeling.</p>
                <p><strong>Maniwaya Island</strong> and <strong>Palad Sandbar</strong> in Santa Cruz are the island's most photographed destinations. Maniwaya features a long stretch of white sand and budget-friendly accommodations, while the Palad Sandbar is a stunning sandspit that appears during low tide. Other popular spots include <strong>Bathala Caves</strong>, <strong>Malbog Sulfur Springs</strong>, and the <strong>Bellarocca Island Resort</strong>.</p>
                
                <h3 className="text-sm font-black text-slate-800 dark:text-zinc-200 mt-4 mb-2">Standard Island Hopping Prices (2026)</h3>
                <p>Island hopping tours typically depart from Santa Cruz municipal port or Torrijos. Bangka (outrigger boat) rates depend on the number of islands and distance. Most tours include 2–3 island stops and take 4–6 hours. The best season for island hopping is March through May, when seas are calmest.</p>
                <ul className="list-disc pl-5 my-2 space-y-1 text-[11px] text-slate-600 dark:text-zinc-400">
                    <li><strong>Maniwaya + Palad Sandbar (from Santa Cruz):</strong> ₱1,500 – ₱2,000 per boat (good for 6-8 pax)</li>
                    <li><strong>Tres Reyes Islands (from Gasan):</strong> ₱1,000 – ₱1,500 per boat</li>
                    <li><strong>Polo + Mongpong Island:</strong> ₱2,500 – ₱3,500 per boat</li>
                    <li><strong>Environmental/Entrance Fees:</strong> Typically ₱50 – ₱100 per head per island</li>
                </ul>
            </SeoTextBlock>
        </>
    );
}
