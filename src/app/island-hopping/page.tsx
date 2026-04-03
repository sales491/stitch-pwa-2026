export const dynamic = 'force-dynamic';
import IslandHoppingHub from '@/components/IslandHoppingHub';
import SeoTextBlock from '@/components/SeoTextBlock';

export const metadata = {
    title: 'Island Hopping & Boat Operators | Marinduque Market Hub',
    description: 'Find local boat operators and tour guides for Maniwaya Island, Palad Sandbar, Tres Reyes Islands, and island hopping in Marinduque.',
};

export default function Page() {
    return (
        <>
            <IslandHoppingHub />
            <SeoTextBlock heading="Island Hopping in Marinduque">
                <p>Marinduque offers some of the best island hopping experiences in the Philippines. The most popular destinations include the <strong>Tres Reyes Islands</strong> — Gaspar, Melchor, and Baltazar — named after the Three Kings. These uninhabited islands feature pristine white sand beaches, crystal-clear waters, and vibrant coral reefs perfect for snorkeling.</p>
                <p><strong>Maniwaya Island</strong> and <strong>Palad Sandbar</strong> in Santa Cruz are the island's most photographed destinations. Maniwaya features a long stretch of white sand and budget-friendly accommodations, while the Palad Sandbar is a stunning sandspit that appears during low tide. Other popular spots include <strong>Bathala Caves</strong>, <strong>Malbog Sulfur Springs</strong>, and the <strong>Bellarocca Island Resort</strong>.</p>
                <p>Island hopping tours typically depart from Santa Cruz municipal port or Torrijos. Bangka (outrigger boat) rates range from ₱1,500–₱3,500 per boat (not per person), depending on the number of islands and distance. Most tours include 2–3 island stops and take 4–6 hours. The best season for island hopping is March through May, when seas are calmest.</p>
            </SeoTextBlock>
        </>
    );
}
