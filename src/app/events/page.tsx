import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_EVENTS } from '@/utils/seo';
import MarinduqueEventsCalendar from '@/components/MarinduqueEventsCalendar';

export const metadata: Metadata = {
    title: 'Events in Marinduque',
    description: 'Discover upcoming festivals, fiestas, at mga kaganapan sa Marinduque — from the Moriones Festival to barangay fiestas. Huwag palampasin ang mga lokal na celebrations.',
    keywords: ['Marinduque events', 'Moriones Festival', 'barangay fiesta Marinduque', 'local events Philippines', 'Marinduque festival calendar', ...TAGALOG_KEYWORDS_EVENTS],
    openGraph: {
        title: 'Events in Marinduque',
        description: 'Discover local events, fiestas, and festivals happening across Marinduque island.',
        url: 'https://marinduquemarket.com/events',
    },
    alternates: hreflangAlternates('/events'),
};

export default function EventsPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: metadata.openGraph?.title || 'Events in Marinduque',
                    description: metadata.openGraph?.description || 'Discover local events, fiestas, and festivals happening across Marinduque island.',
                    url: 'https://marinduquemarket.com/events'
                }) }}
            />
            <MarinduqueEventsCalendar />
        </>
    );
}
