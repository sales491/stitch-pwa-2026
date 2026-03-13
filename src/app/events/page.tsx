import type { Metadata } from 'next';
import MarinduqueEventsCalendar from '@/components/MarinduqueEventsCalendar';

export const metadata: Metadata = {
    title: 'Events in Marinduque',
    description: 'Discover upcoming festivals, community gatherings, and local events in Marinduque, Philippines. From the Moriones Festival to barangay fiestas — never miss a Marinduque event.',
    keywords: ['Marinduque events', 'Moriones Festival', 'barangay fiesta Marinduque', 'local events Philippines', 'Marinduque festival calendar'],
    openGraph: {
        title: 'Events in Marinduque',
        description: 'Discover local events, fiestas, and festivals happening across Marinduque island.',
        url: 'https://marinduquemarket.com/events',
    },
    alternates: { canonical: 'https://marinduquemarket.com/events' },
};

export default function EventsPage() {
    return <MarinduqueEventsCalendar />;
}
