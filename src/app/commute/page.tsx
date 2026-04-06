import type { Metadata } from 'next';
import { hreflangAlternates } from '@/utils/seo';
import CommuterDeliveryHub from '@/components/CommuterDeliveryHub';
import SeoTextBlock from '@/components/SeoTextBlock';

export const metadata: Metadata = {
    title: 'Commute & Delivery — Marinduque',
    description: 'Find local commute and delivery services in Marinduque. Book tricycles, multicabs, jeepneys, and delivery riders across Boac, Gasan, Mogpog, Santa Cruz, Torrijos, and Buenavista.',
    keywords: ['commute Marinduque', 'delivery Marinduque', 'tricycle hire Boac', 'local delivery Philippines', 'Marinduque transport'],
    openGraph: {
        title: 'Commute & Delivery — Marinduque',
        description: 'Find local transport and delivery services across Marinduque island.',
        url: 'https://marinduquemarket.com/commute',
    },
    alternates: hreflangAlternates('/commute'),
};

export default function CommuteBoard() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'TransportationService',
                    name: metadata.openGraph?.title || 'Commute & Delivery — Marinduque',
                    description: metadata.openGraph?.description || 'Find local transport and delivery services across Marinduque island.',
                    url: 'https://marinduquemarket.com/commute',
                    areaServed: {
                        '@type': 'AdministrativeArea',
                        name: 'Marinduque'
                    }
                }) }}
            />
            <CommuterDeliveryHub />
            <SeoTextBlock heading="Getting Around Marinduque Island">
                <p>Marinduque is a small, heart-shaped island in the MIMAROPA region of the Philippines. Getting around the island is mainly done by <strong>tricycle</strong> (the primary mode of local transport) and <strong>jeepney</strong> or multicab for longer inter-town routes. There are no ride-hailing apps like Grab on the island — you flag down or book tricycles directly.</p>
                <p>The six municipalities of Marinduque — <strong>Boac</strong> (the capital), <strong>Mogpog</strong>, <strong>Gasan</strong>, <strong>Santa Cruz</strong>, <strong>Torrijos</strong>, and <strong>Buenavista</strong> — are connected by a single circumferential road. A full loop around the island takes about 2–3 hours by motorcycle. Tricycle fares within town centers typically range from ₱20–₱50, while inter-town trips may cost ₱100–₱300.</p>
                <p>This page connects you with local commute operators and delivery riders who service different parts of the island. You can find tricycle drivers available for hire, delivery services for packages and parcels, and shared transport options for daily commuters.</p>
            </SeoTextBlock>
        </>
    );
}
